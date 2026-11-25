"use client";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { MessageCircle, RotateCcw, SendHorizontal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type Message = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "portfolio-chat-v1";
const MAX_INPUT = 500;
const EASE = [0.22, 1, 0.36, 1] as const;
const INLINE_MARKDOWN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function isSafeHref(href: string): boolean {
  return (
    href.startsWith("/") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:")
  );
}

function renderMessageContent(content: string): ReactNode {
  const parts = content.split(INLINE_MARKDOWN_RE);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2]?.trim();
      if (label && href && isSafeHref(href)) {
        const isExternal =
          href.startsWith("https://") || href.startsWith("http://");
        return (
          <a
            key={idx}
            href={href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="focus-ring rounded-xs underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {label}
          </a>
        );
      }
    }

    return part;
  });
}

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

export function ChatWidget(): ReactNode {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelId = useId();
  const bottomRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wasOpenRef = useRef(false);

  const suggestions = [
    t(TRANSLATION_KEYS.chat.suggestions.s1),
    t(TRANSLATION_KEYS.chat.suggestions.s2),
    t(TRANSLATION_KEYS.chat.suggestions.s3),
    t(TRANSLATION_KEYS.chat.suggestions.s4),
  ];

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore if sessionStorage is blocked
    }
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, prefersReducedMotion]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      const id = requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  async function send(text: string): Promise<void> {
    const content = text.trim();
    if (!content || loading) return;

    setError(null);
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? t(TRANSLATION_KEYS.chat.genericError));
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: answer }]);
      }

      if (!answer.trim()) {
        throw new Error(t(TRANSLATION_KEYS.chat.emptyResponseError));
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setMessages(next);
      setError(
        e instanceof Error ? e.message : t(TRANSLATION_KEYS.chat.genericError)
      );
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void send(input);
  }

  function reset(): void {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="pointer-events-none fixed top-1/2 right-[max(1rem,env(safe-area-inset-right))] left-[max(1rem,env(safe-area-inset-left))] z-40 flex -translate-y-1/2 items-center justify-end sm:right-5 sm:left-auto sm:gap-3">
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="chat-panel"
            id={panelId}
            data-lenis-prevent
            aria-label={t(TRANSLATION_KEYS.chat.sectionAriaLabel)}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: 10 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: EASE }
            }
            className="border-border-hairline bg-surface-1/95 text-foreground pointer-events-auto mx-auto flex h-[min(28rem,78dvh)] w-full max-w-sm origin-center flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md sm:mx-0 sm:w-[min(24rem,calc(100vw-9rem))] sm:origin-right"
          >
            <header className="border-border-hairline flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-foreground type-label">
                {t(TRANSLATION_KEYS.chat.title)}
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring type-meta text-text-secondary hover:bg-surface-2 hover:text-foreground inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-2.5 font-medium transition-colors"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>{t(TRANSLATION_KEYS.chat.clear)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t(TRANSLATION_KEYS.chat.closeLabel)}
                  className="focus-ring text-text-secondary hover:bg-surface-2 hover:text-foreground inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-3.5"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-text-secondary type-body">
                    {t(TRANSLATION_KEYS.chat.welcome)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void send(suggestion)}
                        className="focus-ring type-meta border-border-hairline bg-surface-2/70 text-text-secondary hover:border-border-subtle hover:bg-surface-2 hover:text-foreground cursor-pointer rounded-full border px-3 py-1.5 text-left font-medium transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const isLastStreaming =
                  loading && index === messages.length - 1;
                const isThinking =
                  !isUser && isLastStreaming && !message.content;
                return (
                  <motion.div
                    key={index}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 4, scale: 0.99 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.18, ease: EASE }
                    }
                    className={
                      isUser
                        ? "flex min-w-0 justify-end"
                        : "flex min-w-0 justify-start"
                    }
                  >
                    <p
                      className={
                        "type-body min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere] " +
                        (isUser
                          ? "bg-foreground text-background"
                          : "border-border-hairline bg-surface-2 text-foreground border")
                      }
                    >
                      {isThinking ? (
                        <span className="text-text-secondary inline-flex items-center gap-1.5">
                          <span>{t(TRANSLATION_KEYS.chat.thinking)}</span>
                          <span
                            className="inline-flex items-center gap-0.5"
                            aria-hidden="true"
                          >
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                key={dot}
                                className="bg-text-secondary h-1 w-1 rounded-full"
                                animate={
                                  prefersReducedMotion
                                    ? { opacity: 0.7 }
                                    : {
                                        opacity: [0.3, 1, 0.3],
                                        y: [0, -2.5, 0],
                                      }
                                }
                                transition={
                                  prefersReducedMotion
                                    ? { duration: 0 }
                                    : {
                                        duration: 0.9,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: dot * 0.16,
                                      }
                                }
                              />
                            ))}
                          </span>
                        </span>
                      ) : isUser ? (
                        message.content
                      ) : (
                        renderMessageContent(message.content)
                      )}
                    </p>
                  </motion.div>
                );
              })}

              {error && (
                <p
                  role="alert"
                  className="type-meta border-border-subtle bg-surface-2 text-foreground rounded-xl border px-3 py-2 break-words"
                >
                  {error}
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="border-border-hairline flex items-center gap-2 border-t p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={MAX_INPUT}
                placeholder={t(TRANSLATION_KEYS.chat.inputPlaceholder)}
                aria-label={t(TRANSLATION_KEYS.chat.inputAriaLabel)}
                className="focus-ring type-body border-border-hairline bg-surface-2 text-foreground placeholder:text-text-muted min-w-0 flex-1 rounded-full border px-3.5 py-1.5"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t(TRANSLATION_KEYS.chat.send)}
                className="focus-ring type-label bg-foreground text-background inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">
                  {t(TRANSLATION_KEYS.chat.send)}
                </span>
              </button>
            </form>
            <p className="type-meta text-text-muted px-3.5 pb-2.5">
              {t(TRANSLATION_KEYS.chat.disclaimer)}
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? t(TRANSLATION_KEYS.chat.closeLabel)
            : t(TRANSLATION_KEYS.chat.openLabel)
        }
        whileHover={
          prefersReducedMotion ? { scale: 1, y: 0 } : { scale: 1.04, y: -1 }
        }
        whileTap={prefersReducedMotion ? { scale: 1 } : { scale: 0.95 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 380, damping: 28 }
        }
        className={`focus-ring type-label border-border-hairline bg-surface-1/90 text-foreground hover:border-border-subtle hover:bg-surface-2 pointer-events-auto h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-full border shadow-[0_4px_18px_-6px_rgb(0_0_0/0.16)] backdrop-blur-md transition-[color,background-color,border-color] duration-200 sm:w-auto sm:px-4 dark:shadow-[0_6px_22px_-6px_rgb(0_0_0/0.65)] ${
          open ? "hidden sm:inline-flex" : "inline-flex"
        }`}
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {open ? (
              <motion.span
                key="close-icon"
                initial={
                  prefersReducedMotion
                    ? false
                    : { rotate: -90, scale: 0.5, opacity: 0 }
                }
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: 90, scale: 0.5, opacity: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: EASE }
                }
                className="inline-flex"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="chat-icon"
                initial={
                  prefersReducedMotion
                    ? false
                    : { rotate: 90, scale: 0.5, opacity: 0 }
                }
                animate={
                  prefersReducedMotion
                    ? { rotate: 0, scale: 1, opacity: 1 }
                    : { rotate: [0, -8, 8, 0], scale: 1, opacity: 1 }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { rotate: -90, scale: 0.5, opacity: 0 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: EASE }
                }
                className="inline-flex"
              >
                <motion.span
                  animate={
                    prefersReducedMotion
                      ? { rotate: 0, scale: 1, y: 0 }
                      : {
                          rotate: [0, -22, 22, -18, 18, -10, 10, 0],
                          scale: [1, 1.25, 1.25, 1.18, 1.18, 1.08, 1.08, 1],
                          y: [0, -2.5, 0, -2, 0, -1, 0, 0],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.7,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 3.5,
                          delay: 1.5,
                        }
                  }
                  className="inline-flex origin-center"
                >
                  <MessageCircle
                    className="text-text-secondary h-4 w-4"
                    aria-hidden="true"
                  />
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="hidden sm:inline">
          {open
            ? t(TRANSLATION_KEYS.chat.closeLabel)
            : t(TRANSLATION_KEYS.chat.buttonLabel)}
        </span>
      </motion.button>
    </div>
  );
}
