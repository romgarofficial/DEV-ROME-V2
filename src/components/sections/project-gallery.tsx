"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MediaReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const next = useCallback(() => setLightbox((i) => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <>
      <div className="mt-12">
        <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Gallery</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, idx) => (
            <MediaReveal key={url}>
              <button
                type="button"
                onClick={() => setLightbox(idx)}
                data-cursor="invert"
                className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-border transition-all hover:ring-foreground/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${title} screenshot ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
            </MediaReveal>
          ))}
        </div>
      </div>

      {lightbox !== null ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90" onClick={close}>
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightbox]}
            alt={`${title} screenshot ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/60">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
