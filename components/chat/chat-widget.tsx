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
    <div className="pointer-events-none fixed left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] top-1/2 z-40 flex -translate-y-1/2 items-center justify-end sm:left-auto sm:gap-3">
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
                : { opacity: 0, scale: 0.94, y: 12, filter: "blur(6px)" }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 10, filter: "blur(6px)" }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.28, ease: EASE }
            }
            className="pointer-events-auto mx-auto flex h-[min(30rem,80dvh)] w-full max-w-sm origin-bottom flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-background text-foreground shadow-lg sm:mx-0 sm:w-[min(24rem,calc(100vw-9rem))] sm:origin-right"
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-sans text-sm font-semibold tracking-tight text-foreground">
                {t(TRANSLATION_KEYS.chat.title)}
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>{t(TRANSLATION_KEYS.chat.clear)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t(TRANSLATION_KEYS.chat.closeLabel)}
                  className="focus-ring inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(TRANSLATION_KEYS.chat.welcome)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        onClick={() => void send(suggestion)}
                        whileHover={
                          prefersReducedMotion ? { scale: 1 } : { scale: 1.02 }
                        }
                        whileTap={
                          prefersReducedMotion ? { scale: 1 } : { scale: 0.98 }
                        }
                        transition={{ duration: 0.16, ease: EASE }}
                        className="focus-ring cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => {
                const isUser = message.role === "user";
                const isLastStreaming =
                  loading && index === messages.length - 1;
                return (
                  <motion.div
                    key={index}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 6, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.22, ease: EASE }
                    }
                    className={
                      isUser ? "flex justify-end" : "flex justify-start"
                    }
                  >
                    <p
                      className={
                        "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed " +
                        (isUser
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground")
                      }
                    >
                      {message.content || (isLastStreaming ? "…" : "")}
                    </p>
                  </motion.div>
                );
              })}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-foreground/15 bg-muted px-3 py-2 text-xs text-foreground"
                >
                  {error}
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={MAX_INPUT}
                placeholder={t(TRANSLATION_KEYS.chat.inputPlaceholder)}
                aria-label={t(TRANSLATION_KEYS.chat.inputAriaLabel)}
                className="focus-ring min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t(TRANSLATION_KEYS.chat.send)}
                whileHover={
                  prefersReducedMotion || loading || !input.trim()
                    ? { scale: 1 }
                    : { scale: 1.03 }
                }
                whileTap={
                  prefersReducedMotion || loading || !input.trim()
                    ? { scale: 1 }
                    : { scale: 0.96 }
                }
                transition={{ duration: 0.16, ease: EASE }}
                className="focus-ring inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">
                  {t(TRANSLATION_KEYS.chat.send)}
                </span>
              </motion.button>
            </form>
            <p className="px-3 pb-2.5 text-[11px] text-muted-foreground">
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
        className={`focus-ring pointer-events-auto cursor-pointer items-center gap-2 rounded-full border border-foreground/8 bg-background px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted ${open ? "hidden sm:inline-flex" : "inline-flex"
          }`}
      >
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
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
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
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
