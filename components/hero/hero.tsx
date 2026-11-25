"use client";

import { BlurReveal, FadeInText } from "@/components/motion/text-reveal";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { SplitText } from "@/components/ui/split-text";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import type { ReactNode } from "react";

import { HeroCtas } from "./hero-ctas";
import { PortraitMorph } from "./portrait-morph";

const PORTRAIT_SRC = "/images/hero/legend.png";
const PORTRAIT_HOVER_SRC = "/images/hero/legend_wave.png";
const GREETING_DELAY_MS = 24;

export function Hero(): ReactNode {
  const { t } = useTranslation();
  const greetingText = `${t(TRANSLATION_KEYS.hero.greetingPrefix)}${t(
    TRANSLATION_KEYS.hero.greetingSuffix
  )}`;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-32 pb-12 sm:px-10 sm:pt-44 sm:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.18fr_0.82fr] md:gap-12">
          <FadeIn duration={0.5}>
            <div data-glow-block className="flex flex-col items-start gap-5">
              <div className="flex flex-col gap-3">
                <p className="text-text-secondary type-lead font-medium">
                  <SplitText
                    tag="span"
                    text={greetingText}
                    effect="rise"
                    hoverEffect="wave"
                    splitType="chars"
                    trigger="load"
                    delay={GREETING_DELAY_MS}
                    duration={0.65}
                    staggerFrom="start"
                    textAlign="left"
                    className="text-[20px] leading-tight tracking-tight font-medium text-foreground"
                  />
                </p>

                <h1 className="text-foreground type-display">
                  <BlurReveal
                    as="span"
                    by="word"
                    trigger="mount"
                    delay={0.04}
                    duration={0.48}
                    className="block"
                  >
                    {t(TRANSLATION_KEYS.hero.headlineLine1)}
                  </BlurReveal>
                  <BlurReveal
                    as="span"
                    by="word"
                    trigger="mount"
                    delay={0.14}
                    duration={0.48}
                    className="block"
                  >
                    {t(TRANSLATION_KEYS.hero.headlineLine2)}
                  </BlurReveal>
                </h1>
              </div>

              <FadeInText
                as="p"
                trigger="mount"
                delay={0.2}
                duration={0.48}
                className="text-text-secondary type-lead max-w-[46ch]"
              >
                {t(TRANSLATION_KEYS.hero.subtitle)}
              </FadeInText>

              <HeroCtas />
            </div>
          </FadeIn>

          <ScaleUnblur
            duration={0.65}
            className="flex justify-stretch md:justify-end"
          >
            <div
              data-glow-block
              className="group/portrait border-border-hairline bg-surface-1 hover:border-border-subtle relative aspect-square w-full overflow-hidden rounded-2xl border transition-colors duration-300 md:max-w-[23.5rem]"
            >
              <div className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:scale-[1.02]">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt={t(TRANSLATION_KEYS.hero.portraitAlt)}
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/[0.06] ring-inset dark:ring-white/[0.06]"
              />
            </div>
          </ScaleUnblur>
        </div>
      </div>
    </section>
  );
}
