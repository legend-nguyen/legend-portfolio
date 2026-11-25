import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type BadgeVariant = "default" | "secondary" | "outline" | "subtle";
export type BadgeSize = "sm" | "md";

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "border-transparent bg-foreground text-background",
  secondary: "border-border-hairline bg-surface-2 text-foreground",
  outline: "border-border-hairline bg-surface-2/40 text-text-secondary",
  subtle: "border-border-hairline bg-surface-1 text-text-secondary",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "h-6 px-2.5 text-[0.75rem] leading-none",
  md: "h-7 px-3 text-[0.8125rem] leading-none",
};

/**
 * Crisp monochrome pill badge aligned with React Bits component styling.
 */
export function Badge({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...rest
}: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-200",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
