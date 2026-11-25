<div align="center">

# Portfolio Template

**A Next.js 16+ personal portfolio template with a signature WebGL flow shader, a magnetic morphing portrait, Lenis smooth scroll, and a calm black-and-white design system.**

Designed for individual designers and engineers who want a brand-ready scaffold with a distinctive look on day one.

![Next.js](https://img.shields.io/badge/Next.js-16+-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-OGL-990000?logo=webgl&logoColor=white)
![License](https://img.shields.io/badge/License-Free_to_use-brightgreen)

</div>

---

## Table of Contents

- [Features](#features)
- [Sections Included](#sections-included)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Design System](#design-system)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Notes](#notes)
- [License](#license)

---

## Features

- ✅ **Next.js 16+** with App Router
- ✅ **TypeScript** (strict mode)
- ✅ **Tailwind CSS v4** with token-driven theming
- ✅ **Dark Mode** via `next-themes` (class-based) with view-transition reveal
- ✅ **Motion** via `motion/react` with reduced-motion support
- ✅ **WebGL Flow Shader**: aspect-correct circular fade baked into the fragment, theme-aware background sync
- ✅ **Lenis Smooth Scroll** with anchor-link integration
- ✅ **Portrait Morph**: hover-driven `webp` swap with magnetic cursor follow
- ✅ **Polaroid Strip, Skills, Stack, Experience, Education**: co-located content sections for an `/about` route
- ✅ **Projects Grid**: Dribbble-style mockup cards with hover lift and image zoom
- ✅ **Contact Card**: single-click copy email with hover content swap, embedded shader
- ✅ **Animated Pill Nav**: spring-animated active indicator, hydration-safe theme toggle
- ✅ **Site Frame**: fixed top/left/right rails with rounded inner corners
- ✅ **SEO Ready**: metadata, Open Graph, Twitter cards, sitemap, robots
- ✅ **Accessibility**: skip links, focus rings, ARIA labels, `prefers-reduced-motion` guards
- ✅ **Edge Compatible**: no Node-only APIs

## Sections Included

| Section | Description |
|---------|-------------|
| **Nav** | Fixed pill nav with spring-animated active indicator and hydration-safe theme toggle |
| **Hero** | WebGL flow shader backdrop, two-line headline, morphing portrait, magnetic CTAs |
| **Projects** | Grid of Dribbble-style project cards with hover lift, image zoom, and external links |
| **About** | Polaroid strip, skills grid, interactive Matter.js stack chips, expandable experience timeline, education list |
| **Contact Card** | Embedded shader, copy-to-clipboard email, secondary social CTAs |
| **Page Backdrop** | Site-wide flow shader, mobile-attenuated, baked radial fade to background |
| **Skip-to-Content** | Keyboard-first accessibility entry point |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start development server     |
| `npm run build`        | Build for production         |
| `npm run start`        | Start production server      |
| `npm run lint`         | Run ESLint                   |
| `npm run lint:fix`     | Fix ESLint errors            |
| `npm run format`       | Format code with Prettier    |
| `npm run format:check` | Check code formatting        |
| `npm run typecheck`    | Run TypeScript type checking |

## Project Structure

```text
├── app/
│   ├── about/                       # About route
│   ├── projects/                    # Projects route
│   ├── globals.css                  # Design tokens, frame, project-card styles
│   ├── layout.tsx                   # Root layout with providers, nav, backdrop
│   ├── page.tsx                     # Home page
│   ├── robots.ts                    # Dynamic robots.txt
│   ├── sitemap.ts                   # Dynamic sitemap
│   ├── icon.svg                     # Favicon
│   └── apple-icon.svg               # Apple touch icon
├── components/
│   ├── about/
│   │   ├── education.tsx            # Education list with bordered logo squares
│   │   ├── experience.tsx           # Expandable timeline with fade-mask collapse
│   │   ├── polaroid-strip.tsx       # Tilted polaroid photos with dotted backs
│   │   ├── skills.tsx               # Skills grid
│   │   └── stack.tsx                # Matter.js physics-driven tech chips
│   ├── contact/
│   │   ├── contact-button.tsx       # Click-to-copy email button
│   │   ├── contact-card.tsx         # Shader-backed contact card
│   │   └── contact-card-ctas.tsx    # Social CTAs
│   ├── hero/
│   │   ├── hero.tsx                 # Hero layout and copy
│   │   ├── hero-ctas.tsx            # Magnetic primary/secondary CTAs
│   │   └── portrait-morph.tsx       # Hover-swap portrait with magnetic follow
│   ├── layout/
│   │   ├── nav.tsx                  # Pill nav with theme toggle
│   │   ├── page-backdrop.tsx        # Site-wide shader backdrop
│   │   ├── providers.tsx            # Theme + smooth-scroll providers
│   │   ├── skip-to-content.tsx      # Skip link for a11y
│   │   └── smooth-scroll.tsx        # Lenis smooth-scroll wrapper
│   ├── projects/
│   │   └── projects.tsx             # Projects grid
│   ├── shaders/
│   │   └── shader-flow.tsx          # WebGL flow shader (raw OGL)
│   └── ui/
│       ├── dotted-pattern.tsx       # Shared dotted texture
│       └── motion-primitives.tsx    # FadeIn, ScaleUnblur entrance helpers
├── lib/
│   ├── config.ts                    # Site config
│   ├── metadata.ts                  # SEO metadata utilities
│   └── motion.tsx                   # Motion components & hooks
└── public/
    ├── josh.webp                    # Default portrait
    ├── josh_wave.webp               # Hover portrait
    ├── linkedin.svg                 # Social icon
    ├── x.svg                        # Social icon
    └── site.webmanifest             # PWA manifest
```

## Customization

### 1. Update Site Configuration

Edit `lib/metadata.ts` to update:

- Site name, description, and URL
- Social media handles
- Keywords and authors

> [!IMPORTANT]
> The default `siteConfig.url` is `https://example.com`. Replace it with your production URL before deploying so OpenGraph and the sitemap emit correct absolute URLs.

### 2. Replace Brand & Portrait

- Swap `public/josh.webp` and `public/josh_wave.webp` with your own default and hover portraits. Keep both files at the same dimensions and aspect ratio for a clean morph.
- Update headline, eyebrow, and subtitle copy in `components/hero/hero.tsx`.
- Update social handles and email in `components/contact/contact-card.tsx` and `components/contact/contact-card-ctas.tsx`.

### 3. Update About Content

All about-page content is co-located in its component file. There is no separate content directory.

| File | What to edit |
|------|--------------|
| `components/about/polaroid-strip.tsx` | Image paths and captions |
| `components/about/skills.tsx` | Skill list |
| `components/about/stack.tsx` | Tech logos and physics chips |
| `components/about/experience.tsx` | Roles, companies, dates, descriptions |
| `components/about/education.tsx` | Schools, programs, dates |

### 4. Update Projects

Edit the project array in `components/projects/projects.tsx`. Each entry includes a title, description, image (Dribbble mockup or your own), and external link.

### 5. Replace Icons

Replace the following files with your brand assets:
- `app/icon.svg` — Favicon (32x32)
- `app/apple-icon.svg` — Apple touch icon (180x180)
- `public/og-image.png` — Open Graph image (1200x630)

### 6. Tune the Shader

The flow shader (`components/shaders/shader-flow.tsx`) is used by both the page backdrop and the contact card. Key knobs (all exposed as props with sensible defaults):

| Prop | Description |
|------|-------------|
| `colorLowA`, `colorHighA` | Palette stops in linear RGB |
| `flowSpeed` | `[x, y]` flow vector |
| `iterations` | Domain-warp iteration count (up to 24) |
| `scale` | Domain scale |
| `brightness` | Output multiplier |
| `fadeCx`, `fadeCy`, `fadeRx`, `fadeRy` | Aspect-correct circular fade center and radii |

The fade is baked into the fragment shader and reads `--background` from CSS, so theme changes are picked up automatically via a `MutationObserver` on `<html>`.

The shader:
- Caps DPR at `min(devicePixelRatio, 1.25)` for `ShaderFlow`
- Sizes to host container via `ResizeObserver`
- Pauses via `IntersectionObserver` when offscreen and on `visibilitychange`
- Uses `highp` precision and renders a single opaque draw (no CSS mask layers)

### 7. Add Routes

```tsx
// app/contact/page.tsx
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Get in touch.",
  path: "/contact",
});

export default function ContactPage() {
  return <main id="main-content">...</main>;
}
```

## Design System

### Colors

| Token | Usage |
|-------|-------|
| `--background` / `--foreground` | Page background and text |
| `--muted` / `--muted-foreground` | Subtle surfaces and secondary text |
| `--border` | Hairline rails and dividers |
| `--ring` | Focus rings |
| `--frame` | Site-frame color (matches `--background`) |

The palette is strict black and white. No accent or semantic color hues are used.

### Typography

| Role | Font |
|------|------|
| Sans | Geist Sans |
| Mono | Geist Mono |
| Serif | Fraunces (used selectively for display headlines) |

### Layout Conventions

- Headlines: maximum two lines, no italic, no em-dashes
- Site frame: fixed top + left + right rails with two top corner cutouts (desktop only; hidden under 850px)
- Card hovers: project cards use a single resting + single hover shadow tier with translate-y lift
- No `backdrop-blur` (except the experience collapsed-fade)
- Cursor: `pointer` on all clickable nav and CTA items

## Accessibility

The template includes:
- Skip-to-content link
- Visible focus rings on all interactive elements
- ARIA labels on toggles, social links, and the contact button
- `prefers-reduced-motion` guards on the theme toggle view-transition
- Shaders pause when offscreen and on tab hide
- Proper heading hierarchy (single `<h1>` per page)
- WCAG 2.1 AA contrast compliance in both themes

## Performance

- WebGL context cleanup on unmount via `WEBGL_lose_context`
- Single mount-once shader effect; uniforms updated via refs
- Shaders pause when offscreen (`IntersectionObserver`) and on tab hide (`visibilitychange`)
- DPR capped to keep shading cost bounded on retina displays
- Page-backdrop fade is baked into the fragment shader (single opaque draw, no mask layers)
- Matter.js is dynamic-imported inside the stack section
- Lenis smooth scroll runs on a single `rAF` loop
- Edge-compatible runtime

## Notes

- `next.config.ts` `images.remotePatterns` allows `images.unsplash.com` and `cdn.dribbble.com` for the polaroid and project mockups respectively.
- The portfolio uses a single `@/` path alias.
- A disclaimer comment at the top of `components/projects/projects.tsx` notes that Dribbble mockups are placeholders to be replaced with your own work.

## License

This template is free to use in personal and commercial projects. You may not resell or redistribute the template itself.
#   l e g e n d - p o r t f o l i o 
 
 