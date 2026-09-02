"use client";

import { useEffect, useRef } from "react";

const INVERT_SELECTOR = "h1, h2, h3, a, button, [data-cursor='invert']";
const SKIP_SELECTOR = "input, textarea, select, [contenteditable='true']";

function overInvertTarget(x: number, y: number) {
  for (const node of document.elementsFromPoint(x, y)) {
    if (!(node instanceof Element)) continue;
    if (node.closest(".invert-cursor")) continue;
    if (node.closest(SKIP_SELECTOR)) continue;
    if (node.closest(INVERT_SELECTOR)) return true;
  }
  return false;
}

export function InvertCursor() {
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const el = node.current;
    if (!el) return;

    document.documentElement.classList.add("has-invert-cursor");
    el.style.opacity = "1";

    const pos = { x: -80, y: -80, tx: -80, ty: -80, s: 0.1, large: false };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lerp = reduce ? 1 : 0.2;

    const move = (event: PointerEvent) => {
      pos.tx = event.clientX;
      pos.ty = event.clientY;
      pos.large = overInvertTarget(event.clientX, event.clientY);
    };

    let frame = 0;
    const tick = () => {
      pos.x += (pos.tx - pos.x) * lerp;
      pos.y += (pos.ty - pos.y) * lerp;
      pos.s += ((pos.large ? 1 : 0.1) - pos.s) * (reduce ? 1 : 0.18);
      el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${pos.s})`;
      el.dataset.large = pos.large ? "true" : "false";
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove("has-invert-cursor");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={node} aria-hidden className="invert-cursor" />;
}
