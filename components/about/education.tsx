"use client";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import type { ReactNode } from "react";

type Entry = {
  id: string;
  schoolKey: TranslationKey;
  degreeKey: TranslationKey;
  periodKey: TranslationKey;
  slug?: string;
};

const ENTRIES: Entry[] = [
  {
    id: "ct",
    schoolKey: TRANSLATION_KEYS.about.education.items.ct.school,
    degreeKey: TRANSLATION_KEYS.about.education.items.ct.degree,
    periodKey: TRANSLATION_KEYS.about.education.items.ct.period,
  }
];

const ROW_HEIGHT = 64;

export function Education(): ReactNode {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        {t(TRANSLATION_KEYS.about.education.title)}
      </h3>
      <div
        data-glow-block
        className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative rounded-4xl border p-2 sm:p-4"
      >
        <ul className="flex flex-col gap-2">
          {ENTRIES.map((entry) => {
            const school = t(entry.schoolKey);
            return (
              <li
                key={entry.id}
                className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-2"
                style={{ minHeight: ROW_HEIGHT }}
              >
                <SchoolLogo entry={entry} schoolName={school} />
                <div className="flex min-w-0 flex-col">
                  <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                    {school}
                  </span>
                  <span className="text-foreground/65 mt-0.5 text-[14px] tracking-tight sm:text-[15px]">
                    {t(entry.degreeKey)}
                    <span className="text-foreground/30 mx-2">•</span>
                    <span className="text-foreground/55">
                      {t(entry.periodKey)}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SchoolLogo({
  entry,
  schoolName,
}: {
  entry: Entry;
  schoolName: string;
}): ReactNode {
  const initials = schoolName.charAt(0);
  return (
    <span
      className="border-foreground/15 inline-flex h-12 w-12 shrink-0 items-center justify-center border"
      aria-hidden="true"
      style={{ borderRadius: 14 }}
    >
      {entry.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${entry.slug}`}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
          draggable={false}
        />
      ) : (
        <span className="text-foreground/60 text-[18px] font-semibold tracking-tight">
          {initials}
        </span>
      )}
    </span>
  );
}
