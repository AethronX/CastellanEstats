"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { LogoMark } from "./Logo";
import { BRAND } from "@/data/content";

/**
 * Opening title card: the monogram draws itself, a counter climbs,
 * then the veil splits open like curtains and the hero is revealed.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.documentElement.style.overflow = "hidden";

    const counter = { n: 0 };
    const num = el.querySelector<HTMLElement>("[data-counter]");
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setDone(true);
      },
    });

    tl.fromTo(
      el.querySelectorAll("[data-draw]"),
      { strokeDasharray: 160, strokeDashoffset: 160 },
      { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.2 },
    )
      .fromTo(
        el.querySelector("[data-word]"),
        { autoAlpha: 0, letterSpacing: "0.6em" },
        { autoAlpha: 1, letterSpacing: "0.32em", duration: 1.1, ease: "power3.out" },
        0.5,
      )
      .to(
        counter,
        {
          n: 100,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.n)).padStart(3, "0");
          },
        },
        0.15,
      )
      .to(el.querySelector("[data-card]"), { autoAlpha: 0, y: -30, duration: 0.7, ease: "power2.in" }, "+=0.15")
      .to(
        el.querySelector("[data-veil-l]"),
        { xPercent: -101, duration: 1.15, ease: "power4.inOut" },
        "-=0.15",
      )
      .to(
        el.querySelector("[data-veil-r]"),
        { xPercent: 101, duration: 1.15, ease: "power4.inOut" },
        "<",
      );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[130]" aria-hidden="true">
      <div data-veil-l className="absolute inset-y-0 left-0 w-1/2 bg-obsidian border-r border-champagne/10" />
      <div data-veil-r className="absolute inset-y-0 right-0 w-1/2 bg-obsidian" />
      <div data-card className="absolute inset-0 flex flex-col items-center justify-center gap-7">
        <svg viewBox="0 0 64 64" className="h-16 w-16 text-champagne">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path data-draw d="M14 46 L26 20 L32 32 L38 20 L50 46" />
            <path data-draw d="M22 46 L32 26 L42 46" opacity="0.55" />
          </g>
        </svg>
        <p data-word className="font-display text-sm uppercase tracking-luxe text-ivory/90" style={{ opacity: 0 }}>
          {BRAND.name}&nbsp;{BRAND.suffix}
        </p>
        <p className="text-[10px] tracking-[0.5em] text-champagne/70">
          <span data-counter>000</span>
        </p>
      </div>
    </div>
  );
}
