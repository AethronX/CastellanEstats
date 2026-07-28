"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import Counter from "@/components/ui/Counter";
import MagneticButton from "@/components/ui/MagneticButton";
import { INVESTMENT_POINTS, img } from "@/data/content";

export default function Investment() {
  const root = useRef<HTMLElement>(null);
  const skyline = img("sections/skyline");

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-sky]",
        { yPercent: -14, scale: 1.15 },
        {
          yPercent: 6,
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="invest"
      aria-label="Investment opportunities"
      className="relative overflow-hidden py-32 md:py-48"
    >
      {/* full-bleed skyline with parallax */}
      <div data-sky className="absolute inset-0 will-change-transform">
        <Image
          src={skyline.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={skyline.blurDataURL}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Investment"
          title="Assets that outperform, addresses that outlast"
          lead="Scarce land and hundred-year craft have made Castellan residences among the most resilient private assets in the region."
          className="mb-16 md:mb-24"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {INVESTMENT_POINTS.map((p, i) => (
            <FadeIn key={p.label} delay={i * 0.12}>
              <div className="glass-panel h-full rounded-sm p-10 text-center">
                <Counter
                  value={p.value}
                  prefix={p.prefix ?? ""}
                  suffix={p.suffix}
                  className="gold-gradient-text font-display text-6xl font-light md:text-7xl"
                />
                <p className="mx-auto mt-5 max-w-[26ch] text-[13px] font-light leading-relaxed text-ivory/60">
                  {p.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mt-14 text-center">
          <MagneticButton
            variant="outline"
            onClick={() => document.querySelector("#contact")?.scrollIntoView()}
          >
            Speak with our investment office
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}
