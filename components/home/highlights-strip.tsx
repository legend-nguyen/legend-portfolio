"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

type HighlightItem = {
  id: string;
  labelKey: TranslationKey;
  valueKey: TranslationKey;
  detailKey: TranslationKey;
};

const HIGHLIGHTS: readonly HighlightItem[] = [
  {
    id: "experience",
    labelKey: TRANSLATION_KEYS.home.highlights.expLabel,
    valueKey: TRANSLATION_KEYS.home.highlights.expValue,
    detailKey: TRANSLATION_KEYS.home.highlights.expDetail,
  },
  {
    id: "workflow",
    labelKey: TRANSLATION_KEYS.home.highlights.aiLabel,
    valueKey: TRANSLATION_KEYS.home.highlights.aiValue,
    detailKey: TRANSLATION_KEYS.home.highlights.aiDetail,
  },
  {
    id: "stack",
    labelKey: TRANSLATION_KEYS.home.highlights.stackLabel,
    valueKey: TRANSLATION_KEYS.home.highlights.stackValue,
    detailKey: TRANSLATION_KEYS.home.highlights.stackDetail,
  },
];

export function HighlightsStrip(): ReactNode {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t(TRANSLATION_KEYS.home.highlights.expLabel)}
      className="relative w-full"
    >
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <FadeIn delay={0.08} duration={0.5}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <SpotlightCard
                key={item.id}
                radius={260}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="type-meta text-text-muted">
                    {t(item.labelKey)}
                  </span>
                  <p className="text-foreground type-heading">
                    {t(item.valueKey)}
                  </p>
                  <p className="text-text-secondary type-body">
                    {t(item.detailKey)}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
