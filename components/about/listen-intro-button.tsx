"use client";

import type { SpeechPlaybackStatus } from "@/hooks/use-speech-highlight";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { Pause, Volume2 } from "lucide-react";
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
  const ariaLabel = isPlaying
    ? t(TRANSLATION_KEYS.about.stopListening)
    : t(TRANSLATION_KEYS.about.listenIntro);
  const shortLabel = isPlaying
    ? t(TRANSLATION_KEYS.about.pauseShort)
    : t(TRANSLATION_KEYS.about.listenShort);

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-label={ariaLabel}
      aria-pressed={isPlaying}
      title={ariaLabel}
      data-playing={isPlaying ? "true" : "false"}
      className="focus-ring tts-listen-btn type-meta border-border-hairline bg-surface-2 text-foreground hover:border-border-subtle hover:bg-surface-3 data-[playing=true]:border-border-subtle data-[playing=true]:bg-surface-3 inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 font-medium transition-colors duration-200 disabled:cursor-wait disabled:opacity-50"
    >
      {isPlaying ? (
        <>
          <Pause className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{shortLabel}</span>
          <span
            className="tts-wave-bars inline-flex h-3 items-end gap-[2px]"
            aria-hidden="true"
          >
            <span className="tts-wave-bar tts-wave-bar--1" />
            <span className="tts-wave-bar tts-wave-bar--2" />
            <span className="tts-wave-bar tts-wave-bar--3" />
            <span className="tts-wave-bar tts-wave-bar--4" />
          </span>
        </>
      ) : (
        <>
          <Volume2
            className="text-text-secondary h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>{shortLabel}</span>
        </>
      )}
    </button>
  );
}
