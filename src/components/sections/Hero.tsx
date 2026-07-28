"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import { LogoMark } from "@/components/ui/Logo";
import { img, BRAND } from "@/data/content";

/**
 * Opening frame: only the mark, one headline, one line, and an
 * invitation to scroll. The image breathes slowly; on scroll it
 * recedes into depth while the titles dissolve.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const hero = img("hero");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // perpetual slow breathe
      gsap.fromTo(
        "[data-hero-img]",
        { scale: 1.06 },
        { scale: 1.12, duration: 26, yoyo: true, repeat: -1, ease: "sine.inOut" },
      );
      // depth recession on scroll
      gsap.to("[data-hero-img]", {
        yPercent: 16,
        filter: "blur(6px) brightness(1.04)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -42,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "62% top", scrub: true },
      });
      // scroll cue pulse
      gsap.fromTo(
        "[data-cue-line]",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1.6, repeat: -1, ease: "power2.inOut", yoyo: false, repeatDelay: 0.3 },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      aria-label="Castellan Estates"
      className="relative flex h-[100svh] items-center justify-center overflow-hidden"
    >
      <div data-hero-img className="absolute inset-0 will-change-transform">
        <Image
          src={hero.src}
          alt="A Castellan estate at dusk — cantilevered volumes of warm glass above a still infinity pool"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={hero.blurDataURL}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian" />
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      <div data-hero-copy className="relative z-10 flex flex-col items-center px-6 text-center">
        <LogoMark className="mb-8 h-14 w-14 text-champagne md:h-16 md:w-16" />
        <p className="mb-8 text-[10px] font-medium uppercase tracking-luxe text-champagne/90">
          {BRAND.name} {BRAND.suffix}
        </p>
        <h1 className="font-display text-[13vw] font-light leading-[1.02] text-ivory md:text-8xl lg:text-[7.2rem]">
          <TextReveal mode="chars" immediate delay={2.1} stagger={0.035} className="block">
            {BRAND.heroHeadline[0]}
          </TextReveal>
          <TextReveal mode="chars" immediate delay={2.45} stagger={0.035} className="block italic text-champagne-light">
            {BRAND.heroHeadline[1]}
          </TextReveal>
        </h1>
        <TextReveal
          as="p"
          immediate
          delay={3.1}
          className="mt-9 max-w-md text-[13px] font-light leading-relaxed tracking-wide text-ivory/60 md:text-sm"
        >
          {BRAND.heroSub}
        </TextReveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4">
        <span className="text-[9px] uppercase tracking-luxe text-ivory/45">
          Scroll to enter
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-ivory/15">
          <span data-cue-line className="absolute inset-0 bg-champagne" />
        </span>
      </div>
    </section>
  );
}
