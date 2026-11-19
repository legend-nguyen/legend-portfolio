"use client";

import {
  DEFAULT_GLOW_IGNORE_SELECTOR,
  GlowCursor,
} from "@/components/ui/glow-cursor";
import { useReducedMotion } from "@/lib/motion";
import { useTheme } from "next-themes";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";
const DEFAULT_DARK_COLOR = "#3b82f6";
const DEFAULT_LIGHT_COLOR = "#0066ff";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function subscribeCoarsePointer(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(COARSE_POINTER_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getCoarsePointerSnapshot(): boolean {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

function getCoarsePointerServerSnapshot(): boolean {
  return true;
}

function readTokenColor(fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--ring")
    .trim();
  return value || fallback;
}

export function GlowCursorBackdrop(): ReactNode {
  const mounted = useIsMounted();
  const isCoarseOrNoHover = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    getCoarsePointerServerSnapshot
  );
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const [color, setColor] = useState<string>(DEFAULT_DARK_COLOR);

  useEffect(() => {
    if (!mounted || isCoarseOrNoHover || prefersReducedMotion) return;

    const fallback = isLight ? DEFAULT_LIGHT_COLOR : DEFAULT_DARK_COLOR;
    const syncColor = (): void => {
      setColor(readTokenColor(fallback));
    };

    syncColor();

    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [mounted, isCoarseOrNoHover, prefersReducedMotion, isLight]);

  if (!mounted || isCoarseOrNoHover || prefersReducedMotion) {
    return null;
  }

  return (
    <GlowCursor
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      color={color}
      theme={isLight ? "light" : "dark"}
      intensity={isLight ? 1.05 : 1.15}
      trailWidth={4}
      linger={0.95}
      glow={isLight ? 1.0 : 1.15}
      hotspot={isLight ? 0.45 : 0.65}
      grain={0}
      quality="medium"
      maxDevicePixelRatio={1.5}
      ignoreSelector={DEFAULT_GLOW_IGNORE_SELECTOR}
    />
  );
}

