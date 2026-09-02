"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const ScrollDirContext = createContext<"up" | "down">("down");

export function ScrollDirProvider({ children }: { children: ReactNode }) {
  const [dir, setDir] = useState<"up" | "down">("down");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setDir(y > last ? "down" : "up");
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <ScrollDirContext.Provider value={dir}>{children}</ScrollDirContext.Provider>;
}

function useScrollDir() {
  return useContext(ScrollDirContext);
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "blur",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "scale" | "blur";
}) {
  const dir = useScrollDir();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);

  const hidden = useMemo(() => {
    if (variant === "left") return { opacity: 0, x: -28, filter: "blur(16px)" };
    if (variant === "right") return { opacity: 0, x: 28, filter: "blur(16px)" };
    if (variant === "scale") return { opacity: 0, scale: 0.94, filter: "blur(14px)" };
    return {
      opacity: 0,
      y: dir === "down" ? 48 : -36,
      scale: 0.96,
      filter: "blur(18px)",
    };
  }, [dir, variant]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" } : hidden}
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.22, margin: "-8% 0px -8% 0px" }}
      transition={{
        duration: inView ? 0.85 : 0.45,
        delay: inView ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function MediaReveal({ children, className }: { children: ReactNode; className?: string }) {
  const dir = useScrollDir();
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);

  if (reduce) return <div className={className}>{children}</div>;

  const closed = {
    clipPath: dir === "down" ? "inset(16% 10% 4% 10%)" : "inset(4% 10% 16% 10%)",
    opacity: 0.35,
    filter: "blur(12px)",
  };

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={closed}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, filter: "blur(0px)" } : closed}
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.28, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: inView ? 1 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={inView ? { scale: 1 } : { scale: 1.08 }}
        transition={{ duration: inView ? 1.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function SectionBand({
  id,
  index,
  kicker,
  title,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  align?: "start" | "end";
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:pr-28">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-muted uppercase">
            {index} — {kicker}
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-3xl leading-[0.95] sm:text-4xl md:text-6xl">{title}</h2>
        </Reveal>
        <div className="mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
