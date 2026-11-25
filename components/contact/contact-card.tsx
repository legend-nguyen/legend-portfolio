"use client";

import { FadeIn } from "@/components/ui/motion-primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useTranslation } from "@/lib/i18n";
import { TRANSLATION_KEYS } from "@/shared/i18n";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { ContactCardCtas } from "./contact-card-ctas";

const EMAIL = "thoainguyen.240899@gmail.com";

export function ContactCard(): ReactNode {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto mt-10 w-full max-w-275 px-6 sm:mt-16 sm:px-10">
      <FadeIn duration={0.5}>
        <SpotlightCard
          radius={380}
          className="relative overflow-hidden p-6 sm:p-10"
        >
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <h2 className="text-foreground type-title">
                  {t(TRANSLATION_KEYS.contactCard.title)}
                </h2>
                <p className="text-text-secondary type-lead max-w-[42ch]">
                  {t(TRANSLATION_KEYS.contactCard.description)}
                </p>
              </div>

              <ContactCardCtas />
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <SocialIcon
                  href={`mailto:${EMAIL}`}
                  label={t(TRANSLATION_KEYS.contactCard.social.email)}
                  lucideIcon={Mail}
                />
                <SocialIcon
                  href="https://www.linkedin.com/in/nguyen-thoai-745390442/"
                  label={t(TRANSLATION_KEYS.contactCard.social.linkedin)}
                  imageSrc="/linkedin.svg"
                />
                <SocialIcon
                  href="zalo://qr/p/0983370065"
                  label={t(TRANSLATION_KEYS.contactCard.social.zalo)}
                  imageSrc="/zalo.svg"
                />
                <SocialIcon
                  href="https://www.facebook.com/legend.0824"
                  label={t(TRANSLATION_KEYS.contactCard.social.facebook)}
                  imageSrc="/facebook.svg"
                />
                <SocialIcon
                  href="https://www.tiktok.com/@nguyenthoai99"
                  label={t(TRANSLATION_KEYS.contactCard.social.tiktok)}
                  imageSrc="/tiktok.svg"
                />
              </div>

              <p className="type-meta text-text-muted">{EMAIL}</p>
            </div>
          </div>
        </SpotlightCard>

        <div className="type-meta text-text-muted flex flex-col items-start justify-between gap-1.5 px-1 pt-6 sm:flex-row sm:items-center">
          <p>{t(TRANSLATION_KEYS.contactCard.copyright)}</p>
          <p>{t(TRANSLATION_KEYS.contactCard.credit)}</p>
        </div>
      </FadeIn>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  lucideIcon: LucideIcon,
  imageSrc,
}: {
  href: string;
  label: string;
  lucideIcon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  imageSrc?: string;
}): ReactNode {
  const isExternal = href.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      aria-label={label}
      className="focus-ring group border-border-hairline bg-surface-2 text-text-secondary hover:border-border-subtle hover:bg-surface-3 hover:text-foreground inline-flex h-10 w-10 items-center justify-center rounded-full border transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.96]"
      {...linkProps}
    >
      {LucideIcon ? (
        <LucideIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className="max-h-[14px] max-w-[14px] object-contain opacity-75 transition-opacity group-hover:opacity-100 dark:invert"
        />
      ) : null}
    </Link>
  );
}
