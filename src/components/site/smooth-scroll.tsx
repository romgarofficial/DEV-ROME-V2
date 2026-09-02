"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
