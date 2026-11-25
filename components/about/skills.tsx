"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

const SKILL_KEYS: readonly TranslationKey[] = [
  TRANSLATION_KEYS.about.skills.items.aiaD,
  TRANSLATION_KEYS.about.skills.items.frontendDev,
  TRANSLATION_KEYS.about.skills.items.backendDev,
  TRANSLATION_KEYS.about.skills.items.designSystems,
  TRANSLATION_KEYS.about.skills.items.uiUx,
  TRANSLATION_KEYS.about.skills.items.businessAnalyst,
  TRANSLATION_KEYS.about.skills.items.interactionDesign,
  TRANSLATION_KEYS.about.skills.items.performanceTuning,
];

export function Skills(): ReactNode {
  const { t } = useTranslation();

  return (
    <FadeIn delay={0.18} duration={0.5} className="h-full">
      <SpotlightCard as="section" radius={320} className="h-full p-6 sm:p-7">
        <div className="flex h-full flex-col gap-5">
          <h2 className="type-label text-foreground">
            {t(TRANSLATION_KEYS.about.skills.title)}
          </h2>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SKILL_KEYS.map((skillKey) => (
              <li
                key={skillKey}
                className="border-border-hairline bg-surface-2/60 text-foreground hover:border-border-subtle hover:bg-surface-2 type-label flex min-h-10 items-center rounded-xl border px-3.5 py-2 transition-colors duration-200"
              >
                {t(skillKey)}
              </li>
            ))}
          </ul>
        </div>
      </SpotlightCard>
    </FadeIn>
  );
}
