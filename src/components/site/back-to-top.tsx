"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const lenis = useLenis();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      data-cursor="invert"
      onClick={() => {
        if (lenis) lenis.scrollTo(0, { duration: 1.1 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={cn(
        "theme-toggle fixed right-4 bottom-24 z-50 grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-all lg:right-6 lg:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
