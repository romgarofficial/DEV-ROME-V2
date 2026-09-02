"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
};

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparks: Spark[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 36 : 70;
      sparks = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.1 - Math.random() * 0.28,
        r: 1.6 + Math.random() * 3.4,
        alpha: 0.28 + Math.random() * 0.42,
      }));
    }

    function rgb() {
      return getComputedStyle(document.documentElement).getPropertyValue("--particle").trim() || "243 238 230";
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      const color = rgb();
      for (let i = 0; i < sparks.length; i += 1) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        if (spark.y < -16) spark.y = height + 16;
        if (spark.x < -16) spark.x = width + 16;
        if (spark.x > width + 16) spark.x = -16;

        ctx!.beginPath();
        ctx!.fillStyle = `rgb(${color} / ${spark.alpha})`;
        ctx!.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
        ctx!.fill();

        for (let j = i + 1; j < sparks.length; j += 1) {
          const other = sparks[j];
          const dx = spark.x - other.x;
          const dy = spark.y - other.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            ctx!.strokeStyle = `rgb(${color} / ${0.16 * (1 - dist / 140)})`;
            ctx!.lineWidth = 1.25;
            ctx!.beginPath();
            ctx!.moveTo(spark.x, spark.y);
            ctx!.lineTo(other.x, other.y);
            ctx!.stroke();
          }
        }
      }
      frame = requestAnimationFrame(tick);
    }

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />;
}
