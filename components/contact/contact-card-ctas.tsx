"use client";

import { useTranslation } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { Check, Copy, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EMAIL = "thoainguyen.240899@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactCardCtas(): ReactNode {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyEmail = useCallback(async (): Promise<void> => {
    let success = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      success = true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      }
      document.body.removeChild(textarea);
    }

    if (success) {
      setCopied(true);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 1800);
    }
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Primary high-contrast solid monochrome Contact CTA */}
      <a
        href={`mailto:${EMAIL}`}
        className="focus-ring type-label bg-foreground text-background inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4.5 transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t(TRANSLATION_KEYS.contact.buttonLabel)}</span>
      </a>

      {/* Quick Copy Email button with minimal inline "Copied" feedback */}
      <button
        type="button"
        onClick={() => void handleCopyEmail()}
        aria-label={
          copied
            ? t(TRANSLATION_KEYS.contact.emailCopied)
            : t(TRANSLATION_KEYS.contact.copyEmail, { email: EMAIL })
        }
        className="focus-ring type-label border-border-hairline bg-surface-2 text-foreground hover:border-border-subtle hover:bg-surface-3 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98]"
      >
        <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              <motion.span
                key="copied-icon"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.7 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.16,
                  ease: EASE,
                }}
                className="inline-flex"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="copy-icon"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.7 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.16,
                  ease: EASE,
                }}
                className="text-text-secondary inline-flex"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="whitespace-nowrap">
          {copied
            ? t(TRANSLATION_KEYS.contact.copied)
            : t(TRANSLATION_KEYS.contact.copyEmailLabel)}
        </span>
      </button>
    </div>
  );
}
