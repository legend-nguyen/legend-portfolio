import { cn } from "@/lib/cn";
import type { CSSProperties, ReactNode } from "react";

export type ProjectMockupFrameProps = {
  children: ReactNode;
  /** Optional minimal address bar label (e.g. "hris.app/dashboard"). */
  title?: string;
  /** Optional aspect ratio applied to the media viewport. */
  aspectRatio?: number | string;
  /** Show the minimal matte browser chrome top bar. Defaults to true. */
  showTopBar?: boolean;
  /** Add a subtle bottom dark vignette so bright dashboards integrate smoothly on dark canvas. Defaults to true. */
  vignette?: boolean;
  className?: string;
  viewportClassName?: string;
};

/**
 * Clean, matte browser frame with 1px structural border, minimal window dots,
 * and a restrained vignette so enterprise screenshots integrate cleanly.
 */
export function ProjectMockupFrame({
  children,
  title,
  aspectRatio,
  showTopBar = true,
  vignette = true,
  className,
  viewportClassName,
}: ProjectMockupFrameProps): ReactNode {
  const viewportStyle: CSSProperties | undefined =
    aspectRatio !== undefined ? { aspectRatio } : undefined;

  return (
    <div
      data-ui="mockup-frame"
      className={cn(
        "border-border-hairline bg-surface-2 relative flex w-full flex-col overflow-hidden rounded-xl border",
        className
      )}
    >
      {showTopBar ? (
        <div className="border-border-hairline bg-surface-2 flex h-7 shrink-0 items-center justify-between border-b px-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
            <span className="bg-foreground/15 h-2 w-2 rounded-full" />
          </div>

          {title ? (
            <code className="text-text-muted max-w-[68%] truncate font-mono text-[0.75rem] leading-none tracking-tight">
              {title}
            </code>
          ) : null}

          <span className="w-8" aria-hidden="true" />
        </div>
      ) : null}

      <div
        style={viewportStyle}
        className={cn(
          "bg-surface-3/40 relative w-full overflow-hidden",
          viewportClassName
        )}
      >
        {children}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-black/[0.06] ring-inset dark:ring-white/[0.06]"
        />

        {vignette ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 dark:opacity-100"
          />
        ) : null}
      </div>
    </div>
  );
}
