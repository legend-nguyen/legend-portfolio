"use client";

import { useTranslation } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/motion";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Chip = {
  label: string;
  slug: string;
  iconColor?: string;
  iconUrl?: string;
  invertInDark?: boolean;
};

const CHIPS: readonly Chip[] = [
  { label: "React", slug: "react", iconColor: "00D8FF" },
  {
    label: "Next.js",
    slug: "nextdotjs",
    iconColor: "09090b",
    invertInDark: true,
  },
  { label: "TypeScript", slug: "typescript", iconColor: "3178C6" },
  { label: ".NET Core", slug: "dotnet", iconColor: "6D4AFF" },
  {
    label: "C# & SQL Server",
    slug: "csharp",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
  { label: "Tailwind CSS", slug: "tailwindcss", iconColor: "06B6D4" },
  { label: "GSAP", slug: "gsap", iconColor: "16A34A" },
  { label: "Angular", slug: "angular", iconColor: "DD0031" },
  { label: "JavaScript", slug: "javascript", iconColor: "EAB308" },
  {
    label: "GitHub",
    slug: "github",
    iconColor: "09090b",
    invertInDark: true,
  },
  { label: "Claude", slug: "claude", iconColor: "D97757" },
];

const CHIP_RADIUS = 9999;
const WALL_PAD = 16;

type ChipState = {
  chip: Chip;
  body: Matter.Body;
  width: number;
  height: number;
};

export function Stack(): ReactNode {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const Matter = await import("matter-js");
      if (cancelled) return;

      const {
        Engine,
        Runner,
        World,
        Bodies,
        Body,
        Mouse,
        MouseConstraint,
        Events,
      } = Matter;

      const measureChildren = Array.from(measure.children) as HTMLElement[];
      const dims = measureChildren.map((el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.max(84, r.width), h: Math.max(36, r.height) };
      });

      let width = container.clientWidth;
      let height = container.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;
      const world = engine.world;

      const wallThickness = 400;
      const floor = Bodies.rectangle(
        width / 2,
        height - WALL_PAD + wallThickness / 2,
        width * 3,
        wallThickness,
        { isStatic: true }
      );
      const leftWall = Bodies.rectangle(
        WALL_PAD - wallThickness / 2,
        height / 2,
        wallThickness,
        height * 4,
        { isStatic: true }
      );
      const rightWall = Bodies.rectangle(
        width - WALL_PAD + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 4,
        { isStatic: true }
      );
      World.add(world, [floor, leftWall, rightWall]);

      const states: ChipState[] = CHIPS.map((chip, i) => {
        const dim = dims[i] ?? { w: 120, h: 36 };
        const { w, h } = dim;
        const halfW = w / 2;
        const minX = WALL_PAD + halfW + 4;
        const maxX = width - WALL_PAD - halfW - 4;
        const x = minX + Math.random() * Math.max(1, maxX - minX);
        const y = -60 - i * 52 - Math.random() * 90;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: Math.floor(h / 2) },
          restitution: 0.35,
          friction: 0.5,
          frictionAir: 0.025,
          density: 0.0018,
          angle: (Math.random() - 0.5) * 0.35,
        });
        World.add(world, body);
        return { chip, body, width: w, height: h };
      });

      const mouse = Mouse.create(container);

      const wheelTarget = mouse.element as HTMLElement & {
        mousewheel?: EventListener;
      };
      if (wheelTarget.mousewheel) {
        wheelTarget.removeEventListener("wheel", wheelTarget.mousewheel);
        wheelTarget.removeEventListener(
          "DOMMouseScroll",
          wheelTarget.mousewheel
        );
      }

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          damping: 0.2,
          render: { visible: false },
        },
      });
      World.add(world, mouseConstraint);

      Events.on(mouseConstraint, "startdrag", () => {
        container.style.cursor = "grabbing";
      });
      Events.on(mouseConstraint, "enddrag", () => {
        container.style.cursor = "grab";
      });

      const runner = Runner.create();
      let isActive = false;
      let raf = 0;

      const tick = (): void => {
        if (!isActive) return;
        for (let i = 0; i < states.length; i++) {
          const s = states[i];
          const el = chipRefs.current[i];
          if (!s || !el) continue;
          const { x, y } = s.body.position;
          el.style.transform = `translate3d(${x - s.width / 2}px, ${y - s.height / 2}px, 0) rotate(${s.body.angle}rad)`;
        }
        raf = requestAnimationFrame(tick);
      };

      const startLoop = (): void => {
        if (isActive) return;
        isActive = true;
        Runner.run(runner, engine);
        raf = requestAnimationFrame(tick);
      };

      const stopLoop = (): void => {
        if (!isActive) return;
        isActive = false;
        cancelAnimationFrame(raf);
        raf = 0;
        Runner.stop(runner);
      };

      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          if (visible && !document.hidden) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: "120px" }
      );
      io.observe(container);

      const onVisibility = (): void => {
        if (document.hidden) {
          stopLoop();
        } else {
          startLoop();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onResize = (): void => {
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        if (newW === width && newH === height) return;
        Body.setPosition(floor, {
          x: newW / 2,
          y: newH - WALL_PAD + wallThickness / 2,
        });
        Body.setPosition(leftWall, {
          x: WALL_PAD - wallThickness / 2,
          y: newH / 2,
        });
        Body.setPosition(rightWall, {
          x: newW - WALL_PAD + wallThickness / 2,
          y: newH / 2,
        });
        width = newW;
        height = newH;
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      cleanup = () => {
        stopLoop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        World.clear(world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [resetKey, prefersReducedMotion]);

  return (
    <section className="border-border-hairline bg-surface-1 hover:border-border-subtle overflow-hidden rounded-2xl border transition-colors duration-300">
      <div className="border-border-hairline flex items-center justify-between border-b px-6 py-4">
        <h2 className="type-label text-foreground">
          {t(TRANSLATION_KEYS.about.stack.title)}
        </h2>

        {!prefersReducedMotion ? (
          <button
            type="button"
            onClick={() => setResetKey((k) => k + 1)}
            aria-label={t(TRANSLATION_KEYS.about.stack.resetAriaLabel)}
            title={t(TRANSLATION_KEYS.about.stack.resetAriaLabel)}
            className="focus-ring border-border-hairline bg-surface-2 text-text-secondary hover:border-border-subtle hover:bg-surface-3 hover:text-foreground inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-200"
          >
            <RotateCcw
              className="h-3.5 w-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      {prefersReducedMotion ? (
        <div className="flex flex-wrap gap-2.5 p-6">
          {CHIPS.map((chip) => (
            <ChipPill key={`static-${chip.label}`} chip={chip} />
          ))}
        </div>
      ) : (
        <div className="relative h-52 overflow-hidden sm:h-60">
          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 flex flex-wrap gap-2"
          >
            {CHIPS.map((chip) => (
              <ChipPill key={`m-${chip.label}`} chip={chip} />
            ))}
          </div>

          <div
            ref={containerRef}
            className="absolute inset-0 cursor-grab select-none"
            style={{ touchAction: "none" }}
          >
            {CHIPS.map((chip, i) => (
              <div
                key={`${resetKey}-${chip.label}`}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                data-stack-chip
                className="pointer-events-none absolute top-0 left-0 will-change-transform"
                style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
              >
                <ChipPill chip={chip} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ChipPill({ chip }: { chip: Chip }): ReactNode {
  const iconSrc =
    chip.iconUrl ??
    (chip.iconColor
      ? `https://cdn.simpleicons.org/${chip.slug}/${chip.iconColor}`
      : `https://cdn.simpleicons.org/${chip.slug}`);

  return (
    <div
      className="type-label border-border-subtle bg-surface-2 text-foreground inline-flex h-9 items-center gap-2 border px-3.5 whitespace-nowrap"
      style={{ borderRadius: `${CHIP_RADIUS}px` }}
    >
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          width={16}
          height={16}
          className={`h-4 w-4 object-contain ${
            chip.invertInDark ? "dark:invert" : ""
          }`}
          draggable={false}
        />
      </span>
      <span>{chip.label}</span>
    </div>
  );
}
