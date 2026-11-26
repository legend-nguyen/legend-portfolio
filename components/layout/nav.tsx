"use client";

import { LanguageDropdown } from "@/components/layout/language-dropdown";
import { useTranslation } from "@/lib/i18n";
import { useMotionPreference, useReducedMotion } from "@/lib/motion";
import { TRANSLATION_KEYS, type TranslationKey } from "@/shared/i18n";
import { Moon, Sparkles, Sun, ZapOff } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";

type NavItem = {
  labelKey: TranslationKey;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: TRANSLATION_KEYS.nav.home, href: "/" },
  { labelKey: TRANSLATION_KEYS.nav.projects, href: "/projects" },
  { labelKey: TRANSLATION_KEYS.nav.about, href: "/about" },
];

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavMotionToggle(): ReactNode {
  const mounted = useIsMounted();
  const { reducedMotion, toggleReducedMotion } = useMotionPreference();
  const { t } = useTranslation();

  const label = mounted
    ? reducedMotion
      ? t(TRANSLATION_KEYS.motion.enableAnimations)
      : t(TRANSLATION_KEYS.motion.disableAnimations)
    : t(TRANSLATION_KEYS.motion.toggle);

  return (
    <button
      type="button"
      onClick={toggleReducedMotion}
      aria-label={label}
      title={label}
      aria-pressed={mounted ? reducedMotion : undefined}
      className="focus-ring text-text-secondary hover:bg-surface-2 hover:text-foreground relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sparkles
          className={`absolute inset-0 h-4 w-4 text-current transition-[transform,opacity] duration-250 ease-out ${
            mounted && !reducedMotion
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />
        <ZapOff
          className={`absolute inset-0 h-4 w-4 text-current transition-[transform,opacity] duration-250 ease-out ${
            mounted && reducedMotion
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const transition = document.startViewTransition(() => {
      setTheme(next);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? t(TRANSLATION_KEYS.theme.switchToLight)
            : t(TRANSLATION_KEYS.theme.switchToDark)
          : t(TRANSLATION_KEYS.theme.toggle)
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring text-text-secondary hover:bg-surface-2 hover:text-foreground relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-current transition-[transform,opacity] duration-250 ease-out ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 -rotate-45 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-current transition-[transform,opacity] duration-250 ease-out ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-75 rotate-45 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <nav
      aria-label={t(TRANSLATION_KEYS.nav.ariaLabel)}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 sm:top-5"
    >
      <div className="border-border-hairline bg-canvas/85 dark:bg-surface-1/85 flex items-center gap-1 rounded-full border p-1 shadow-[0_4px_20px_-8px_rgb(0_0_0/0.12)] backdrop-blur-md dark:shadow-[0_8px_28px_-10px_rgb(0_0_0/0.75)]">
        <ul className="relative flex items-center gap-0.5">
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="focus-ring type-label relative inline-flex h-8 cursor-pointer items-center justify-center rounded-full px-3.5 transition-colors duration-200"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      aria-hidden="true"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="border-border-subtle bg-surface-2 dark:bg-surface-3 absolute inset-0 rounded-full border"
                    />
                  )}
                  <span
                    className={
                      isActive
                        ? "text-foreground relative z-10 whitespace-nowrap"
                        : "text-text-secondary hover:text-foreground relative z-10 whitespace-nowrap transition-colors duration-200"
                    }
                  >
                    {t(item.labelKey)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <span
          aria-hidden="true"
          className="bg-border-hairline mx-0.5 h-4 w-px shrink-0"
        />

        <LanguageDropdown />

        <span
          aria-hidden="true"
          className="bg-border-hairline mx-0.5 h-4 w-px shrink-0"
        />

        <NavMotionToggle />

        <span
          aria-hidden="true"
          className="bg-border-hairline mx-0.5 h-4 w-px shrink-0"
        />

        <NavThemeToggle />
      </div>
    </nav>
  );
}
