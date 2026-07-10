import type { Metadata } from "next";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow-condensed/900.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { AppShell } from "../components/app-shell";
import { ProgressProvider } from "../components/progress";
import { lessons } from "../lib/course";

export const metadata: Metadata = {
  title: { default: "Living Techno", template: "%s · Living Techno" },
  description: "A self-contained course in rhythm, sound design, groove, and living electronic systems.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider>
          <AppShell lessonIndex={lessons.map(({ slug, title, part, sequence, kind }) => ({ slug, title, part, sequence, kind }))}>
            {children}
          </AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
