"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { features } from "@/lib/config";
import { useReducedMotion } from "@/lib/motion";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

export function SmoothScroll({ children }: { children: ReactNode }): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!features.smoothScroll || prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    let destroyed = false;
    let rafId = 0;

    function raf(time: number): void {
      if (destroyed) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    function handleAnchorClick(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -100 });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      destroyed = true;
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
