"use client";

import { ListenIntroButton } from "@/components/about/listen-intro-button";
import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  useSpeechHighlight,
  type TtsWordTimestamp,
} from "@/hooks/use-speech-highlight";
import { useTranslation } from "@/lib/i18n";
import {
  buildAboutIntroFromTranslator,
  type IntroSegment,
} from "@/shared/i18n";
import { Fragment, useMemo, useRef, type ReactNode } from "react";

function renderSegmentContent(
  segment: IntroSegment,
  words: TtsWordTimestamp[]
): ReactNode {
  if (words.length === 0) {
    return segment.text;
  }

  const parts: ReactNode[] = [];
  let cursor = segment.charStart;

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (!word) {
      continue;
    }
    if (word.charEnd <= segment.charStart) {
      continue;
    }
    if (word.charStart >= segment.charEnd) {
      break;
    }

    const start = Math.max(segment.charStart, word.charStart);
    const end = Math.min(segment.charEnd, word.charEnd);

    if (start > cursor) {
      parts.push(
        segment.text.slice(
          cursor - segment.charStart,
          start - segment.charStart
        )
      );
    }

    parts.push(
      <span key={`w-${i}`} data-word-index={i} className="tts-word">
        {segment.text.slice(start - segment.charStart, end - segment.charStart)}
      </span>
    );

    cursor = end;
  }

  if (cursor < segment.charEnd) {
    parts.push(segment.text.slice(cursor - segment.charStart));
  }

  return parts.length === 1 ? parts[0] : parts;
}

function renderSegment(
  segment: IntroSegment,
  words: TtsWordTimestamp[]
): ReactNode {
  const content = renderSegmentContent(segment, words);

  if (segment.kind === "underline") {
    return (
      <span key={segment.id} className="border-foreground/30 border-b pb-0.5">
        {content}
      </span>
    );
  }

  if (segment.kind === "strong") {
    return (
      <strong key={segment.id} className="text-foreground font-medium">
        {content}
      </strong>
    );
  }

  return <Fragment key={segment.id}>{content}</Fragment>;
}

export function AboutIntro(): ReactNode {
  const { language, t } = useTranslation();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  const introDoc = useMemo(() => buildAboutIntroFromTranslator(t), [t]);

  const { status, isPlaying, isAvailable, words, togglePlay } =
    useSpeechHighlight({
      language,
      expectedTextHash: introDoc.textHash,
      cardRef,
      textContainerRef,
    });

  const headingBlock = introDoc.blocks[0];
  const paragraphBlocks = introDoc.blocks.slice(1);

  return (
    <FadeIn delay={0.08} duration={0.55} className="h-full">
      <div ref={cardRef} className="h-full">
        <SpotlightCard as="article" radius={360} className="h-full p-6 sm:p-7">
          <div ref={textContainerRef} className="flex h-full flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {headingBlock ? (
                <h2 className="text-foreground type-subtitle">
                  {headingBlock.segments.map((seg) =>
                    renderSegment(seg, words)
                  )}
                </h2>
              ) : null}

              <ListenIntroButton
                status={status}
                isPlaying={isPlaying}
                isAvailable={isAvailable}
                onToggle={togglePlay}
              />
            </div>

            <div className="text-text-secondary type-body space-y-4 leading-[1.68]">
              {paragraphBlocks.map((block) => (
                <p key={block.id}>
                  {block.segments.map((seg) => renderSegment(seg, words))}
                </p>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </FadeIn>
  );
}
