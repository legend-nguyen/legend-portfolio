"use client";

import { useTranslation } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

const EMAIL = "thoainguyen.240899@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactButton(): ReactNode {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <motion.button
      type="button"
      layout={!prefersReducedMotion}
      onClick={handleCopy}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={
        copied
          ? t(TRANSLATION_KEYS.contact.emailCopied)
          : open
            ? t(TRANSLATION_KEYS.contact.copyEmail, { email: EMAIL })
            : t(TRANSLATION_KEYS.contact.showEmail)
      }
      transition={{
        layout: {
          duration: prefersReducedMotion ? 0 : 0.45,
          ease: EASE,
        },
      }}
      style={{ borderRadius: 9999 }}
      className="focus-ring type-label bg-foreground text-background relative inline-flex h-10 cursor-pointer items-center justify-center px-4.5 transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
    >
      <motion.span
        layout={prefersReducedMotion ? false : "position"}
        className="relative inline-flex items-center"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <motion.span
              key="email"
              layout={prefersReducedMotion ? false : "position"}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, filter: "blur(8px)" }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: EASE,
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <AnimatePresence initial={false} mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { scale: 0.5, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { scale: 0.5, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.2,
                        ease: EASE,
                      }}
                      className="inline-flex"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { scale: 0.5, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { scale: 0.5, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.2,
                        ease: EASE,
                      }}
                      className="inline-flex"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="tabular-nums">{EMAIL}</span>
            </motion.span>
          ) : (
            <motion.span
              key="contact"
              layout={prefersReducedMotion ? false : "position"}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, filter: "blur(8px)" }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.35,
                ease: EASE,
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t(TRANSLATION_KEYS.contact.buttonLabel)}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
