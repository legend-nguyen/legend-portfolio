"use client";

import { BlurReveal, FadeInText } from "@/components/motion/text-reveal";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ProjectMockupFrame } from "@/components/ui/project-mockup-frame";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type FeaturedProject = {
  id: string;
  categoryLabelKey: TranslationKey;
  titleKey: TranslationKey;
  summaryKey: TranslationKey;
  descriptionKey: TranslationKey;
  imageAltKey: TranslationKey;
  image: string;
  imageRatio: number;
  mockupUrl: string;
  stack: readonly string[];
  flagship?: boolean;
};

const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    id: "hr",
    categoryLabelKey: TRANSLATION_KEYS.projects.items.hr.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.hr.title,
    summaryKey: TRANSLATION_KEYS.projects.items.hr.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.hr.description,
    imageAltKey: TRANSLATION_KEYS.projects.items.hr.imageAlt,
    image: "/images/projects/hr.png",
    imageRatio: 2489 / 1271,
    mockupUrl: "emsc.hris/core-hr",
    stack: [".NET Core", "SQL Server", "Org Hierarchy", "RBAC"],
    flagship: true,
  },
  {
    id: "recruitment",
    categoryLabelKey: TRANSLATION_KEYS.projects.items.recruitment.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.recruitment.title,
    summaryKey: TRANSLATION_KEYS.projects.items.recruitment.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.recruitment.description,
    imageAltKey: TRANSLATION_KEYS.projects.items.recruitment.imageAlt,
    image: "/images/projects/recruitment.png",
    imageRatio: 16 / 10,
    mockupUrl: "emsc.hris/recruitment",
    stack: ["ASP.NET", "Workflow Engine", "Analytics"],
  },
  {
    id: "timekeeping",
    categoryLabelKey: TRANSLATION_KEYS.projects.items.timekeeping.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.timekeeping.title,
    summaryKey: TRANSLATION_KEYS.projects.items.timekeeping.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.timekeeping.description,
    imageAltKey: TRANSLATION_KEYS.projects.items.timekeeping.imageAlt,
    image: "/images/projects/timekeeping.png",
    imageRatio: 16 / 10,
    mockupUrl: "emsc.hris/timekeeping",
    stack: ["REST APIs", "Payroll Sync", "BI Dashboard"],
  },
];

export function FeaturedWork(): ReactNode {
  const { t } = useTranslation();
  const flagship = FEATURED_PROJECTS[0];
  const secondary = FEATURED_PROJECTS.slice(1);

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <div className="flex flex-col justify-between gap-4 pb-8 sm:flex-row sm:items-end sm:pb-10">
          <div className="flex flex-col gap-2">
            <BlurReveal
              as="h2"
              by="block"
              trigger="mount"
              delay={0.12}
              className="text-foreground type-title"
            >
              {t(TRANSLATION_KEYS.home.featured.headline)}
            </BlurReveal>
            <FadeInText
              as="p"
              trigger="mount"
              delay={0.18}
              className="text-text-secondary type-lead max-w-[48ch]"
            >
              {t(TRANSLATION_KEYS.home.featured.subheadline)}
            </FadeInText>
          </div>

          <Link
            href="/projects"
            className="focus-ring type-label group text-text-secondary hover:text-foreground hidden shrink-0 items-center gap-1.5 transition-colors sm:inline-flex"
          >
            <span>{t(TRANSLATION_KEYS.projects.viewAll)}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {flagship ? <FlagshipBentoCard project={flagship} /> : null}

          {secondary.map((project, index) => (
            <SecondaryBentoCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-start sm:hidden">
          <Link
            href="/projects"
            className="focus-ring type-label group border-border-hairline bg-surface-1 text-foreground hover:border-border-subtle hover:bg-surface-2 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4.5 transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98]"
          >
            <span>{t(TRANSLATION_KEYS.projects.viewAll)}</span>
            <ArrowRight
              className="text-text-secondary group-hover:text-foreground h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlagshipBentoCard({
  project,
}: {
  project: FeaturedProject;
}): ReactNode {
  const { t } = useTranslation();

  return (
    <FadeIn duration={0.5} className="md:col-span-2">
      <Link
        href={`/projects#${project.id}`}
        className="focus-ring group/card block rounded-2xl"
      >
        <SpotlightCard as="article" radius={360} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[0.95fr_1.25fr] lg:gap-8">
            <div className="flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="type-meta text-text-muted">
                    {t(project.categoryLabelKey)}
                  </span>
                  <ArrowUpRight
                    className="text-text-muted group-hover/card:text-foreground h-4 w-4 shrink-0 transition-[color,transform] duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-foreground type-subtitle">
                  {t(project.titleKey)}
                </h3>
                <p className="text-text-secondary type-body">
                  {t(project.descriptionKey)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="outline" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <ProjectMockupFrame
              title={project.mockupUrl}
              aspectRatio={project.imageRatio}
            >
              <Image
                src={project.image}
                alt={t(project.imageAltKey)}
                fill
                quality={95}
                priority
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.02]"
              />
            </ProjectMockupFrame>
          </div>
        </SpotlightCard>
      </Link>
    </FadeIn>
  );
}

function SecondaryBentoCard({
  project,
  index,
}: {
  project: FeaturedProject;
  index: number;
}): ReactNode {
  const { t } = useTranslation();

  return (
    <FadeIn delay={0.06 + index * 0.05} duration={0.5} className="h-full">
      <Link
        href={`/projects#${project.id}`}
        className="focus-ring group/card block h-full rounded-2xl"
      >
        <SpotlightCard as="article" radius={300} className="h-full p-5 sm:p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="type-meta text-text-muted">
                {t(project.categoryLabelKey)}
              </span>
              <ArrowUpRight
                className="text-text-muted group-hover/card:text-foreground h-4 w-4 transition-[color,transform] duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                aria-hidden="true"
              />
            </div>

            <ProjectMockupFrame
              title={project.mockupUrl}
              aspectRatio={project.imageRatio}
            >
              <Image
                src={project.image}
                alt={t(project.imageAltKey)}
                fill
                quality={95}
                sizes="(min-width: 768px) 48vw, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.02]"
              />
            </ProjectMockupFrame>

            <div className="flex flex-1 flex-col justify-between gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-foreground type-heading">
                  {t(project.titleKey)}
                </h3>
                <p className="text-text-secondary type-body line-clamp-3">
                  {t(project.summaryKey)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="outline" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </FadeIn>
  );
}
