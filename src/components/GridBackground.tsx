"use client";

import { useEffect, useRef, useCallback } from "react";

const GRID_SPACING = 32;
const BASE_RADIUS = 3;
const MIN_RADIUS = 0.5;
const MOUSE_RADIUS = 150;
const CLEAR_PAD = 28;
const COLORS = [
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#6366f1",
];

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const colorsRef = useRef<string[]>([]);
  const rafRef = useRef<number>(0);
  const lastDrawRef = useRef<number>(0);
  const clearRectsRef = useRef<DOMRect[]>([]);

  const updateClearZones = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const elements = container.querySelectorAll("[data-grid-clear]");
    const containerRect = container.getBoundingClientRect();
    clearRectsRef.current = Array.from(elements).map((el) => {
      const r = el.getBoundingClientRect();
      return new DOMRect(
        r.left - containerRect.left,
        r.top - containerRect.top,
        r.width,
        r.height
      );
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    if (now - lastDrawRef.current < 16) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }
    lastDrawRef.current = now;

    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateClearZones();
    }

    ctx.clearRect(0, 0, w, h);

    const cols = Math.ceil(w / GRID_SPACING) + 1;
    const rows = Math.ceil(h / GRID_SPACING) + 1;
    const totalDots = cols * rows;

    if (colorsRef.current.length !== totalDots) {
      colorsRef.current = Array.from({ length: totalDots }, () =>
        COLORS[Math.floor(Math.random() * COLORS.length)]
      );
    }

    const parentRect = parent.getBoundingClientRect();
    const mx = mouseRef.current.x - parentRect.left;
    const my = mouseRef.current.y - parentRect.top;
    const rSq = MOUSE_RADIUS * MOUSE_RADIUS;
    const clears = clearRectsRef.current;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * GRID_SPACING;
        const y = row * GRID_SPACING;
        const idx = row * cols + col;

        let inClear = false;
        for (let i = 0; i < clears.length; i++) {
          const r = clears[i];
          if (
            x >= r.x - CLEAR_PAD &&
            x <= r.x + r.width + CLEAR_PAD &&
            y >= r.y - CLEAR_PAD &&
            y <= r.y + r.height + CLEAR_PAD
          ) {
            inClear = true;
            break;
          }
        }
        if (inClear) continue;

        const dx = x - mx;
        const dy = y - my;
        const distSq = dx * dx + dy * dy;

        let radius = BASE_RADIUS;
        let alpha = 0.3;

        if (distSq < rSq) {
          const t = Math.sqrt(distSq) / MOUSE_RADIUS;
          radius = MIN_RADIUS + (BASE_RADIUS - MIN_RADIUS) * t;
          alpha = 0.15 + 0.15 * t;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colorsRef.current[idx];
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    rafRef.current = requestAnimationFrame(draw);
  }, [updateClearZones]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    updateClearZones();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, updateClearZones]);

  useEffect(() => {
    const onResize = () => {
      colorsRef.current = [];
      updateClearZones();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateClearZones]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
