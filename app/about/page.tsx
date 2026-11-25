import { AboutHeader } from "@/components/about/about-header";
import { AboutIntro } from "@/components/about/about-intro";
import { Experience } from "@/components/about/experience";
import { QuickInfo } from "@/components/about/quick-info";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { createMetadata } from "@/lib/metadata";
import { DEFAULT_LANGUAGE, TRANSLATION_KEYS, translate } from "@/shared/i18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: translate(DEFAULT_LANGUAGE, TRANSLATION_KEYS.about.metaTitle),
  description: translate(
    DEFAULT_LANGUAGE,
    TRANSLATION_KEYS.about.metaDescription
  ),
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <AboutHeader />

      {/* Unified 1100px 12-Column Monochrome Bento Grid */}
      <section className="mx-auto w-full max-w-275 px-6 pb-16 sm:px-10 sm:pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Row 1: Bio (8 cols) + Quick Info & Education (4 cols) */}
          <div className="lg:col-span-8">
            <AboutIntro />
          </div>
          <div className="lg:col-span-4">
            <QuickInfo />
          </div>

          {/* Row 2: Experience (6 cols) + Core Capabilities (6 cols) */}
          <div className="lg:col-span-6">
            <Experience />
          </div>
          <div className="lg:col-span-6">
            <Skills />
          </div>

          {/* Row 3: Interactive Physics Tech Stack (12 cols) */}
          <div className="lg:col-span-12">
            <Stack />
          </div>
        </div>
      </section>

      <ContactCard />
      <div className="h-10 sm:h-14" />
    </main>
  );
}
