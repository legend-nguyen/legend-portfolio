import { ContactCard } from "@/components/contact/contact-card";
import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/home/featured-work";
import { HighlightsStrip } from "@/components/home/highlights-strip";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { DEFAULT_LANGUAGE, TRANSLATION_KEYS, translate } from "@/shared/i18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: translate(DEFAULT_LANGUAGE, TRANSLATION_KEYS.home.metaTitle),
  description: `${siteConfig.name} — ${siteConfig.description}`,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-14 sm:gap-20">
      <Hero />
      <HighlightsStrip />
      <FeaturedWork />
      <ContactCard />
      <div className="h-10 sm:h-14" />
    </main>
  );
}
