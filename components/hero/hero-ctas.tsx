"use client";

import { ContactButton } from "@/components/contact/contact-button";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { ArrowRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  const { t } = useTranslation();

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.42, ease: EASE } }}
        className="mt-1 flex flex-wrap items-center gap-2.5"
      >
        <ContactButton />

        <motion.div
          layout
          transition={{ layout: { duration: 0.42, ease: EASE } }}
        >
          <Link
            href="/projects"
            className="focus-ring type-label group border-border-hairline bg-surface-1 text-foreground hover:border-border-subtle hover:bg-surface-2 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4.5 transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98]"
          >
            <span>{t(TRANSLATION_KEYS.hero.viewWork)}</span>
            <ArrowRight
              className="text-text-secondary group-hover:text-foreground h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
