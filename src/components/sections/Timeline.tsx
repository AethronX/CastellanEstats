"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { TIMELINE } from "@/data/content";

export default function Timeline() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-spine-wrap]",
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="Our history" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="The Timeline"
          title="Seventeen years, five chapters"
          className="mb-20 md:mb-28"
        />

        <div data-spine-wrap className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-ivory/10 md:left-1/2" />
          <div data-spine className="absolute left-5 top-0 h-full w-px bg-champagne md:left-1/2" />

          <ol className="space-y-16 md:space-y-24">
            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0;
              return (
                <li key={t.year} className="relative md:grid md:grid-cols-2 md:gap-20">
                  <span
                    className="absolute left-5 top-1.5 z-10 -ml-[5px] h-[11px] w-[11px] rounded-full border border-champagne bg-obsidian md:left-1/2"
                    aria-hidden="true"
                  />
                  <div
                    className={`pl-14 md:pl-0 ${
                      left ? "md:pr-14 md:text-right" : "md:col-start-2 md:pl-14"
                    }`}
                  >
                    <FadeIn delay={0.08}>
                      <p className="gold-gradient-text font-display text-5xl font-light md:text-6xl">
                        {t.year}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-light text-ivory">
                        {t.title}
                      </h3>
                      <p
                        className={`mt-3 max-w-md text-[13px] font-light leading-relaxed text-ivory/50 md:text-sm ${left ? "md:ml-auto" : ""}`}
                      >
                        {t.body}
                      </p>
                    </FadeIn>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
