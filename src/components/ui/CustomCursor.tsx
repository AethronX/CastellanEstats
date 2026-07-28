"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Champagne dot + trailing ring. The ring expands over interactive
 * elements (`[data-cursor]`, links, buttons) and shows a label over
 * `[data-cursor-label]` targets. Desktop pointers only.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3.out" });
    const xLabel = gsap.quickTo(labelEl.current, "x", { duration: 0.45, ease: "power3.out" });
    const yLabel = gsap.quickTo(labelEl.current, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      if (dot.current?.parentElement) dot.current.parentElement.style.opacity = "1";
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
      xLabel(e.clientX);
      yLabel(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, [data-cursor-label]",
      );
      const withLabel = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]");
      setLabel(withLabel?.dataset.cursorLabel ?? "");
      gsap.to(ring.current, {
        scale: withLabel ? 0 : t ? 2.4 : 1,
        opacity: withLabel ? 0 : 1,
        borderColor: t ? "rgba(201,169,106,0.9)" : "rgba(201,169,106,0.45)",
        duration: 0.4,
      });
      gsap.to(labelEl.current, {
        scale: withLabel ? 1 : 0.4,
        opacity: withLabel ? 1 : 0,
        duration: 0.4,
      });
      gsap.to(dot.current, { scale: t ? 0.4 : 1, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] opacity-0 transition-opacity duration-300"
    >
      <div
        ref={ring}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-champagne/45"
      />
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-champagne" />
      <div
        ref={labelEl}
        className="absolute -ml-10 -mt-10 flex h-20 w-20 scale-50 items-center justify-center rounded-full bg-champagne text-center text-[9px] font-semibold uppercase tracking-wide2 text-obsidian opacity-0"
      >
        {label}
      </div>
    </div>
  );
}
