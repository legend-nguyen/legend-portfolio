"use client";

import { BlurReveal, FadeInText } from "@/components/motion/text-reveal";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import type { ReactNode } from "react";

export function AboutHeader(): ReactNode {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-275 px-6 pt-32 pb-8 sm:px-10 sm:pt-44 sm:pb-10">
      <div className="flex flex-col items-start gap-3">
        <BlurReveal
          as="h1"
          by="word"
          trigger="mount"
          className="text-foreground type-title"
        >
          {t(TRANSLATION_KEYS.about.pageTitle)}
        </BlurReveal>
        <FadeInText
          as="p"
          trigger="mount"
          delay={0.1}
          className="text-text-secondary type-lead max-w-[56ch]"
        >
          {t(TRANSLATION_KEYS.about.pageSubtitle)}
        </FadeInText>
      </div>
    </section>
  );
}

