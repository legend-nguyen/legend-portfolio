"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import {
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

export type SpotlightCardElement = "div" | "article" | "section" | "aside";

export type SpotlightCardProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  as?: SpotlightCardElement;
  children: ReactNode;
  /** Radius of the monochrome spotlight in pixels. Defaults to 280. */
  radius?: number;
  /** Whether to show the hairline border spotlight ring. Defaults to true. */
  borderHighlight?: boolean;
};

/**
 * Monochrome surface card with an ultra-subtle cursor-tracking radial highlight
 * (pure white at low opacity in dark mode, pure neutral black in light mode).
 * Updates CSS custom properties directly on the DOM node for 60fps with zero re-renders.
 */
export function SpotlightCard({
  as = "div",
  children,
  radius = 280,
  borderHighlight = true,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...rest
}: SpotlightCardProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      onPointerMove?.(event);
      if (prefersReducedMotion || event.pointerType === "touch") return;
      const node = containerRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      node.style.setProperty("--spotlight-x", `${x}px`);
      node.style.setProperty("--spotlight-y", `${y}px`);
      node.style.setProperty("--spotlight-opacity", "1");
    },
    [onPointerMove, prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      onPointerLeave?.(event);
      const node = containerRef.current;
      if (!node) return;
      node.style.setProperty("--spotlight-opacity", "0");
    },
    [onPointerLeave]
  );

  const mergedStyle: CSSProperties = {
    ...style,
    ["--spotlight-radius" as string]: `${radius}px`,
    ["--spotlight-opacity" as string]: "0",
  };

  const Tag = as;

  return (
    <Tag
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={mergedStyle}
      className={cn(
        "group/spotlight border-border-hairline bg-surface-1 hover:border-border-subtle relative overflow-hidden rounded-2xl border transition-colors duration-300",
        className
      )}
      {...rest}
    >
      {/* Ultra-subtle monochrome surface wash */}
      {!prefersReducedMotion ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: "var(--spotlight-opacity, 0)",
            background:
              "radial-gradient(var(--spotlight-radius, 280px) circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-surface), transparent 72%)",
          }}
        />
      ) : null}

      {/* Hairline 1px border highlight masked strictly to the border edge */}
      {!prefersReducedMotion && borderHighlight ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] p-px transition-opacity duration-300"
          style={{
            opacity: "var(--spotlight-opacity, 0)",
            background:
              "radial-gradient(calc(var(--spotlight-radius, 280px) * 0.85) circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-border), transparent 70%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      ) : null}

      <div className="relative z-10 h-full w-full">{children}</div>
    </Tag>
  );
}
