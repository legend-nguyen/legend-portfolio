"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

type InfoRow = {
  id: string;
  labelKey: TranslationKey;
  valueKey: TranslationKey;
  subValueKey?: TranslationKey;
};

const INFO_ROWS: readonly InfoRow[] = [
  {
    id: "location",
    labelKey: TRANSLATION_KEYS.about.quickInfo.locationLabel,
    valueKey: TRANSLATION_KEYS.about.quickInfo.locationValue,
  },
  {
    id: "experience",
    labelKey: TRANSLATION_KEYS.about.quickInfo.experienceLabel,
    valueKey: TRANSLATION_KEYS.about.quickInfo.experienceValue,
  },
  {
    id: "role",
    labelKey: TRANSLATION_KEYS.about.quickInfo.roleLabel,
    valueKey: TRANSLATION_KEYS.about.quickInfo.roleValue,
  },
  {
    id: "focus",
    labelKey: TRANSLATION_KEYS.about.quickInfo.focusLabel,
    valueKey: TRANSLATION_KEYS.about.quickInfo.focusValue,
  },
  // {
  //   id: "education",
  //   labelKey: TRANSLATION_KEYS.about.education.title,
  //   valueKey: TRANSLATION_KEYS.about.education.items.ct.school,
  //   subValueKey: TRANSLATION_KEYS.about.education.items.ct.degree,
  // },
];

export function QuickInfo(): ReactNode {
  const { t } = useTranslation();

  return (
    <FadeIn delay={0.14} duration={0.5} className="h-full">
      <SpotlightCard as="aside" radius={300} className="h-full p-6 sm:p-7">
        <div className="flex h-full flex-col gap-5">
          <h2 className="type-label text-foreground">
            {t(TRANSLATION_KEYS.about.quickInfo.title)}
          </h2>

          <dl className="divide-border-hairline flex flex-1 flex-col justify-between divide-y">
            {INFO_ROWS.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"
              >
                <dt className="type-meta text-text-muted">
                  {t(row.labelKey)}
                </dt>
                <dd className="text-foreground type-body font-medium">
                  {t(row.valueKey)}
                </dd>
                {row.subValueKey ? (
                  <dd className="type-meta text-text-secondary">
                    {t(row.subValueKey)} ·{" "}
                    {t(TRANSLATION_KEYS.about.education.items.ct.period)}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </SpotlightCard>
    </FadeIn>
  );
}
