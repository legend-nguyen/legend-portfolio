"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const SHEET_EASE = [0.22, 1, 0.36, 1] as const;

export type SheetSide = "right" | "left" | "bottom";

type SheetContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext(): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error(
      "Sheet compound components must be rendered inside <Sheet>."
    );
  }
  return ctx;
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Sheet({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps): ReactNode {
  const baseId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const value = useMemo<SheetContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [baseId, isOpen, setOpen]
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

export type SheetTriggerProps = ComponentPropsWithoutRef<"button">;

export function SheetTrigger({
  onClick,
  children,
  ...rest
}: SheetTriggerProps): ReactNode {
  const { setOpen } = useSheetContext();
  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(true);
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export type SheetCloseProps = ComponentPropsWithoutRef<"button">;

export function SheetClose({
  onClick,
  children,
  ...rest
}: SheetCloseProps): ReactNode {
  const { setOpen } = useSheetContext();
  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

const SIDE_LAYOUT: Record<
  SheetSide,
  {
    wrapper: string;
    panel: string;
    hidden: { x?: string; y?: string };
    visible: { x?: number; y?: number };
  }
> = {
  right: {
    wrapper: "justify-end items-stretch",
    panel: "h-full w-full max-w-xl border-l",
    hidden: { x: "100%" },
    visible: { x: 0 },
  },
  left: {
    wrapper: "justify-start items-stretch",
    panel: "h-full w-full max-w-xl border-r",
    hidden: { x: "-100%" },
    visible: { x: 0 },
  },
  bottom: {
    wrapper: "justify-center items-end",
    panel: "max-h-[88vh] w-full max-w-3xl rounded-t-2xl border-t border-x",
    hidden: { y: "100%" },
    visible: { y: 0 },
  },
};

export type SheetContentProps = {
  children: ReactNode;
  side?: SheetSide;
  className?: string;
  hideCloseButton?: boolean;
  closeLabel?: string;
};

export function SheetContent({
  children,
  side = "right",
  className,
  hideCloseButton = false,
  closeLabel = "Close panel",
}: SheetContentProps): ReactNode {
  const { open, setOpen, titleId, descriptionId } = useSheetContext();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const focusTimer = requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open, setOpen]);

  if (!isClient) {
    return null;
  }

  const sideConfig = SIDE_LAYOUT[side];

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={cn("fixed inset-0 z-[100] flex", sideConfig.wrapper)}>
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.22,
              ease: SHEET_EASE,
            }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            initial={prefersReducedMotion ? { opacity: 0 } : sideConfig.hidden}
            animate={prefersReducedMotion ? { opacity: 1 } : sideConfig.visible}
            exit={prefersReducedMotion ? { opacity: 0 } : sideConfig.hidden}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.3,
              ease: SHEET_EASE,
            }}
            className={cn(
              "border-border-hairline bg-surface-1 text-foreground relative z-10 flex flex-col overflow-hidden shadow-2xl outline-none",
              sideConfig.panel,
              className
            )}
          >
            {!hideCloseButton ? (
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="focus-ring border-border-hairline bg-surface-2 text-text-secondary hover:border-border-subtle hover:text-foreground absolute top-4 right-4 z-20 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}

            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function SheetHeader({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">): ReactNode {
  return (
    <div
      className={cn(
        "border-border-hairline flex flex-col gap-1.5 border-b px-6 py-5 pr-14",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SheetTitle({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"h2">): ReactNode {
  const { titleId } = useSheetContext();
  return (
    <h2
      id={titleId}
      className={cn("text-foreground type-subtitle", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function SheetDescription({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"p">): ReactNode {
  const { descriptionId } = useSheetContext();
  return (
    <p
      id={descriptionId}
      className={cn("text-text-secondary type-body", className)}
      {...rest}
    >
      {children}
    </p>
  );
}

export function SheetBody({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">): ReactNode {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-6 py-5", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SheetFooter({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">): ReactNode {
  return (
    <div
      className={cn(
        "border-border-hairline flex flex-wrap items-center justify-end gap-2.5 border-t px-6 py-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
