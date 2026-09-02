import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Manrope, Syne } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@/components/site/analytics";
import { InvertCursor } from "@/components/site/invert-cursor";
import { ThemeProvider } from "@/components/site/theme-provider";
import { THEME_BOOTSTRAP } from "@/lib/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Romenick Garcia — Software Engineer",
    template: "%s · ROME",
  },
  description:
    "Professional developer portfolio with a custom admin for education, certificates, projects, and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="rome-theme" strategy="beforeInteractive">
          {THEME_BOOTSTRAP}
        </Script>
        <ThemeProvider>
          <div className="app-root">
            {children}
            <Analytics />
          </div>
          <InvertCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
