"use client";

import type { SpeechPlaybackStatus } from "@/hooks/use-speech-highlight";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";

export type ListenIntroButtonProps = {
  status: SpeechPlaybackStatus;
  isPlaying: boolean;
  isAvailable: boolean;
  onToggle: () => void;
};

export function ListenIntroButton({
  status,
  isPlaying,
  isAvailable,
  onToggle,
}: ListenIntroButtonProps): ReactNode {
  const { t } = useTranslation();

  if (!isAvailable || status === "unavailable" || status === "error") {
    return null;
  }

  const isLoading = status === "loading";
  const label = isPlaying
    ? t(TRANSLATION_KEYS.about.stopListening)
    : t(TRANSLATION_KEYS.about.listenIntro);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-label={label}
      aria-pressed={isPlaying}
      title={label}
      data-playing={isPlaying ? "true" : "false"}
      className="focus-ring tts-listen-btn group absolute top-6 right-6 z-10 inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-2 text-foreground/75 shadow-xs backdrop-blur-sm transition-all duration-200 hover:border-foreground/20 hover:bg-foreground/5 hover:text-foreground disabled:cursor-wait disabled:opacity-50 sm:top-8 sm:right-8 data-[playing=true]:border-ring/40 data-[playing=true]:bg-ring/8 data-[playing=true]:text-foreground data-[playing=true]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--ring)_12%,transparent)]"
    >
      {isPlaying ? (
        <>
          <Volume2
            className="size-4 shrink-0 text-ring transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          />
          <span
            className="tts-wave-bars inline-flex h-3.5 items-end gap-[2.5px]"
            aria-hidden="true"
          >
            <span className="tts-wave-bar tts-wave-bar--1" />
            <span className="tts-wave-bar tts-wave-bar--2" />
            <span className="tts-wave-bar tts-wave-bar--3" />
            <span className="tts-wave-bar tts-wave-bar--4" />
          </span>
        </>
      ) : (
        <VolumeX
          className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

