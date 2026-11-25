// Đặt tại: lib/chat/rate-limit.ts
// Rate limit trong bộ nhớ: đủ cho giai đoạn đầu, nhưng trên serverless (Vercel) mỗi instance
// có bộ đếm riêng nên chỉ giảm bớt spam chứ không chặn tuyệt đối.
// Khi cần chắc chắn, thay bằng Upstash Redis (@upstash/ratelimit).

const PER_IP_LIMIT = 8; // số tin nhắn / IP / phút
const WINDOW_MS = 60_000;
const GLOBAL_DAILY_LIMIT = 800; // chừa biên so với hạn mức requests/ngày của free tier

const ipHits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

export type LimitResult = { ok: true } | { ok: false; reason: "ip" | "daily" };

export function rateLimit(ip: string): LimitResult {
  const now = Date.now();

  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  if (dayCount >= GLOBAL_DAILY_LIMIT) return { ok: false, reason: "daily" };

  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP_LIMIT) {
    ipHits.set(ip, recent);
    return { ok: false, reason: "ip" };
  }

  recent.push(now);
  ipHits.set(ip, recent);
  dayCount += 1;

  // Dọn Map để không phình bộ nhớ
  if (ipHits.size > 5_000) {
    for (const [key, times] of ipHits) {
      if (times.every((t) => now - t >= WINDOW_MS)) ipHits.delete(key);
    }
  }
  return { ok: true };
}
