"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MediaReveal } from "@/lib/motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function GalleryLightbox({
  images,
  title,
  index,
  onClose,
}: {
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(index);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrent(index);
  }, [index]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[500]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease }}
    >
      <button
        type="button"
        aria-label="Close gallery"
        className="absolute inset-0 bg-black/92"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))] z-[510] inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_8px_30px_rgb(0_0_0_/_0.45)]"
        aria-label="Close gallery"
      >
        <X className="h-4 w-4" />
        Close
      </button>

      <p className="pointer-events-none absolute top-[max(1.25rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-[510] text-sm text-white/80">
        {current + 1} / {images.length}
      </p>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16 pt-24 pb-10 sm:px-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={images[current]}
            src={images[current]}
            alt={`${title} screenshot ${current + 1}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 56, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -56, scale: 0.98 }}
            transition={{ duration: 0.32, ease }}
            className="pointer-events-auto max-h-full max-w-full rounded-xl object-contain"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute top-1/2 left-3 z-[510] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_8px_30px_rgb(0_0_0_/_0.45)] sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute top-1/2 right-3 z-[510] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_8px_30px_rgb(0_0_0_/_0.45)] sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </motion.div>,
    document.body,
  );
}

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [directionSeed, setDirectionSeed] = useState(0);

  return (
    <>
      <div className="mt-12">
        <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Gallery</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, idx) => (
            <MediaReveal key={url}>
              <button
                type="button"
                onClick={() => {
                  setDirectionSeed(0);
                  setLightbox(idx);
                }}
                data-cursor="invert"
                className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black/80 ring-1 ring-border transition-all hover:ring-foreground/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${title} screenshot ${idx + 1}`}
                  className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </button>
            </MediaReveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null ? (
          <GalleryLightbox
            key={`lb-${directionSeed}-${lightbox}`}
            images={images}
            title={title}
            index={lightbox}
            onClose={() => setLightbox(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
