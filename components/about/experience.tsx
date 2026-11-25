"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

type Entry = {
  id: string;
  companyKey: TranslationKey;
  roleKey: TranslationKey;
  periodKey: TranslationKey;
  logo: string;
  current?: boolean;
};

const ENTRIES: readonly Entry[] = [
  {
    id: "emsc",
    companyKey: TRANSLATION_KEYS.about.experience.items.emsc.company,
    roleKey: TRANSLATION_KEYS.about.experience.items.emsc.role,
    periodKey: TRANSLATION_KEYS.about.experience.items.emsc.period,
    logo: "/images/about/logo_emsc.png",
    current: true,
  },
  {
    id: "dvs",
    companyKey: TRANSLATION_KEYS.about.experience.items.dvs.company,
    roleKey: TRANSLATION_KEYS.about.experience.items.dvs.role,
    periodKey: TRANSLATION_KEYS.about.experience.items.dvs.period,
    logo: "/images/about/logo_dvs.png",
  },
];

export function Experience(): ReactNode {
  const { t } = useTranslation();

  return (
    <FadeIn delay={0.16} duration={0.55} className="h-full">
      <SpotlightCard as="section" radius={320} className="h-full p-6 sm:p-7">
        <div className="flex h-full flex-col gap-6">
          <h2 className="type-label text-foreground">
            {t(TRANSLATION_KEYS.about.experience.title)}
          </h2>

          {/* Crisp vertical hairline timeline */}
          <ol className="relative flex flex-1 flex-col justify-center gap-6 pl-5">
            <span
              aria-hidden="true"
              className="bg-border-hairline absolute top-3 bottom-3 left-[4.5px] w-px"
            />

            {ENTRIES.map((entry) => {
              const company = t(entry.companyKey);
              return (
                <li
                  key={entry.id}
                  className="relative flex items-start gap-3.5"
                >
                  {/* Timeline node dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-4 -left-5 h-2.5 w-2.5 rounded-full border ${
                      entry.current
                        ? "border-foreground bg-foreground"
                        : "border-border-subtle bg-surface-1"
                    }`}
                  />

                  <span
                    className="border-border-hairline inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5"
                    aria-hidden="true"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.logo}
                      alt=""
                      width={28}
                      height={28}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <span className="text-foreground type-body font-medium">
                        {company}
                      </span>
                      <span className="type-meta text-text-muted">
                        {t(entry.periodKey)}
                      </span>
                    </div>
                    <span className="text-text-secondary type-body">
                      {t(entry.roleKey)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </SpotlightCard>
    </FadeIn>
  );
}
