"use client";

import { useTranslation } from "@/lib/i18n";
import { LANGUAGE_OPTIONS, Language, TRANSLATION_KEYS } from "@/shared/i18n";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function LanguageDropdown(): ReactNode {
  const { language, setLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(
      0,
      LANGUAGE_OPTIONS.findIndex((option) => option.value === language)
    )
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  const currentOption =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent): void => {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const optionEl = optionRefs.current[activeIndex];
    optionEl?.focus();
  }, [open, activeIndex]);

  const openMenuWithIndex = (index: number): void => {
    const bounded = Math.max(0, Math.min(LANGUAGE_OPTIONS.length - 1, index));
    setActiveIndex(bounded);
    setOpen(true);
  };

  const selectLanguage = (nextLanguage: Language): void => {
    setLanguage(nextLanguage);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>
  ): void => {
    const selectedIdx = Math.max(
      0,
      LANGUAGE_OPTIONS.findIndex((option) => option.value === language)
    );

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        openMenuWithIndex(open ? activeIndex + 1 : selectedIdx);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        openMenuWithIndex(open ? activeIndex - 1 : LANGUAGE_OPTIONS.length - 1);
        break;
      }
      case "Escape": {
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>): void => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % LANGUAGE_OPTIONS.length);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setActiveIndex(
          (prev) =>
            (prev - 1 + LANGUAGE_OPTIONS.length) % LANGUAGE_OPTIONS.length
        );
        break;
      }
      case "Home": {
        event.preventDefault();
        setActiveIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        setActiveIndex(LANGUAGE_OPTIONS.length - 1);
        break;
      }
      case "Escape": {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      }
      case "Tab": {
        setOpen(false);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            const selectedIdx = Math.max(
              0,
              LANGUAGE_OPTIONS.findIndex((option) => option.value === language)
            );
            openMenuWithIndex(selectedIdx);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-label={t(TRANSLATION_KEYS.language.ariaLabel)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="focus-ring type-meta text-text-secondary hover:bg-surface-2 hover:text-foreground inline-flex h-8 cursor-pointer items-center gap-1 rounded-full px-2.5 font-medium transition-colors duration-200"
      >
        <span>{currentOption?.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`text-text-muted h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label={t(TRANSLATION_KEYS.language.ariaLabel)}
            onKeyDown={handleListKeyDown}
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="border-border-hairline bg-surface-1/95 absolute top-full right-0 z-50 mt-2.5 min-w-28 origin-top-right rounded-xl border p-1 shadow-lg backdrop-blur-md"
          >
            {LANGUAGE_OPTIONS.map((option, index) => {
              const isSelected = option.value === language;
              return (
                <li key={option.value} role="none">
                  <button
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-label={t(TRANSLATION_KEYS.language.selectOption, {
                      language: option.nativeName,
                    })}
                    onClick={() => selectLanguage(option.value)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`focus-ring type-meta flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                      isSelected
                        ? "bg-surface-2 text-foreground dark:bg-surface-3"
                        : "text-text-secondary hover:bg-surface-2 hover:text-foreground"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check
                        className="text-foreground h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
