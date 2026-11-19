"use client";

import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import {
  ArrowRight,
  Clock,
  GraduationCap,
  UserSearch,
  Users,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";

/**
 * Project imagery below is mockup-only. All visuals are sourced from
 * Dribbble and credit belongs to the original creators on dribbble.com.
 * Replace these with your own work before shipping.
 */

type Project = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconLabelKey: TranslationKey;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  metaKey: TranslationKey;
  imageRatio: number;
  image: string;
  imageAltKey: TranslationKey;
};

const PROJECTS: Project[] = [
  {
    id: "hr",
    icon: Users,
    iconLabelKey: TRANSLATION_KEYS.projects.items.hr.iconLabel,
    titleKey: TRANSLATION_KEYS.projects.items.hr.title,
    descriptionKey: TRANSLATION_KEYS.projects.items.hr.description,
    metaKey: TRANSLATION_KEYS.projects.items.hr.meta,
    imageRatio: 2489 / 1271,
    image: "/images/projects/hr.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.hr.imageAlt,
  },
  {
    id: "recruitment",
    icon: UserSearch,
    iconLabelKey: TRANSLATION_KEYS.projects.items.recruitment.iconLabel,
    titleKey: TRANSLATION_KEYS.projects.items.recruitment.title,
    descriptionKey: TRANSLATION_KEYS.projects.items.recruitment.description,
    metaKey: TRANSLATION_KEYS.projects.items.recruitment.meta,
    imageRatio: 2492 / 1729,
    image: "/images/projects/recruitment.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.recruitment.imageAlt,
  },
  {
    id: "timekeeping",
    icon: Clock,
    iconLabelKey: TRANSLATION_KEYS.projects.items.timekeeping.iconLabel,
    titleKey: TRANSLATION_KEYS.projects.items.timekeeping.title,
    descriptionKey: TRANSLATION_KEYS.projects.items.timekeeping.description,
    metaKey: TRANSLATION_KEYS.projects.items.timekeeping.meta,
    imageRatio: 2485 / 1252,
    image: "/images/projects/timekeeping.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.timekeeping.imageAlt,
  },
  {
    id: "elearning",
    icon: GraduationCap,
    iconLabelKey: TRANSLATION_KEYS.projects.items.elearning.iconLabel,
    titleKey: TRANSLATION_KEYS.projects.items.elearning.title,
    descriptionKey: TRANSLATION_KEYS.projects.items.elearning.description,
    metaKey: TRANSLATION_KEYS.projects.items.elearning.meta,
    imageRatio: 2492 / 1729,
    image: "/images/projects/elearning.JPG",
    imageAltKey: TRANSLATION_KEYS.projects.items.elearning.imageAlt,
  },
];

export type ProjectsProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const { t } = useTranslation();
  const items = viewMoreVisible ? PROJECTS.slice(0, 4) : PROJECTS;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3rem] lg:text-[3.5rem]">
              {t(TRANSLATION_KEYS.projects.headline)}
            </h2>
            <p className="max-w-[33ch] text-[18px] leading-[1.45] tracking-tight text-foreground/65 sm:text-[20px]">
              {t(TRANSLATION_KEYS.projects.subheadline)}
            </p>
          </FadeIn>
        ) : null}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="border border-foreground/8 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              {t(TRANSLATION_KEYS.projects.viewAll)}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}): ReactNode {
  const { t } = useTranslation();
  const Icon = project.icon;
  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article
        data-glow-block
        className="project-card flex cursor-pointer flex-col gap-4 rounded-3xl border border-foreground/8 bg-background p-3 sm:p-3.5"
      >
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="border-foreground/10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
            <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            {t(project.iconLabelKey)}
          </span>
        </header>

        <div
          className="project-card__image ring-foreground/5 relative w-full overflow-hidden rounded-2xl bg-foreground/5 ring-1"
          style={{ aspectRatio: project.imageRatio }}
        >
          <div className="project-card__image-inner">
            <Image
              src={project.image}
              alt={t(project.imageAltKey)}
              fill
              quality={95}
              sizes="(min-width: 1024px) 600px, (min-width: 768px) 48vw, 100vw"
              className="object-cover object-center"
              priority={index < 2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-tight text-foreground sm:text-[22px]">
            {t(project.titleKey)}
          </h3>
          <p className="text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
            {t(project.descriptionKey)}
          </p>
        </div>

        <p className="px-1 pb-2 text-[12px] tracking-tight text-foreground/50">
          {t(project.metaKey)}
        </p>
      </article>
    </FadeIn>
  );
}
