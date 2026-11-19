"use client";

import { ListenIntroButton } from "@/components/about/listen-intro-button";
import { FadeIn } from "@/components/ui/motion-primitives";
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
        {segment.text.slice(
          start - segment.charStart,
          end - segment.charStart
        )}
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
      <span key={segment.id} className="border-b border-foreground/30 pb-0.5">
        {content}
      </span>
    );
  }

  if (segment.kind === "strong") {
    return (
      <strong key={segment.id} className="font-semibold text-foreground">
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
    <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
      <FadeIn delay={0.5}>
        <div
          ref={cardRef}
          data-glow-block
          className="relative rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3"
        >
          <ListenIntroButton
            status={status}
            isPlaying={isPlaying}
            isAvailable={isAvailable}
            onToggle={togglePlay}
          />

          <div ref={textContainerRef}>
            {headingBlock ? (
              <h1 className="pr-14 font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:pr-20 sm:text-[1.4rem]">
                {headingBlock.segments.map((seg) => renderSegment(seg, words))}
              </h1>
            ) : null}
            <div className="mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[18px]">
              {paragraphBlocks.map((block) => (
                <p key={block.id}>
                  {block.segments.map((seg) => renderSegment(seg, words))}
                </p>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
