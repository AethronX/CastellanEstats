"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Counter from "@/components/ui/Counter";
import { img } from "@/data/content";

const MARKS = [
  { value: 17, suffix: "", label: "Years composing estates" },
  { value: 3, suffix: "", label: "Continents, one standard" },
  { value: 40, suffix: "+", label: "Craft ateliers worldwide" },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const about = img("sections/about");

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-story-img]",
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-story-frame]",
        { clipPath: "inset(12% 12% 12% 12%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 20%", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="story" aria-label="About Castellan" className="relative overflow-hidden bg-obsidian py-28 md:py-44">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div>
          <SectionHeading
            eyebrow="The House of Castellan"
            title="We do not build houses. We compose places."
            lead="Since 2009, Castellan has pursued a single idea: that a residence should be authored the way a film is — every sightline framed, every material lit, every silence intentional. We acquire land no one can replicate and hold our craft to a hundred-year standard."
          />
          <FadeIn delay={0.35}>
            <div className="mt-14 grid grid-cols-3 gap-8 border-t border-champagne/15 pt-10">
              {MARKS.map((m) => (
                <div key={m.label}>
                  <Counter
                    value={m.value}
                    suffix={m.suffix}
                    className="font-display text-4xl font-light text-champagne md:text-5xl"
                  />
                  <p className="mt-2 text-[11px] font-light leading-snug tracking-wide text-ivory/50">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div data-story-frame className="luxe-shadow relative overflow-hidden rounded-sm" style={{ clipPath: "inset(12% 12% 12% 12%)" }}>
          <div data-story-img className="relative aspect-[4/5] will-change-transform">
            <Image
              src={about.src}
              alt="Architectural detail of a Castellan residence — intersecting stone planes and a floating brass stair at golden hour"
              fill
              sizes="(min-width: 768px) 45vw, 92vw"
              placeholder="blur"
              blurDataURL={about.blurDataURL}
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 border border-champagne/20" />
          <p className="absolute bottom-5 left-5 text-[10px] uppercase tracking-luxe text-ivory/70">
            The Helix Stair — Serena Courtyard
          </p>
        </div>
      </div>
    </section>
  );
}
