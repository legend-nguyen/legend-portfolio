"use client";

import { useReducedMotion } from "@/lib/motion";
import type { Language } from "@/shared/i18n";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type TtsWordTimestamp = {
  text: string;
  start: number;
  end: number;
  charStart: number;
  charEnd: number;
};

export type TtsManifest = {
  lang: string;
  voice: string;
  textHash: string;
  duration: number;
  words: TtsWordTimestamp[];
};

export type SpeechPlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "error"
  | "unavailable";

export type UseSpeechHighlightOptions = {
  language: Language;
  expectedTextHash: string;
  cardRef: RefObject<HTMLElement | null>;
  textContainerRef: RefObject<HTMLElement | null>;
};

export type UseSpeechHighlightReturn = {
  status: SpeechPlaybackStatus;
  isPlaying: boolean;
  isLoading: boolean;
  isAvailable: boolean;
  words: TtsWordTimestamp[];
  togglePlay: () => void;
  stop: () => void;
};

type LoadedResourceState = {
  key: string;
  manifest: TtsManifest | null;
  playbackStatus: "idle" | "playing" | "error" | "unavailable";
};

let activeGlobalAudio: HTMLAudioElement | null = null;

function isValidManifest(data: unknown): data is TtsManifest {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.lang === "string" &&
    typeof candidate.voice === "string" &&
    typeof candidate.textHash === "string" &&
    typeof candidate.duration === "number" &&
    Array.isArray(candidate.words)
  );
}

/**
 * Binary search over sorted `words` array to find the index of the word
 * being spoken at `timeSeconds`.
 */
function findWordIndexAtTime(
  words: TtsWordTimestamp[],
  timeSeconds: number
): number {
  const firstWord = words[0];
  if (!firstWord || timeSeconds < firstWord.start) {
    return -1;
  }

  let low = 0;
  let high = words.length - 1;
  let bestIndex = -1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    const word = words[mid];
    if (!word) {
      break;
    }

    if (timeSeconds >= word.start && timeSeconds <= word.end) {
      return mid;
    }

    if (timeSeconds > word.end) {
      bestIndex = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return bestIndex;
}

export function useSpeechHighlight({
  language,
  expectedTextHash,
  cardRef,
  textContainerRef,
}: UseSpeechHighlightOptions): UseSpeechHighlightReturn {
  const resourceKey = `${language}:${expectedTextHash}`;
  const [isNearViewport, setIsNearViewport] = useState<boolean>(false);
  const [resource, setResource] = useState<LoadedResourceState | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const activeWordIndexRef = useRef<number>(-1);
  const wordElementsRef = useRef<HTMLElement[]>([]);
  const reducedMotionRef = useRef<boolean>(prefersReducedMotion);

  const currentManifest =
    resource?.key === resourceKey ? resource.manifest : null;

  const status: SpeechPlaybackStatus = !isNearViewport
    ? "idle"
    : resource?.key !== resourceKey
      ? "loading"
      : resource.playbackStatus;

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  const cacheWordElements = useCallback((): HTMLElement[] => {
    const container = textContainerRef.current;
    if (!container) {
      wordElementsRef.current = [];
      return [];
    }
    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-word-index]")
    );
    wordElementsRef.current = nodes;
    return nodes;
  }, [textContainerRef]);

  const resetDomHighlights = useCallback((): void => {
    const elements =
      wordElementsRef.current.length > 0
        ? wordElementsRef.current
        : cacheWordElements();
    for (const el of elements) {
      el.removeAttribute("data-word-state");
    }
    activeWordIndexRef.current = -1;
  }, [cacheWordElements]);

  const applyDomHighlight = useCallback(
    (nextIndex: number): void => {
      const prevIndex = activeWordIndexRef.current;
      if (nextIndex === prevIndex) {
        return;
      }

      const elements =
        wordElementsRef.current.length > 0
          ? wordElementsRef.current
          : cacheWordElements();

      if (elements.length === 0) {
        activeWordIndexRef.current = nextIndex;
        return;
      }

      if (prevIndex === -1) {
        for (let i = 0; i < elements.length; i += 1) {
          const state =
            i < nextIndex ? "past" : i === nextIndex ? "active" : "upcoming";
          elements[i]?.setAttribute("data-word-state", state);
        }
      } else if (nextIndex > prevIndex) {
        for (let i = Math.max(0, prevIndex); i < nextIndex; i += 1) {
          elements[i]?.setAttribute("data-word-state", "past");
        }
        elements[nextIndex]?.setAttribute("data-word-state", "active");
      } else {
        for (let i = Math.max(0, nextIndex + 1); i <= prevIndex; i += 1) {
          elements[i]?.setAttribute("data-word-state", "upcoming");
        }
        if (nextIndex >= 0) {
          elements[nextIndex]?.setAttribute("data-word-state", "active");
        }
      }

      activeWordIndexRef.current = nextIndex;

      if (nextIndex >= 0 && !reducedMotionRef.current) {
        const activeEl = elements[nextIndex];
        if (activeEl && typeof window !== "undefined") {
          const rect = activeEl.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const margin = 72;
          if (rect.bottom > viewportHeight - margin || rect.top < margin) {
            activeEl.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
        }
      }
    },
    [cacheWordElements]
  );

  const cancelSyncLoop = useCallback((): void => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const stop = useCallback((): void => {
    cancelSyncLoop();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        // Ignore if metadata is not yet loaded
      }
    }
    resetDomHighlights();
    setResource((prev) => {
      if (!prev || prev.key !== resourceKey) {
        return prev;
      }
      if (
        prev.playbackStatus === "unavailable" ||
        prev.playbackStatus === "error"
      ) {
        return prev;
      }
      return { ...prev, playbackStatus: "idle" };
    });
  }, [cancelSyncLoop, resetDomHighlights, resourceKey]);

  // Observe card proximity to viewport for lazy preloading
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl || isNearViewport) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const timerId = window.setTimeout(() => {
        setIsNearViewport(true);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(cardEl);
    return () => {
      observer.disconnect();
    };
  }, [cardRef, isNearViewport]);

  // Load manifest & prepare HTML5 Audio when near viewport or when language changes
  useEffect(() => {
    cancelSyncLoop();
    resetDomHighlights();
    wordElementsRef.current = [];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
      if (activeGlobalAudio === audioRef.current) {
        activeGlobalAudio = null;
      }
      audioRef.current = null;
    }

    if (!isNearViewport) {
      return;
    }

    const controller = new AbortController();
    let isDisposed = false;

    const jsonUrl = `/audio/about/intro.${language}.json`;
    const mp3Url = `/audio/about/intro.${language}.mp3`;

    fetch(jsonUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data: unknown = await response.json();
        if (!isValidManifest(data)) {
          throw new Error("Invalid TTS manifest format");
        }
        if (data.textHash !== expectedTextHash) {
          throw new Error("TTS textHash mismatch with current translation");
        }
        return data;
      })
      .then((validManifest) => {
        if (isDisposed) {
          return;
        }

        const audio = new Audio(mp3Url);
        audio.preload = "auto";
        audio.load();

        audioRef.current = audio;
        setResource({
          key: resourceKey,
          manifest: validManifest,
          playbackStatus: "idle",
        });
      })
      .catch((error: unknown) => {
        if (isDisposed) {
          return;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setResource({
          key: resourceKey,
          manifest: null,
          playbackStatus: "unavailable",
        });
      });

    return () => {
      isDisposed = true;
      controller.abort();
      cancelSyncLoop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        if (activeGlobalAudio === audioRef.current) {
          activeGlobalAudio = null;
        }
        audioRef.current = null;
      }
    };
  }, [
    language,
    expectedTextHash,
    resourceKey,
    isNearViewport,
    cancelSyncLoop,
    resetDomHighlights,
  ]);

  // Refresh cached word span elements whenever manifest words update
  useEffect(() => {
    if (!currentManifest) {
      wordElementsRef.current = [];
      return;
    }
    cacheWordElements();
  }, [currentManifest, cacheWordElements]);

  // Bind audio playback & synchronization loop
  const startSyncLoop = useCallback(
    (audio: HTMLAudioElement, words: TtsWordTimestamp[]): void => {
      cancelSyncLoop();
      cacheWordElements();

      const tick = (): void => {
        if (audio.paused || audio.ended) {
          return;
        }
        const currentIndex = findWordIndexAtTime(words, audio.currentTime);
        applyDomHighlight(currentIndex);
        rafIdRef.current = requestAnimationFrame(tick);
      };

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [applyDomHighlight, cacheWordElements, cancelSyncLoop]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentManifest) {
      return;
    }

    const handleEnded = (): void => {
      cancelSyncLoop();
      resetDomHighlights();
      setResource((prev) =>
        prev && prev.key === resourceKey
          ? { ...prev, playbackStatus: "idle" }
          : prev
      );
      if (activeGlobalAudio === audio) {
        activeGlobalAudio = null;
      }
    };

    const handlePause = (): void => {
      if (audio.ended) {
        return;
      }
      cancelSyncLoop();
      resetDomHighlights();
      setResource((prev) =>
        prev && prev.key === resourceKey
          ? { ...prev, playbackStatus: "idle" }
          : prev
      );
      if (activeGlobalAudio === audio) {
        activeGlobalAudio = null;
      }
    };

    const handleSeeking = (): void => {
      if (!audio.paused && currentManifest.words.length > 0) {
        const idx = findWordIndexAtTime(
          currentManifest.words,
          audio.currentTime
        );
        applyDomHighlight(idx);
      }
    };

    const handleError = (): void => {
      cancelSyncLoop();
      resetDomHighlights();
      setResource((prev) =>
        prev && prev.key === resourceKey
          ? { ...prev, playbackStatus: "error" }
          : prev
      );
      if (activeGlobalAudio === audio) {
        activeGlobalAudio = null;
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("seeking", handleSeeking);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("seeking", handleSeeking);
      audio.removeEventListener("error", handleError);
    };
  }, [
    currentManifest,
    resourceKey,
    applyDomHighlight,
    cancelSyncLoop,
    resetDomHighlights,
  ]);

  const togglePlay = useCallback((): void => {
    if (status === "unavailable" || status === "error") {
      return;
    }

    if (status === "playing") {
      stop();
      return;
    }

    const audio = audioRef.current;
    if (!audio || !currentManifest) {
      return;
    }

    if (activeGlobalAudio && activeGlobalAudio !== audio) {
      activeGlobalAudio.pause();
    }
    activeGlobalAudio = audio;

    resetDomHighlights();
    cacheWordElements();

    try {
      audio.currentTime = 0;
    } catch {
      // Ignore if stream hasn't buffered initial frame yet
    }

    setResource((prev) =>
      prev && prev.key === resourceKey
        ? { ...prev, playbackStatus: "playing" }
        : prev
    );

    if (currentManifest.words.length > 0) {
      applyDomHighlight(0);
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          startSyncLoop(audio, currentManifest.words);
        })
        .catch(() => {
          cancelSyncLoop();
          resetDomHighlights();
          setResource((prev) =>
            prev && prev.key === resourceKey
              ? { ...prev, playbackStatus: "error" }
              : prev
          );
        });
    } else {
      startSyncLoop(audio, currentManifest.words);
    }
  }, [
    status,
    currentManifest,
    resourceKey,
    stop,
    resetDomHighlights,
    cacheWordElements,
    applyDomHighlight,
    startSyncLoop,
    cancelSyncLoop,
  ]);

  const isAvailable =
    status !== "unavailable" &&
    status !== "error" &&
    (currentManifest !== null || status === "loading" || !isNearViewport);

  return {
    status,
    isPlaying: status === "playing",
    isLoading: status === "loading",
    isAvailable,
    words: currentManifest?.words ?? [],
    togglePlay,
    stop,
  };
}
