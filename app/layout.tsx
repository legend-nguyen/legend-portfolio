import { ChatWidget } from "@/components/chat/chat-widget";
import { GlowCursorBackdrop } from "@/components/layout/glow-cursor-backdrop";
import { Nav } from "@/components/layout/nav";
import { PageBackdrop } from "@/components/layout/page-backdrop";
import { Providers } from "@/components/layout/providers";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { baseMetadata } from "@/lib/metadata";
import { DEFAULT_LANGUAGE } from "@/shared/i18n";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Mona_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code-mono",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      className={`${monaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased">
        <Providers>
          <SkipToContent />
          <PageBackdrop />
          <GlowCursorBackdrop />
          <Nav />
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
