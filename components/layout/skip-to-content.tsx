"use client";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import type { ReactNode } from "react";

export function SkipToContent(): ReactNode {
  const { t } = useTranslation();

  return (
    <a href="#main-content" className="skip-to-content">
      {t(TRANSLATION_KEYS.common.skipToContent)}
    </a>
  );
}
