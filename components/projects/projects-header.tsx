"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import type { ReactNode } from "react";

export function ProjectsHeader(): ReactNode {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-275 px-6 pt-44 pb-16 sm:px-10 sm:pt-100 sm:pb-20">
      <FadeIn className="flex flex-col items-center gap-5 text-center">
        <h1 className="font-serif text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3.25rem] lg:text-[3.75rem]">
          {t(TRANSLATION_KEYS.projects.pageTitle)}
        </h1>
        <p className="max-w-[33ch] text-[20px] leading-[1.4] tracking-tight text-foreground/65 sm:text-[22px]">
          {t(TRANSLATION_KEYS.projects.pageSubtitle)}
        </p>
      </FadeIn>
    </section>
  );
}

