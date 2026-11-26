// Đặt tại: app/api/chat/route.ts
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { rateLimit } from "@/lib/chat/rate-limit";

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_MESSAGES = 10; // chỉ gửi 10 tin gần nhất
const MAX_CHARS = 500; // giới hạn độ dài mỗi tin
const MAX_OUTPUT_TOKENS = 400;

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as Record<string, unknown>;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    )
      return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (!text) return null;
    messages.push({ role, content: text });
  }
  return messages[messages.length - 1]?.role === "user" ? messages : null;
}

const UPSTREAM_TIMEOUT_MS = 25_000;

function getIp(req: Request): string {
  const vercelIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercelIp) return vercelIp;

  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Chatbot chưa được cấu hình." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  const messages = parseMessages(body);
  if (!messages) {
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const limit = rateLimit(getIp(req));
  if (!limit.ok) {
    const error =
      limit.reason === "daily"
        ? "Chatbot đã hết lượt trong hôm nay. Bạn quay lại vào ngày mai hoặc liên hệ trực tiếp nhé."
        : "Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.";
    return Response.json({ error }, { status: 429 });
  }

  const upstream = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      // Kiểm tra tên model còn khả dụng tại console.groq.com/docs/models
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      stream: true,
      temperature: 0.3,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    }),
    signal: AbortSignal.any([
      req.signal,
      AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    ]),
  }).catch(() => null);

  if (!upstream || !upstream.ok || !upstream.body) {
    return Response.json(
      { error: "Chatbot đang bận, vui lòng thử lại sau." },
      { status: 502 }
    );
  }

  // Chuyển SSE của Groq thành luồng text thuần để client đọc đơn giản
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const source = upstream.body;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      reader = source.getReader();
      let buffer = "";
      try {
        while (!closed) {
          const { done, value } = await reader.read();
          if (done || closed) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (closed) break;
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const json = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const text = json.choices?.[0]?.delta?.content;
              if (text && !closed) controller.enqueue(encoder.encode(text));
            } catch {
              // bỏ qua dòng không phải JSON
            }
          }
        }
      } catch {
        // client ngắt kết nối hoặc upstream lỗi
      } finally {
        reader?.releaseLock();
        if (!closed) {
          closed = true;
          controller.close();
        }
      }
    },
    cancel() {
      closed = true;
      void reader?.cancel();
      void source.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
