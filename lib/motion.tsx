"use client";

import { motion, type MotionProps, type Variants } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type MotionPreference = "system" | "reduced" | "full";

const STORAGE_KEY = "portfolio-motion-preference";
const CHANGE_EVENT = "portfolio-motion-preference-change";

type NavigatorWithHardwareHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorWithHardwareHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) {
    return true;
  }
  if (
    typeof nav.hardwareConcurrency === "number" &&
    nav.hardwareConcurrency <= 2
  ) {
    return true;
  }
  return false;
}

function subscribeToSystemReducedMotion(callback: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemReducedMotionSnapshot(): boolean {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    isLowPowerDevice()
  );
}

function getSystemReducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeToStoredPreference(callback: () => void): () => void {
  const onStorage = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getStoredPreferenceSnapshot(): MotionPreference {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "reduced" || raw === "full" || raw === "system") {
      return raw;
    }
  } catch {
    // ignore storage errors
  }
  return "system";
}

function getStoredPreferenceServerSnapshot(): MotionPreference {
  return "system";
}

function writeStoredPreference(next: MotionPreference): void {
  try {
    if (next === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

type MotionContextValue = {
  reducedMotion: boolean;
  preference: MotionPreference;
  setPreference: (next: MotionPreference) => void;
  toggleReducedMotion: () => void;
};

const ReducedMotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  preference: "system",
  setPreference: () => {},
  toggleReducedMotion: () => {},
});

export function useReducedMotion(): boolean {
  return useContext(ReducedMotionContext).reducedMotion;
}

export function useMotionPreference(): MotionContextValue {
  return useContext(ReducedMotionContext);
}

export function ReducedMotionProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const systemReduced = useSyncExternalStore(
    subscribeToSystemReducedMotion,
    getSystemReducedMotionSnapshot,
    getSystemReducedMotionServerSnapshot
  );
  const preference = useSyncExternalStore(
    subscribeToStoredPreference,
    getStoredPreferenceSnapshot,
    getStoredPreferenceServerSnapshot
  );

  const reducedMotion =
    preference === "reduced"
      ? true
      : preference === "full"
        ? false
        : systemReduced;

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.dataset.reducedMotion = "true";
    } else {
      delete document.documentElement.dataset.reducedMotion;
    }
  }, [reducedMotion]);

  const setPreference = useCallback((next: MotionPreference): void => {
    writeStoredPreference(next);
  }, []);

  const toggleReducedMotion = useCallback((): void => {
    writeStoredPreference(reducedMotion ? "full" : "reduced");
  }, [reducedMotion]);

  const value = useMemo<MotionContextValue>(
    () => ({
      reducedMotion,
      preference,
      setPreference,
      toggleReducedMotion,
    }),
    [reducedMotion, preference, setPreference, toggleReducedMotion]
  );

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const defaultTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

type MotionDivProps = {
  variants?: Variants;
  children?: ReactNode;
  className?: string;
} & MotionProps;

export function MotionDiv({
  variants = fadeInUp,
  children,
  className,
  ...props
}: MotionDivProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : variants;
  const activeTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : defaultTransition;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={activeVariants}
      transition={activeTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({
  variants = fadeInUp,
  children,
  className,
  ...props
}: MotionDivProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  const activeVariants = prefersReducedMotion
    ? reducedMotionVariants
    : variants;
  const activeTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : defaultTransition;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={activeVariants}
      transition={activeTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function StaggerContainer({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & MotionProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? reducedMotionVariants : staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & MotionProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
