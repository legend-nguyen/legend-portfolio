import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { createMetadata } from "@/lib/metadata";
import { DEFAULT_LANGUAGE, TRANSLATION_KEYS, translate } from "@/shared/i18n";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: translate(DEFAULT_LANGUAGE, TRANSLATION_KEYS.projects.metaTitle),
  description: translate(
    DEFAULT_LANGUAGE,
    TRANSLATION_KEYS.projects.metaDescription
  ),
  path: "/projects",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <ProjectsHeader />
      <Projects />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
