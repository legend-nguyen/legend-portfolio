"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ProjectMockupFrame } from "@/components/ui/project-mockup-frame";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import {
  ArrowRight,
  Clock,
  GraduationCap,
  UserSearch,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type ProjectCategory = "all" | "hris" | "automation" | "analytics";

type Project = {
  id: string;
  categories: readonly Exclude<ProjectCategory, "all">[];
  icon: ComponentType<{ className?: string }>;
  iconLabelKey: TranslationKey;
  categoryLabelKey: TranslationKey;
  titleKey: TranslationKey;
  summaryKey: TranslationKey;
  descriptionKey: TranslationKey;
  roleKey: TranslationKey;
  impactKey: TranslationKey;
  imageAltKey: TranslationKey;
  image: string;
  imageRatio: number;
  mockupUrl: string;
  stack: readonly string[];
  fullStack: readonly string[];
};

const PROJECTS: readonly Project[] = [
  {
    id: "hr",
    categories: ["hris"],
    icon: Users,
    iconLabelKey: TRANSLATION_KEYS.projects.items.hr.iconLabel,
    categoryLabelKey: TRANSLATION_KEYS.projects.items.hr.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.hr.title,
    summaryKey: TRANSLATION_KEYS.projects.items.hr.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.hr.description,
    roleKey: TRANSLATION_KEYS.projects.items.hr.role,
    impactKey: TRANSLATION_KEYS.projects.items.hr.impact,
    imageRatio: 16 / 10,
    image: "/images/projects/hr.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.hr.imageAlt,
    mockupUrl: "emsc.hris/core-hr",
    stack: [".NET Core", "SQL Server", "Org Hierarchy", "RBAC"],
    fullStack: [
      "C#",
      "ASP.NET Core",
      "SQL Server",
      "Entity Framework",
      "Hierarchical CTEs",
      "Multi-Tenant RBAC",
      "TypeScript",
    ],
  },
  {
    id: "recruitment",
    categories: ["automation", "hris"],
    icon: UserSearch,
    iconLabelKey: TRANSLATION_KEYS.projects.items.recruitment.iconLabel,
    categoryLabelKey: TRANSLATION_KEYS.projects.items.recruitment.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.recruitment.title,
    summaryKey: TRANSLATION_KEYS.projects.items.recruitment.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.recruitment.description,
    roleKey: TRANSLATION_KEYS.projects.items.recruitment.role,
    impactKey: TRANSLATION_KEYS.projects.items.recruitment.impact,
    imageRatio: 16 / 10,
    image: "/images/projects/recruitment.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.recruitment.imageAlt,
    mockupUrl: "emsc.hris/recruitment",
    stack: ["ASP.NET", "Workflow Engine", "Email Automation"],
    fullStack: [
      "ASP.NET Core",
      "Background Workers",
      "Job Portal Webhooks",
      "Dynamic Email Templates",
      "SQL Server",
      "REST APIs",
    ],
  },
  {
    id: "timekeeping",
    categories: ["analytics", "hris"],
    icon: Clock,
    iconLabelKey: TRANSLATION_KEYS.projects.items.timekeeping.iconLabel,
    categoryLabelKey: TRANSLATION_KEYS.projects.items.timekeeping.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.timekeeping.title,
    summaryKey: TRANSLATION_KEYS.projects.items.timekeeping.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.timekeeping.description,
    roleKey: TRANSLATION_KEYS.projects.items.timekeeping.role,
    impactKey: TRANSLATION_KEYS.projects.items.timekeeping.impact,
    imageRatio: 16 / 10,
    image: "/images/projects/timekeeping.png",
    imageAltKey: TRANSLATION_KEYS.projects.items.timekeeping.imageAlt,
    mockupUrl: "emsc.hris/timekeeping",
    stack: ["REST APIs", "Payroll Sync", "BI Dashboard"],
    fullStack: [
      ".NET Core",
      "High-Throughput Sync APIs",
      "SQL Server Indexing",
      "Payroll Engine",
      "KPI Aggregation",
      "BI Dashboards",
    ],
  },
  {
    id: "elearning",
    categories: ["automation", "analytics"],
    icon: GraduationCap,
    iconLabelKey: TRANSLATION_KEYS.projects.items.elearning.iconLabel,
    categoryLabelKey: TRANSLATION_KEYS.projects.items.elearning.categoryLabel,
    titleKey: TRANSLATION_KEYS.projects.items.elearning.title,
    summaryKey: TRANSLATION_KEYS.projects.items.elearning.summary,
    descriptionKey: TRANSLATION_KEYS.projects.items.elearning.description,
    roleKey: TRANSLATION_KEYS.projects.items.elearning.role,
    impactKey: TRANSLATION_KEYS.projects.items.elearning.impact,
    imageRatio: 16 / 10,
    image: "/images/projects/elearning.JPG",
    imageAltKey: TRANSLATION_KEYS.projects.items.elearning.imageAlt,
    mockupUrl: "emsc.hris/training-lms",
    stack: [".NET", "LMS Workflows", "Skill Matrix"],
    fullStack: [
      "ASP.NET",
      "Course Catalog Engine",
      "Automated Quiz Scoring",
      "Skill Pathway Tracking",
      "SQL Server",
      "Reporting",
    ],
  },
];

const FILTER_OPTIONS: readonly {
  value: ProjectCategory;
  labelKey: TranslationKey;
}[] = [
  { value: "all", labelKey: TRANSLATION_KEYS.projects.filters.all },
  { value: "hris", labelKey: TRANSLATION_KEYS.projects.filters.hris },
  {
    value: "automation",
    labelKey: TRANSLATION_KEYS.projects.filters.automation,
  },
  { value: "analytics", labelKey: TRANSLATION_KEYS.projects.filters.analytics },
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
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Support deep links like /projects#hr from the home page Bento cards
  useEffect(() => {
    const openFromHash = (): void => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const match = PROJECTS.find((p) => p.id === hash);
      if (match) {
        setSelectedProjectId(match.id);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return PROJECTS;
    return PROJECTS.filter((project) =>
      project.categories.includes(activeCategory)
    );
  }, [activeCategory]);

  const selectedProject = useMemo(
    () => PROJECTS.find((p) => p.id === selectedProjectId) ?? null,
    [selectedProjectId]
  );

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open) {
      setSelectedProjectId(null);
      if (typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    }
  };

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-4 pt-12 pb-8 text-center sm:pt-20 sm:pb-10">
            <h2 className="text-foreground type-title">
              {t(TRANSLATION_KEYS.projects.headline)}
            </h2>
            <p className="text-text-secondary type-lead max-w-[44ch]">
              {t(TRANSLATION_KEYS.projects.subheadline)}
            </p>
          </FadeIn>
        ) : null}

        {/* Minimal Monochrome Filter Tabs — left-aligned to match React Bits docs/showcase */}
        <div className="mb-8 flex justify-start">
          <Tabs
            value={activeCategory}
            onValueChange={(value) =>
              setActiveCategory(value as ProjectCategory)
            }
          >
            <TabsList className="flex-wrap justify-start">
              {FILTER_OPTIONS.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Polished 2-Column Case Study Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                id={project.id}
                layout={!prefersReducedMotion}
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.98 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.28,
                  ease: EASE,
                }}
                className="h-full"
              >
                <ProjectExplorerCard
                  project={project}
                  index={index}
                  onSelect={() => setSelectedProjectId(project.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="focus-ring group border-border-hairline bg-surface-1 text-foreground hover:border-border-subtle hover:bg-surface-2 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-medium tracking-tight transition-all duration-200 active:scale-[0.98]"
            >
              <span>{t(TRANSLATION_KEYS.projects.viewAll)}</span>
              <ArrowRight
                className="text-text-secondary group-hover:text-foreground h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>

      {/* Project Case Study Detail Dialog */}
      <Dialog
        open={selectedProject !== null}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent
          className="max-w-3xl"
          closeLabel={t(TRANSLATION_KEYS.projects.modal.close)}
        >
          {selectedProject ? (
            <ProjectDetailModalBody project={selectedProject} />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectExplorerCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}): ReactNode {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onSelect}
      className="focus-ring group/card block h-full w-full cursor-pointer rounded-2xl text-left"
    >
      <SpotlightCard as="article" radius={320} className="h-full p-5 sm:p-6">
        <div className="flex h-full flex-col gap-4">
          {/* Card Header: Subtle Category Label + Quiet Details Cue */}
          <div className="flex items-center justify-between gap-2">
            <span className="type-meta text-text-muted">
              {t(project.categoryLabelKey)}
            </span>

            <span className="type-meta text-text-muted group-hover/card:text-foreground inline-flex items-center gap-1 font-medium transition-colors duration-200">
              <span>{t(TRANSLATION_KEYS.projects.detailsCue)}</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>

          {/* Matte Browser Mockup Preview */}
          <ProjectMockupFrame
            title={project.mockupUrl}
            aspectRatio={project.imageRatio}
          >
            <Image
              src={project.image}
              alt={t(project.imageAltKey)}
              fill
              quality={95}
              priority={index < 2}
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.02]"
            />
          </ProjectMockupFrame>

          {/* Title, Concise 2-Line Impact Summary & Monochrome Stack Tags */}
          <div className="flex flex-1 flex-col justify-between gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-foreground type-heading">
                {t(project.titleKey)}
              </h3>
              <p className="text-text-secondary type-body line-clamp-2">
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
    </button>
  );
}

function ProjectDetailModalBody({ project }: { project: Project }): ReactNode {
  const { t } = useTranslation();

  return (
    <>
      <DialogHeader>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="sm">
            {t(project.categoryLabelKey)}
          </Badge>
        </div>
        <DialogTitle>{t(project.titleKey)}</DialogTitle>
        <DialogDescription>{t(project.descriptionKey)}</DialogDescription>
      </DialogHeader>

      <DialogBody className="space-y-6">
        {/* Enlarged Dashboard Preview */}
        <ProjectMockupFrame
          title={project.mockupUrl}
          aspectRatio={16 / 10}
          vignette={false}
        >
          <Image
            src={project.image}
            alt={t(project.imageAltKey)}
            fill
            quality={95}
            sizes="(min-width: 768px) 720px, 95vw"
            className="object-cover object-top"
          />
        </ProjectMockupFrame>

        {/* Architectural Role & Key Business Impact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-border-hairline bg-surface-2/60 flex flex-col gap-1.5 rounded-xl border p-4">
            <span className="type-label text-foreground">
              {t(TRANSLATION_KEYS.projects.modal.roleHeading)}
            </span>
            <p className="text-text-secondary type-body">
              {t(project.roleKey)}
            </p>
          </div>

          <div className="border-border-hairline bg-surface-2/60 flex flex-col gap-1.5 rounded-xl border p-4">
            <span className="type-label text-foreground">
              {t(TRANSLATION_KEYS.projects.modal.impactHeading)}
            </span>
            <p className="text-text-secondary type-body">
              {t(project.impactKey)}
            </p>
          </div>
        </div>

        {/* Full Tech Stack */}
        <div className="flex flex-col gap-2.5">
          <span className="type-label text-foreground">
            {t(TRANSLATION_KEYS.projects.modal.stackHeading)}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.fullStack.map((tech) => (
              <Badge key={tech} variant="secondary" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <DialogClose className="focus-ring type-label border-border-hairline bg-surface-2 text-foreground hover:border-border-subtle hover:bg-surface-3 inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-4 transition-colors">
          {t(TRANSLATION_KEYS.projects.modal.close)}
        </DialogClose>
      </DialogFooter>
    </>
  );
}
