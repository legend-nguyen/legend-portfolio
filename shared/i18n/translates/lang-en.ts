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
  language: {
    ariaLabel: "Select language",
    selectOption: "Switch language to {language}",
  },
  home: {
    metaTitle: "Home",
  },
  hero: {
    greetingPrefix: "Hey",
    greetingSuffix: ", I’m Nguyen Huyen Thoai",
    headlineLine1: ".NET Developer &",
    headlineLine2: "AI enthusiast",
    subtitle:
      "Full-Stack .NET Engineer with 5+ years of experience building lean, high-performance systems enhanced by AI-driven development workflows.",
    portraitAlt: "Legend portrait",
    viewWork: "View My Work",
  },
  contact: {
    buttonLabel: "Contact",
    emailCopied: "Email copied",
    copyEmail: "Copy {email}",
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
    items: {
      hr: {
        iconLabel: "HR",
        title:
          "A centralized, transparent and highly secure platform for human resources data management.",
        description:
          "Designs and develops the core modules that manage the employee lifecycle, including onboarding, workforce changes and employment contracts. Optimizes large-scale database structures, builds multi-level hierarchical organizational charts, and implements a flexible permission system by department and branch.",
        meta: "",
        imageAlt: "HR overview chart",
      },
      recruitment: {
        iconLabel: "Recruitment",
        title:
          "End-to-end automation of enterprise recruitment workflows and candidate sourcing.",
        description:
          "Builds and optimizes an end-to-end recruitment management system for large enterprises. Integrates automated candidate data flows from job portals, intelligent interview scheduling, automated email notification templates, and real-time analytics on sourcing channel performance.",
        meta: "",
        imageAlt: "Candidate pool interface",
      },
      timekeeping: {
        iconLabel: "Timekeeping",
        title:
          "An expanded ecosystem of timekeeping, payroll and management analytics tools.",
        description:
          "Contributes to the development and cross-integration of key supporting modules, including timekeeping, payroll, KPI-based performance appraisal and intelligent reporting (Dashboard/BI). Builds high-performance data synchronization APIs to ensure seamless interoperability across modules within the overall HRM system.",
        meta: "",
        imageAlt: "Timekeeping chart",
      },
      elearning: {
        iconLabel: "Training",
        title:
          "A solution for digitizing internal training and developing employee learning pathways.",
        description:
          "Develops modules for managing both in-house and external training programs, digitizing course catalogs, and managing training plans from foundational to advanced levels. Integrates features for tracking skill development pathways and evaluating online test and quiz results, thereby improving the quality of the workforce.",
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
    copyright: "2026 © Built with Next.js",
    credit: "Vibe coding with AI",
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
    listenIntro: "Listen to introduction",
    stopListening: "Stop listening",
    audioUnavailable: "Audio introduction unavailable",
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
      p2Part1:
        "Beyond my core technical expertise, I have a deep passion for ",
      p2Highlight1: "artificial intelligence (AI) and modern development workflows",
      p2Part2:
        ". I actively integrate AI agents, LLMs, and intelligent tools into my daily coding routine to accelerate deployment, automate tasks, and solve complex challenges with maximum efficiency.",
      p3Part1:
        "Currently contributing to the development of core modules within HR software ecosystems such as ",
      p3Highlight1: "enterprise HRIS systems",
      p3Part2: ", I continuously explore the intersection of software engineering and AI to ",
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
          company: "EMS Coporation",
          role: "Senior Software Engineer",
          period: "Nov 2020 – Present",
        },
        dvs: {
          company: "DV Software",
          role: "Intern Software Engineer",
          period: "Feb 2020 – June 2020",
        }
      },
    },
    education: {
      title: "Education",
      items: {
        ct: {
          school: "Cao Thang Technical College",
          degree: "Bachelor of IT",
          period: "2017 – 2020",
        }
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
    disclaimer: "AI assistant may make mistakes. Please verify important details.",
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

