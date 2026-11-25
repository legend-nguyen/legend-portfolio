"use client";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type TabsContextValue = {
  baseId: string;
  activeValue: string;
  setActiveValue: (next: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs compound components must be rendered inside <Tabs>.");
  }
  return ctx;
}

export type TabsProps = ComponentPropsWithoutRef<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...rest
}: TabsProps): ReactNode {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : uncontrolledValue;

  const setActiveValue = useCallback(
    (next: string): void => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const contextValue = useMemo<TabsContextValue>(
    () => ({ baseId, activeValue, setActiveValue }),
    [baseId, activeValue, setActiveValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col", className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = ComponentPropsWithoutRef<"div">;

export function TabsList({
  className,
  children,
  onKeyDown,
  ...rest
}: TabsListProps): ReactNode {
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const list = listRef.current;
      if (!list) return;

      const triggers = Array.from(
        list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      if (triggers.length === 0) return;

      const currentIndex = triggers.indexOf(
        document.activeElement as HTMLButtonElement
      );
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % triggers.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = triggers.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        const nextTrigger = triggers[nextIndex];
        nextTrigger?.focus();
        nextTrigger?.click();
      }
    },
    [onKeyDown]
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "border-border-hairline bg-surface-1 inline-flex w-fit items-center gap-1 rounded-full border p-1",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type TabsTriggerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "value"
> & {
  value: string;
};

export function TabsTrigger({
  value,
  className,
  children,
  onClick,
  ...rest
}: TabsTriggerProps): ReactNode {
  const { baseId, activeValue, setActiveValue } = useTabsContext();
  const prefersReducedMotion = useReducedMotion();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? "active" : "inactive"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setActiveValue(value);
        }
      }}
      className={cn(
        "focus-ring type-label relative inline-flex h-8 cursor-pointer items-center justify-center rounded-full px-3.5 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-45",
        isActive
          ? "text-foreground"
          : "text-text-secondary hover:text-foreground",
        className
      )}
      {...rest}
    >
      {isActive ? (
        <motion.span
          layoutId={`${baseId}-active-pill`}
          aria-hidden="true"
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : { type: "spring", stiffness: 420, damping: 34 }
          }
          className="border-border-subtle bg-surface-2 dark:bg-surface-3 absolute inset-0 rounded-full border"
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap">
        {children}
      </span>
    </button>
  );
}

export type TabsContentProps = ComponentPropsWithoutRef<"div"> & {
  value: string;
};

export function TabsContent({
  value,
  className,
  children,
  ...rest
}: TabsContentProps): ReactNode {
  const { baseId, activeValue } = useTabsContext();
  if (activeValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn("focus-ring mt-4 outline-none", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
