"use client";

import { useReducedMotion } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type SplitTextTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span";

export type SplitTextEffect =
  | "rise"
  | "fade"
  | "blur"
  | "flip"
  | "pop"
  | "skew"
  | "wave";

export type SplitTextTrigger = "view" | "load" | "hover" | "click";

export type SplitTextHoverEffect = "none" | "lift" | "wave";

export type SplitTextType = "chars" | "words" | "lines" | "words, chars";

export type SplitTextStaggerFrom =
  | "start"
  | "center"
  | "end"
  | "edges"
  | "random";

export type SplitTextAlign =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";

export interface SplitTextProps {
  tag?: SplitTextTag;
  text?: string;
  className?: string;
  effect?: SplitTextEffect;
  trigger?: SplitTextTrigger;
  loop?: boolean;
  loopDelay?: number;
  hoverEffect?: SplitTextHoverEffect;
  color?: string;
  accentColor?: string;
  delay?: number;
  startDelay?: number;
  duration?: number;
  ease?: string | gsap.EaseFunction;
  splitType?: SplitTextType;
  staggerFrom?: SplitTextStaggerFrom;
  mask?: boolean;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: SplitTextAlign;
  onLetterAnimationComplete?: () => void;
}

type EffectPreset = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
};

const EFFECT_PRESETS: Record<SplitTextEffect, EffectPreset> = {
  rise: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  blur: {
    from: { opacity: 0, filter: "blur(10px)", y: 12 },
    to: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  flip: {
    from: {
      opacity: 0,
      rotationX: -90,
      transformOrigin: "50% 50% -20px",
    },
    to: { opacity: 1, rotationX: 0 },
  },
  pop: {
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
  },
  skew: {
    from: { opacity: 0, skewX: 20, y: 24 },
    to: { opacity: 1, skewX: 0, y: 0 },
  },
  wave: {
    from: { opacity: 0, y: 28, rotation: -8 },
    to: { opacity: 1, y: 0, rotation: 0 },
  },
};

export function splitGraphemes(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (item) => item.segment);
  }
  return Array.from(text);
}

export function countGraphemes(text: string): number {
  return splitGraphemes(text).length;
}

type WordToken =
  | { kind: "space"; value: string; key: string }
  | { kind: "word"; value: string; chars: string[]; key: string };

function tokenizeText(text: string): WordToken[] {
  const parts = text.split(/(\s+)/);
  return parts
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (/^\s+$/.test(part)) {
        return {
          kind: "space",
          value: part,
          key: `space-${index}`,
        };
      }
      return {
        kind: "word",
        value: part,
        chars: splitGraphemes(part),
        key: `word-${index}`,
      };
    });
}

function resolveScrollStart(threshold: number, rootMargin: string): string {
  const clamped = Math.max(0, Math.min(1, threshold));
  const pct = Math.round((1 - clamped) * 100);
  const marginMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(rootMargin.trim());
  if (!marginMatch) {
    return `top ${pct}%`;
  }
  const offset = Number(marginMatch[1]);
  if (offset === 0) {
    return `top ${pct}%`;
  }
  const sign = offset > 0 ? "+" : "-";
  return `top ${pct}%${sign}=${Math.abs(offset)}px`;
}

export function SplitText({
  tag = "p",
  text = "",
  className = "",
  effect = "rise",
  trigger = "view",
  loop = false,
  loopDelay = 1.5,
  hoverEffect = "none",
  color,
  accentColor,
  delay = 50,
  startDelay = 0,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  staggerFrom = "start",
  mask = false,
  from,
  to,
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const completedOnceRef = useRef(false);
  const [settledText, setSettledText] = useState<string | null>(null);
  const isSettled =
    prefersReducedMotion || (!loop && hoverEffect === "none" && settledText === text);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  const setContainerRef = useCallback((node: HTMLElement | null): void => {
    containerRef.current = node;
  }, []);

  const tokens = useMemo(() => tokenizeText(text), [text]);
  const lines = useMemo(
    () => (splitType === "lines" ? text.split("\n") : []),
    [text, splitType]
  );

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container || !text) return;

      const targets = Array.from(
        container.querySelectorAll<HTMLElement>("[data-split-unit]")
      );
      if (targets.length === 0) return;

      completedOnceRef.current = false;

      if (prefersReducedMotion) {
        gsap.set(targets, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          rotationX: 0,
          skewX: 0,
          filter: "none",
          clearProps: "transform,filter",
          ...(color ? { color } : {}),
        });
        completedOnceRef.current = true;
        if (!loop && hoverEffect === "none") {
          setSettledText(text);
        }
        onCompleteRef.current?.();
        return;
      }

      const preset = EFFECT_PRESETS[effect];
      const hasCustomFromTo = from !== undefined || to !== undefined;
      const fromVars: gsap.TweenVars = hasCustomFromTo
        ? { ...(from ?? {}) }
        : { ...preset.from };
      const toVars: gsap.TweenVars = hasCustomFromTo
        ? { ...(to ?? {}) }
        : { ...preset.to };

      if (accentColor) {
        fromVars.color = accentColor;
        toVars.color = color ?? "inherit";
      } else if (color) {
        toVars.color = color;
      }

      const staggerSeconds = delay / 1000;
      const initialDelaySeconds = Math.max(0, startDelay) / 1000;

      const buildTween = (): gsap.core.Timeline => {
        const tl = gsap.timeline({
          delay: initialDelaySeconds,
          repeat: loop ? -1 : 0,
          repeatDelay: loop ? loopDelay : 0,
          onComplete: () => {
            if (!completedOnceRef.current) {
              completedOnceRef.current = true;
              onCompleteRef.current?.();
            }
          },
          onRepeat: () => {
            gsap.set(targets, fromVars);
          },
        });

        tl.fromTo(
          targets,
          { ...fromVars, willChange: "transform, opacity" },
          {
            ...toVars,
            duration,
            ease,
            stagger: {
              each: staggerSeconds,
              from: staggerFrom,
            },
            clearProps:
              accentColor || color
                ? "transform,opacity,filter,willChange"
                : "transform,opacity,filter,color,willChange",
            onComplete: () => {
              if (!loop && hoverEffect === "none") {
                setSettledText(text);
              }
            },
          }
        );

        return tl;
      };

      let activeTimeline: gsap.core.Timeline | null = null;
      let scrollTriggerInstance: ScrollTrigger | null = null;

      if (trigger === "load") {
        activeTimeline = buildTween();
      } else if (trigger === "view") {
        gsap.set(targets, fromVars);
        activeTimeline = buildTween();
        activeTimeline.pause(0);

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: container,
          start: resolveScrollStart(threshold, rootMargin),
          once: !loop,
          onEnter: () => {
            activeTimeline?.play();
          },
          onEnterBack: () => {
            if (loop) activeTimeline?.play();
          },
        });
      } else {
        gsap.set(targets, fromVars);
      }

      const handleTriggerAction = (): void => {
        if (trigger !== "hover" && trigger !== "click") return;
        activeTimeline?.kill();
        gsap.set(targets, fromVars);
        activeTimeline = buildTween();
      };

      if (trigger === "hover") {
        container.addEventListener("pointerenter", handleTriggerAction);
      } else if (trigger === "click") {
        container.addEventListener("click", handleTriggerAction);
      }

      const hoverCleanups: Array<() => void> = [];
      if (hoverEffect !== "none") {
        targets.forEach((unit, idx) => {
          const onEnter = (): void => {
            if (!completedOnceRef.current && trigger !== "hover") return;
            if (hoverEffect === "lift") {
              gsap.to(unit, {
                y: -6,
                duration: 0.22,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else if (hoverEffect === "wave") {
              targets.forEach((other, otherIdx) => {
                const distance = Math.abs(otherIdx - idx);
                const lift = distance <= 3 ? -8 * Math.exp(-distance * 0.6) : 0;
                gsap.to(other, {
                  y: lift,
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              });
            }
          };

          const onUnitLeave = (): void => {
            if (hoverEffect === "lift") {
              gsap.to(unit, {
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
                clearProps: "transform",
              });
            }
          };

          unit.addEventListener("pointerenter", onEnter);
          unit.addEventListener("pointerleave", onUnitLeave);
          hoverCleanups.push(() => {
            unit.removeEventListener("pointerenter", onEnter);
            unit.removeEventListener("pointerleave", onUnitLeave);
          });
        });

        if (hoverEffect === "wave") {
          const onContainerLeave = (): void => {
            gsap.to(targets, {
              y: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
              clearProps: "transform",
            });
          };
          container.addEventListener("pointerleave", onContainerLeave);
          hoverCleanups.push(() => {
            container.removeEventListener("pointerleave", onContainerLeave);
          });
        }
      }

      return () => {
        activeTimeline?.kill();
        scrollTriggerInstance?.kill();
        if (trigger === "hover") {
          container.removeEventListener("pointerenter", handleTriggerAction);
        } else if (trigger === "click") {
          container.removeEventListener("click", handleTriggerAction);
        }
        hoverCleanups.forEach((fn) => fn());
      };
    },
    {
      scope: containerRef,
      revertOnUpdate: true,
      dependencies: [
        text,
        effect,
        trigger,
        loop,
        loopDelay,
        hoverEffect,
        color,
        accentColor,
        delay,
        startDelay,
        duration,
        ease,
        splitType,
        staggerFrom,
        from,
        to,
        threshold,
        rootMargin,
        prefersReducedMotion,
      ],
    }
  );

  const Tag = tag;
  const isInlineTag = tag === "span";
  const containerStyle: CSSProperties = {
    textAlign,
    ...(color ? { color } : {}),
  };

  const renderSplitContent = (): ReactNode => {
    if (splitType === "lines") {
      return lines.map((line, index) => (
        <span
          key={`line-${index}`}
          className={mask ? "block overflow-hidden" : "block"}
        >
          <span data-split-unit className="inline-block align-baseline">
            {line}
          </span>
        </span>
      ));
    }

    if (splitType === "words") {
      return tokens.map((token) => {
        if (token.kind === "space") {
          return <span key={token.key}>{token.value}</span>;
        }
        return (
          <span
            key={token.key}
            className={
              mask
                ? "inline-block overflow-hidden align-baseline"
                : "inline-block align-baseline"
            }
          >
            <span data-split-unit className="inline-block align-baseline">
              {token.value}
            </span>
          </span>
        );
      });
    }

    // "chars" or "words, chars"
    return tokens.map((token) => {
      if (token.kind === "space") {
        return <span key={token.key}>{token.value}</span>;
      }
      return (
        <span
          key={token.key}
          className="inline-block align-baseline whitespace-nowrap"
        >
          {token.chars.map((char, charIdx) => (
            <span
              key={`${token.key}-char-${charIdx}`}
              className={
                mask
                  ? "inline-block overflow-hidden align-baseline"
                  : "inline-block align-baseline"
              }
            >
              <span data-split-unit className="inline-block align-baseline">
                {char}
              </span>
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <Tag
      ref={setContainerRef}
      style={containerStyle}
      className={`${isInlineTag ? "inline" : "block"} ${className}`.trim()}
    >
      {isSettled ? (
        text
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{renderSplitContent()}</span>
        </>
      )}
    </Tag>
  );
}
