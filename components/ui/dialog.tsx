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

const DIALOG_EASE = [0.22, 1, 0.36, 1] as const;

type DialogContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(
      "Dialog compound components must be rendered inside <Dialog>."
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

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps): ReactNode {
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

  const value = useMemo<DialogContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [baseId, isOpen, setOpen]
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export type DialogTriggerProps = ComponentPropsWithoutRef<"button">;

export function DialogTrigger({
  onClick,
  children,
  ...rest
}: DialogTriggerProps): ReactNode {
  const { setOpen } = useDialogContext();
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

export type DialogCloseProps = ComponentPropsWithoutRef<"button">;

export function DialogClose({
  onClick,
  children,
  ...rest
}: DialogCloseProps): ReactNode {
  const { setOpen } = useDialogContext();
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

export type DialogContentProps = {
  children: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  closeLabel?: string;
};

export function DialogContent({
  children,
  className,
  hideCloseButton = false,
  closeLabel = "Close dialog",
}: DialogContentProps): ReactNode {
  const { open, setOpen, titleId, descriptionId } = useDialogContext();
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

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.2,
              ease: DIALOG_EASE,
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
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 6 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.24,
              ease: DIALOG_EASE,
            }}
            className={cn(
              "border-border-hairline bg-surface-1 text-foreground relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl outline-none",
              className
            )}
          >
            {!hideCloseButton ? (
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="focus-ring border-border-hairline bg-surface-2 text-text-secondary hover:border-border-subtle hover:text-foreground absolute top-3.5 right-3.5 z-20 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors"
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

export function DialogHeader({
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

export function DialogTitle({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"h2">): ReactNode {
  const { titleId } = useDialogContext();
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

export function DialogDescription({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"p">): ReactNode {
  const { descriptionId } = useDialogContext();
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

export function DialogBody({
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

export function DialogFooter({
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
