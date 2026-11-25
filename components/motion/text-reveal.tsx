"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export type TextRevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
export type TextRevealTrigger = "view" | "mount";

const MOTION_ELEMENTS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

export type FadeInTextProps = {
  children: ReactNode;
  as?: TextRevealTag;
  delay?: number;
  duration?: number;
  y?: number;
  trigger?: TextRevealTrigger;
  once?: boolean;
  className?: string;
};

/**
 * Quiet, editorial fade-and-rise reveal for headings and short copy.
 * GPU-accelerated (opacity + transform) and respects `prefers-reduced-motion`.
 */
export function FadeInText({
  children,
  as = "p",
  delay = 0,
  duration = 0.48,
  y = 10,
  trigger = "view",
  once = true,
  className,
}: FadeInTextProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const Component = MOTION_ELEMENTS[as];

  const initial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y };
  const target = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration, delay, ease: EDITORIAL_EASE };

  if (trigger === "mount") {
    return (
      <Component
        initial={initial}
        animate={target}
        transition={transition}
        className={cn(className)}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={initial}
      whileInView={target}
      viewport={{ once, amount: 0.05, margin: "0px 0px 80px 0px" }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

export type BlurRevealProps = {
  children: ReactNode;
  as?: TextRevealTag;
  by?: "block" | "word";
  delay?: number;
  duration?: number;
  stagger?: number;
  y?: number;
  blur?: number;
  trigger?: TextRevealTrigger;
  once?: boolean;
  className?: string;
};

/**
 * Understated editorial blur-to-crisp reveal for display headings.
 * Supports whole-block reveal or quiet word-by-word cadence when `children` is a string.
 */
export function BlurReveal({
  children,
  as = "h2",
  by = "block",
  delay = 0,
  duration = 0.55,
  stagger = 0.035,
  y = 8,
  blur = 6,
  trigger = "view",
  once = true,
  className,
}: BlurRevealProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const Component = MOTION_ELEMENTS[as];

  if (by === "word" && typeof children === "string") {
    const tokens = children.split(/(\s+)/).filter((part) => part.length > 0);
    let wordIndex = 0;

    const containerVariants = {
      hidden: {},
      visible: {
        transition: prefersReducedMotion
          ? { duration: 0.01 }
          : { delayChildren: delay, staggerChildren: stagger },
      },
    };

    const wordVariants = {
      hidden: prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, y, filter: `blur(${blur}px)` },
      visible: prefersReducedMotion
        ? { opacity: 1, transition: { duration: 0.01 } }
        : {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration, ease: EDITORIAL_EASE },
          },
    };

    const triggerProps =
      trigger === "mount"
        ? { initial: "hidden" as const, animate: "visible" as const }
        : {
            initial: "hidden" as const,
            whileInView: "visible" as const,
            viewport: { once, amount: 0.05, margin: "0px 0px 80px 0px" },
          };

    return (
      <Component
        key={children}
        variants={containerVariants}
        {...triggerProps}
        className={cn(className)}
      >
        {tokens.map((token, idx) => {
          if (/^\s+$/.test(token)) {
            return <span key={`space-${idx}`}>{token}</span>;
          }
          const currentWord = wordIndex++;
          return (
            <motion.span
              key={`word-${currentWord}-${token}`}
              variants={wordVariants}
              className="inline-block will-change-[transform,opacity,filter]"
            >
              {token}
            </motion.span>
          );
        })}
      </Component>
    );
  }

  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y, filter: `blur(${blur}px)` };
  const target = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration, delay, ease: EDITORIAL_EASE };

  if (trigger === "mount") {
    return (
      <Component
        initial={initial}
        animate={target}
        transition={transition}
        className={cn(className)}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={initial}
      whileInView={target}
      viewport={{ once, amount: 0.05, margin: "0px 0px 80px 0px" }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
