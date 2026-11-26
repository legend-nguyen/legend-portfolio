import type { TranslationDictionary } from "../translation-keys";

export const langEn: TranslationDictionary = {
  site: {
    name: "Portfolio",
    description:
      "A modern, accessible portfolio template built with Next.js, Tailwind CSS, and TypeScript.",
  },
  common: {
    skipToContent: "Skip to main content",
  },
  nav: {
    ariaLabel: "Primary",
    home: "Home",
    projects: "Projects",
    about: "About",
  },
  theme: {
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    toggle: "Toggle theme",
  },
  motion: {
    disableAnimations: "Disable animations (smoother on low-spec devices)",
    enableAnimations: "Enable animations",
    toggle: "Toggle animations",
  },
  language: {
    ariaLabel: "Select language",
    selectOption: "Switch language to {language}",
  },
  home: {
    metaTitle: "Home",
    highlights: {
      expLabel: "Experience",
      expValue: "5+ Years Enterprise HRIS",
      expDetail: "Core HR, recruitment, timekeeping & payroll at scale.",
      aiLabel: "Workflow",
      aiValue: "AI-Assisted Workflows",
      aiDetail: "Agents, LLMs & automated engineering pipelines.",
      stackLabel: "Core Stack",
      stackValue: "Full-Stack .NET & Next.js",
      stackDetail: "Clean architecture, TypeScript & SQL Server tuning.",
    },
    featured: {
      headline: "Enterprise HRIS Modules",
      subheadline:
        "Selected production modules designed, engineered, and optimized at scale in EMSC.",
    },
  },
  hero: {
    greetingPrefix: "Hey",
    greetingSuffix: ", I’m Nguyen Huyen Thoai",
    headlineLine1: "Full-Stack .NET",
    headlineLine2: "& AI Developer",
    subtitle:
      "Senior Full-Stack .NET Engineer with 5+ years of experience building lean, high-performance systems enhanced by AI-driven development workflows.",
    portraitAlt: "Legend portrait",
    viewWork: "View My Work",
  },
  contact: {
    buttonLabel: "Contact",
    emailCopied: "Email copied",
    copyEmail: "Copy {email}",
    copyEmailLabel: "Copy email",
    copied: "Copied",
    showEmail: "Show email",
  },
  projects: {
    metaTitle: "Projects",
    metaDescription: "Selected work and case studies.",
    pageTitle: "Enterprise Projects & HRIS System",
    pageSubtitle:
      "Core human resource management modules at scale in EMSC, where I directly designed, developed, and optimized specialized business modules.",
    headline: "Enterprise Projects & HRIS System",
    subheadline:
      "Core human resource management modules at scale in EMSC, where I directly designed, developed, and optimized specialized business modules.",
    viewAll: "View all projects",
    detailsCue: "Details",
    filters: {
      all: "All",
      hris: "HRIS Core",
      automation: "Automation & AI",
      analytics: "Analytics",
    },
    modal: {
      roleHeading: "Architectural Role",
      impactHeading: "Key Business Impact",
      stackHeading: "Technology Stack",
      close: "Close",
    },
    items: {
      hr: {
        iconLabel: "HR",
        categoryLabel: "HRIS Core",
        title: "Core HR & Organization Platform",
        summary:
          "Unified employee lifecycle management, multi-level org charts, and granular branch-level RBAC across large enterprise workforces.",
        description:
          "Designs and develops the core modules that manage the employee lifecycle, including onboarding, workforce changes and employment contracts. Optimizes large-scale database structures, builds multi-level hierarchical organizational charts, and implements a flexible permission system by department and branch.",
        role: "Core Module Architect & Senior Full-Stack Engineer — led database schema optimization, hierarchical org-chart queries, and multi-tenant branch/department authorization.",
        impact:
          "Standardized HR records across multi-branch enterprises, accelerated complex org-tree rendering, and enforced strict audit-ready role permissions.",
        meta: "",
        imageAlt: "HR overview chart",
      },
      recruitment: {
        iconLabel: "Recruitment",
        categoryLabel: "Automation & AI",
        title: "Automated Recruitment Pipeline",
        summary:
          "Automated candidate ingestion from job portals, smart interview scheduling, email templates, and real-time channel analytics.",
        description:
          "Builds and optimizes an end-to-end recruitment management system for large enterprises. Integrates automated candidate data flows from job portals, intelligent interview scheduling, automated email notification templates, and real-time analytics on sourcing channel performance.",
        role: "Full-Stack .NET Engineer — architected portal sync pipelines, workflow automation triggers, and dynamic notification templating.",
        impact:
          "Eliminated manual CV data entry from external job boards, shortened hiring-to-interview cycles, and gave HR teams real-time visibility into sourcing ROI.",
        meta: "",
        imageAlt: "Candidate pool interface",
      },
      timekeeping: {
        iconLabel: "Timekeeping",
        categoryLabel: "Analytics",
        title: "Timekeeping, Payroll & BI",
        summary:
          "High-throughput synchronization APIs connecting attendance devices, payroll calculation, KPI appraisals, and executive BI dashboards.",
        description:
          "Contributes to the development and cross-integration of key supporting modules, including timekeeping, payroll, KPI-based performance appraisal and intelligent reporting (Dashboard/BI). Builds high-performance data synchronization APIs to ensure seamless interoperability across modules within the overall HRM system.",
        role: "Backend & Integration Engineer — designed cross-module REST sync APIs, optimized heavy payroll/attendance aggregations, and supported BI reporting views.",
        impact:
          "Delivered reliable cross-module data consistency between attendance, KPIs, and payroll while reducing monthly reporting latency.",
        meta: "",
        imageAlt: "Timekeeping chart",
      },
      elearning: {
        iconLabel: "Training",
        categoryLabel: "Automation & AI",
        title: "Enterprise Learning Platform",
        summary:
          "Digitized course catalogs, structured skill pathways, and automated online testing to track workforce capability growth.",
        description:
          "Develops modules for managing both in-house and external training programs, digitizing course catalogs, and managing training plans from foundational to advanced levels. Integrates features for tracking skill development pathways and evaluating online test and quiz results, thereby improving the quality of the workforce.",
        role: "Full-Stack Developer — built course catalog workflows, automated quiz evaluation modules, and employee skill-matrix tracking.",
        impact:
          "Transitioned enterprise training from manual spreadsheets to structured digital learning pathways with measurable assessment outcomes.",
        meta: "",
        imageAlt: "Online lessons",
      },
    },
  },
  contactCard: {
    title: "Let’s connect",
    description:
      "I’m always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Just reach out!",
    seeProjects: "See projects",
    copyright: "© 2026 Nguyen Huyen Thoai",
    credit: "Built with Next.js & TypeScript",
    social: {
      email: "Email",
      linkedin: "LinkedIn",
      zalo: "Zalo",
      facebook: "Facebook",
      tiktok: "Tiktok",
    },
  },
  about: {
    metaTitle: "About",
    metaDescription: "About me, background, and how to get in touch.",
    pageTitle: "About & Engineering Background",
    pageSubtitle:
      "5+ years architecting enterprise HRIS platforms, scalable .NET backends, and AI-assisted engineering workflows.",
    listenIntro: "Listen to introduction",
    stopListening: "Stop listening",
    listenShort: "Listen",
    pauseShort: "Pause",
    audioUnavailable: "Audio introduction unavailable",
    quickInfo: {
      title: "At a Glance",
      locationLabel: "Location",
      locationValue: "Ho Chi Minh City, VN",
      experienceLabel: "Experience",
      experienceValue: "5+ Years",
      roleLabel: "Role",
      roleValue: "Senior Software Engineer",
      focusLabel: "Focus",
      focusValue: "HRIS & AI Workflows",
    },
    intro: {
      greetingPrefix: "Hello! I’m ",
      name: "Nguyen Huyen Thoai",
      p1Part1: "A ",
      p1Highlight1: "full-stack developer with over 5 years of experience",
      p1Part2:
        " specializing in enterprise systems and operational optimization. With a solid foundation in ",
      p1Highlight2: "web application architecture",
      p1Part3: " and ",
      p1Highlight3: "advanced modular development",
      p1Part4:
        ", I combine technical logic with the ability to bring complex business solutions to life.",
      p2Part1: "Beyond my core technical expertise, I have a deep passion for ",
      p2Highlight1:
        "artificial intelligence (AI) and modern development workflows",
      p2Part2:
        ". I actively integrate AI agents, LLMs, and intelligent tools into my daily coding routine to accelerate deployment, automate tasks, and solve complex challenges with maximum efficiency.",
      p3Part1:
        "Currently contributing to the development of core modules within HR software ecosystems such as ",
      p3Highlight1: "enterprise HRIS systems",
      p3Part2:
        ", I continuously explore the intersection of software engineering and AI to ",
      p3Highlight2:
        "create intelligent automation solutions and build scalable, sustainable systems",
      p3Part3: ".",
      listenIntro: "Listen to introduction",
      stopListening: "Stop listening",
      audioUnavailable: "Audio introduction unavailable",
    },
    experience: {
      title: "Experience",
      showLess: "Show less",
      showMore: "Show {count} more",
      items: {
        emsc: {
          company: "EMS Corporation",
          role: "Senior Software Engineer",
          period: "Nov 2020 – Present",
        },
        dvs: {
          company: "DV Software",
          role: "Intern Software Engineer",
          period: "Feb 2020 – June 2020",
        },
      },
    },
    education: {
      title: "Education",
      items: {
        ct: {
          school: "Cao Thang Technical College",
          degree: "Bachelor of IT",
          period: "2017 – 2020",
        },
      },
    },
    skills: {
      title: "What I do",
      items: {
        aiaD: "AI-Assisted Development",
        uiUx: "UI/UX Design",
        designSystems: "Design Systems",
        frontendDev: "Frontend Development",
        backendDev: "Backend Development",
        businessAnalyst: "Business Analyst",
        interactionDesign: "Interaction Design",
        performanceTuning: "Performance Tuning",
      },
    },
    stack: {
      title: "Stack",
      resetAriaLabel: "Reset stack",
    },
  },
  chat: {
    openLabel: "Open chat",
    closeLabel: "Close chat",
    buttonLabel: "Ask AI",
    title: "Ask about Thoai",
    sectionAriaLabel: "Chat with AI assistant",
    clear: "Clear",
    welcome:
      "Hi! You can ask about Thoai’s profile, projects, skills, or the content of this website.",
    inputPlaceholder: "Ask a question…",
    inputAriaLabel: "Your question",
    send: "Send",
    thinking: "Thinking",
    disclaimer:
      "AI assistant may make mistakes. Please verify important details.",
    genericError: "Something went wrong, please try again.",
    emptyResponseError: "No response received, please try again.",
    suggestions: {
      s1: "Who is Thoai and what does he do?",
      s2: "What are the featured projects?",
      s3: "What technologies does he use?",
      s4: "How can I contact him?",
    },
  },
};
