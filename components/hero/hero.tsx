"use client";

import type { ReactNode } from "react";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { HeroCtas } from "./hero-ctas";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { SplitText } from "@/components/ui/split-text";
import { PortraitMorph } from "./portrait-morph";

const PORTRAIT_SRC = "/images/hero/legend.png";
const PORTRAIT_HOVER_SRC = "/images/hero/legend_wave.png";
const GREETING_DELAY_MS = 40;

export function Hero(): ReactNode {
  const { t } = useTranslation();
  const greetingText = `${t(TRANSLATION_KEYS.hero.greetingPrefix)} 👋${t(
    TRANSLATION_KEYS.hero.greetingSuffix
  )}`;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-44 pb-24 sm:px-10 sm:pt-56 sm:pb-32">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn>
            <div data-glow-block className="flex flex-col gap-4">
              <p className="text-[20px] leading-tight tracking-tight font-medium text-foreground">
                <SplitText
                  tag="span"
                  text={greetingText}
                  effect="rise"
                  hoverEffect="wave"
                  splitType="chars"
                  trigger="load"
                  delay={GREETING_DELAY_MS}
                  duration={1}
                  staggerFrom="start"
                  textAlign="left"
                  className="text-[20px] leading-tight tracking-tight font-medium text-foreground"
                />
              </p>

              <h1 className="text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[2.5rem] lg:text-[3.65rem]">
                <span className="block whitespace-nowrap">
                  {t(TRANSLATION_KEYS.hero.headlineLine1)}
                </span>
                <span className="block whitespace-nowrap">
                  {t(TRANSLATION_KEYS.hero.headlineLine2)}
                </span>
              </h1>

              <p className="max-w-[34ch] text-[22px] leading-[1.4] tracking-tight text-foreground/65">
                {t(TRANSLATION_KEYS.hero.subtitle)}
              </p>

              <HeroCtas />
            </div>
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <div
              data-glow-block
              className="relative aspect-square w-full md:max-w-105 overflow-hidden rounded-4xl border border-foreground/8 bg-background p-1.5 shadow-sm"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt={t(TRANSLATION_KEYS.hero.portraitAlt)}
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}
