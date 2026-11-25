<div align="center">

# Legend Portfolio

**Personal portfolio of [Nguyễn Huyền Thoại](https://github.com/legend-nguyen) — Senior Full-Stack .NET & AI Developer.**

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, custom WebGL shaders, interactive physics, bilingual i18n (EN/VI), an offline-synced TTS audio bio, and a streaming AI portfolio assistant.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL-OGL-990000?style=flat-square&logo=webgl&logoColor=white)](https://github.com/oframe/ogl)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](#license)

[Features](#features) · [Tech Stack](#tech-stack) · [Architecture](#project-structure) · [Getting Started](#getting-started) · [AI & TTS Pipelines](#ai-assistant--offline-tts-pipeline) · [Contact](#contact)

</div>

---

## Overview

`legend-portfolio` is a minimalist, high-craft personal website designed around a monochrome black-and-white visual system. Beyond showcasing enterprise HRIS architecture and AI-assisted engineering work, it integrates subtle interactive craft—a theme-reactive WebGL flow shader, magnetic portrait morphing, Matter.js physics stack chips, synchronized word-level audio narration, and a rate-limited streaming AI chatbot grounded in the portfolio's content.

## Features

- **Custom WebGL Flow Shader (`OGL`)** — Domain-warped fragment shader with aspect-correct radial fade baked directly into the shader, automatic theme synchronization via `MutationObserver`, DPR capping (`<= 1.25`), and automatic pause when offscreen or hidden.
- **Streaming AI Portfolio Assistant** — Floating chat widget powered by Groq (`POST /api/chat`), grounded strictly in `lib/chat/knowledge.ts`, with input sanitization, token limits, and per-IP + daily rate limiting.
- **Bilingual Support (EN / VI)** — Full English and Vietnamese dictionary (`shared/i18n/`) with instant language switching across all pages, metadata, and audio narration.
- **Narrated Bio with Word-Level Highlighting** — Offline Text-to-Speech (TTS) pipeline generating static `.mp3` audio and word-boundary `.json` timestamps for real-time synced text highlighting on `/about`.
- **Interactive Craft & Motion** — Magnetic hover-morphing portrait, glow cursor backdrop, Matter.js physics-driven tech-stack chips, GSAP & Motion (`motion/react`) transitions, and Lenis smooth scrolling.
- **Monochrome Theme System** — Strict light/dark palette via `next-themes` with View Transitions API reveal and `prefers-reduced-motion` support.
- **SEO & Accessibility** — Dynamic `sitemap.ts` and `robots.ts`, Open Graph / Twitter metadata helpers, skip-to-content navigation, keyboard focus rings, and ARIA labeling.

## Pages & Routes

| Route       | Purpose                                                                                                                                             |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`         | Home — Hero with WebGL shader backdrop & magnetic morphing portrait, highlights strip, featured enterprise HRIS work, and interactive contact card. |
| `/projects` | Enterprise HRIS & AI project showcase with category filtering and detailed role, impact, and stack modals.                                          |
| `/about`    | Quick profile overview, narrated bio with word-level audio sync, experience timeline, core skills, and Matter.js interactive tech stack.            |
| `/api/chat` | Node.js streaming endpoint connecting the chat widget to Groq with rate limiting and grounded system prompting.                                     |

## Tech Stack

| Category                       | Technologies                                                                   |
| :----------------------------- | :----------------------------------------------------------------------------- |
| **Framework & Language**       | Next.js 16.1 (App Router), React 19, TypeScript 5 (strict)                     |
| **Styling & Theming**          | Tailwind CSS v4, `next-themes`, Geist Sans / Geist Mono / Fraunces             |
| **Graphics, Motion & Physics** | OGL (WebGL), GSAP (`@gsap/react`), Motion (`motion/react`), Matter.js, Lenis   |
| **AI & Audio**                 | Groq Chat Completions API (SSE streaming), `edge-tts` (offline build pipeline) |
| **UI & Tooling**               | Lucide Icons, ESLint 9, Prettier + `prettier-plugin-tailwindcss`               |

## Project Structure

```text
legend-portfolio/
├── app/
│   ├── about/                  # About page (narrated bio, timeline, skills, physics stack)
│   ├── api/chat/               # Streaming AI chatbot API route (Groq + rate limiting)
│   ├── projects/               # Projects page with filtering & detail modals
│   ├── globals.css             # Design tokens, monochrome theme, site-frame styles
│   ├── layout.tsx              # Root layout, fonts, providers, nav, WebGL backdrop
│   ├── page.tsx                # Home page
│   ├── robots.ts               # Dynamic robots.txt
│   └── sitemap.ts              # Dynamic sitemap.xml
├── components/
│   ├── about/                  # Quick info, narrated intro, experience, skills, Matter.js stack
│   ├── chat/                   # Floating AI assistant widget
│   ├── contact/                # Contact card with embedded shader & copy-to-clipboard email
│   ├── hero/                   # Hero headline, magnetic CTAs, portrait morph
│   ├── home/                   # Highlights strip & featured work section
│   ├── layout/                 # Pill nav, language dropdown, smooth scroll, backdrop, providers
│   ├── motion/                 # Reusable text reveal primitives
│   ├── projects/               # Project cards, category tabs, detail dialog
│   ├── shaders/                # OGL WebGL flow shader
│   └── ui/                     # Badges, dialogs, sheets, tabs, glow cursor, spotlight cards
├── hooks/
│   └── use-speech-highlight.ts # Audio playback synced with word-level timestamps
├── lib/
│   ├── chat/                   # Grounded knowledge base, prompt builder, rate limiter
│   ├── config.ts               # Feature flags (e.g., smoothScroll)
│   ├── i18n.tsx                # Client i18n context & hooks
│   ├── metadata.ts             # SEO & Open Graph metadata helpers
│   └── motion.tsx              # Motion configuration & reduced-motion utilities
├── public/
│   ├── audio/about/            # Pre-generated EN/VI narration (.mp3 + .json timestamps)
│   └── images/                 # Portrait, company logos, and project previews
├── scripts/
│   └── tts/                    # Offline TTS extraction, generation, and integrity checks
└── shared/
    └── i18n/                   # EN/VI translation dictionaries & typed translation keys
```

## Getting Started

### Prerequisites

- **Node.js** `20+` (Node `22.6+` required if running the offline TTS TypeScript scripts)
- **npm** (or your preferred Node package manager)
- **Python 3.9+** with `edge-tts` _(optional — only needed to regenerate narration audio)_

### 1. Clone the repository

```bash
git clone https://github.com/legend-nguyen/legend-portfolio.git
cd legend-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and add your Groq API key (required for the AI chat assistant):

```bash
cp .env.example .env.local
```

```env
# Get a free API key at https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Optional: override the default model
# GROQ_MODEL=openai/gpt-oss-20b
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                | Description                                                          |
| :--------------------- | :------------------------------------------------------------------- |
| `npm run dev`          | Start the Next.js development server                                 |
| `npm run build`        | Build the production bundle                                          |
| `npm run start`        | Start the production server                                          |
| `npm run lint`         | Run ESLint across the codebase                                       |
| `npm run lint:fix`     | Automatically fix ESLint issues                                      |
| `npm run format`       | Format source files with Prettier                                    |
| `npm run format:check` | Verify Prettier formatting                                           |
| `npm run typecheck`    | Run TypeScript strict type checking (`tsc --noEmit`)                 |
| `npm run tts:extract`  | Extract EN/VI intro text and SHA-256 hashes from i18n dictionaries   |
| `npm run tts:generate` | Regenerate static `.mp3` narration and word-level `.json` timestamps |
| `npm run tts:check`    | Verify audio timestamps match the current i18n intro copy            |

## AI Assistant & Offline TTS Pipeline

### AI Chatbot (`lib/chat/`)

- All portfolio facts are centralized in [`lib/chat/knowledge.ts`](lib/chat/knowledge.ts) to keep prompt context compact and accurate.
- [`app/api/chat/route.ts`](app/api/chat/route.ts) streams responses from Groq as plain text while enforcing message count (`10`), character length (`500`), output token caps (`400`), and per-IP/daily rate limits.

### Offline TTS Audio (`scripts/tts/`)

- Narration files in `public/audio/about/` are generated **offline** during development using [`edge-tts`](https://github.com/rany2/edge-tts) so zero external TTS calls occur at runtime.
- After editing the bio text in `shared/i18n/translates/`, regenerate and verify the audio assets:

```bash
pip install edge-tts
npm run tts:generate
npm run tts:check
```

See [`scripts/tts/README.md`](scripts/tts/README.md) for full pipeline details and voice options.

## Deployment

This project is ready to deploy on **Vercel** or any Node.js hosting platform:

1. Import the repository into [Vercel](https://vercel.com/new).
2. Add `GROQ_API_KEY` (and optionally `GROQ_MODEL`) in **Project Settings → Environment Variables**.
3. Deploy — `next build` handles static optimization, dynamic `sitemap.xml`/`robots.txt`, and the `/api/chat` route automatically.

## Contact

**Nguyễn Huyền Thoại** — Senior Full-Stack .NET & AI Developer

- **Email:** [thoainguyen.240899@gmail.com](mailto:thoainguyen.240899@gmail.com)
- **GitHub:** [@legend-nguyen](https://github.com/legend-nguyen)
- **LinkedIn:** [Nguyễn Thoại](https://www.linkedin.com/in/nguyen-thoai-745390442/)

## License

This project is open source and available for personal and educational reference. Please credit appropriately if you reuse parts of the architecture or shader code.
