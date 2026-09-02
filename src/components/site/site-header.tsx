"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/site/brand-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader({ href = "/" }: { href?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const y = lenis?.scroll ?? window.scrollY;
      const next = y > 12;
      setScrolled((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    lenis?.on("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, [lenis]);

  return (
    <header
      className={cn(
        "site-header pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8",
        scrolled && "is-scrolled",
      )}
    >
      <BrandMark href={href} className="pointer-events-auto" />
      <ThemeToggle className="pointer-events-auto" />
    </header>
  );
}
