"use client";

import {
  DEFAULT_GLOW_IGNORE_SELECTOR,
  GlowCursor,
} from "@/components/ui/glow-cursor";
import { useReducedMotion } from "@/lib/motion";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";
const MONOCHROME_DARK_COLOR = "#ffffff";
const MONOCHROME_LIGHT_COLOR = "#18181b";

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

  if (!mounted || isCoarseOrNoHover || prefersReducedMotion) {
    return null;
  }

  return (
    <GlowCursor
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      color={isLight ? MONOCHROME_LIGHT_COLOR : MONOCHROME_DARK_COLOR}
      theme={isLight ? "light" : "dark"}
      intensity={isLight ? 0.22 : 0.28}
      trailWidth={3}
      linger={0.85}
      glow={isLight ? 0.3 : 0.38}
      hotspot={isLight ? 0.15 : 0.22}
      grain={0}
      quality="medium"
      maxDevicePixelRatio={1.5}
      ignoreSelector={DEFAULT_GLOW_IGNORE_SELECTOR}
    />
  );
}
