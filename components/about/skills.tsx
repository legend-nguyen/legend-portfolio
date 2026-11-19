"use client";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

const SKILL_KEYS: readonly TranslationKey[] = [
  TRANSLATION_KEYS.about.skills.items.aiaD,
  TRANSLATION_KEYS.about.skills.items.uiUx,
  TRANSLATION_KEYS.about.skills.items.designSystems,
  TRANSLATION_KEYS.about.skills.items.frontendDev,
  TRANSLATION_KEYS.about.skills.items.backendDev,
  TRANSLATION_KEYS.about.skills.items.businessAnalyst,
  TRANSLATION_KEYS.about.skills.items.interactionDesign,
  TRANSLATION_KEYS.about.skills.items.performanceTuning,
];

export function Skills(): ReactNode {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        {t(TRANSLATION_KEYS.about.skills.title)}
      </h3>
      <div
        data-glow-block
        className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5"
      >
        <div className="flex flex-wrap gap-3">
          {SKILL_KEYS.map((skillKey) => (
            <span
              key={skillKey}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {t(skillKey)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
