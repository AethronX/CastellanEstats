"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { TESTIMONIALS } from "@/data/content";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 8000);
    return () => clearInterval(t);
  }, [go, index]);

  const item = TESTIMONIALS[index];

  return (
    <section aria-label="What our clients say" className="relative overflow-hidden bg-charcoal py-28 md:py-40">
      <Quote
        className="pointer-events-none absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 text-champagne/[0.05]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <FadeIn>
          <p className="mb-14 flex items-center justify-center gap-4 text-[10px] font-medium uppercase tracking-luxe text-champagne">
            <span className="h-px w-10 bg-champagne/60" />
            Voices of our owners
            <span className="h-px w-10 bg-champagne/60" />
          </p>
        </FadeIn>

        <div className="relative min-h-[300px] md:min-h-[260px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: 60 * dir, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60 * dir, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-2xl font-light italic leading-snug text-ivory md:text-4xl text-balance">
                “{item.quote}”
              </p>
              <footer className="mt-10">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-champagne/40 font-display text-lg text-champagne">
                  {item.name.charAt(0)}
                </span>
                <p className="text-sm tracking-wide text-ivory/85">{item.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide2 text-ivory/40">
                  {item.role}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-12 w-12 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-500 hover:border-champagne hover:text-champagne"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex gap-2.5" role="tablist" aria-label="Testimonial selector">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1 rounded-full transition-all duration-600 ease-luxe ${
                  i === index ? "w-10 bg-champagne" : "w-4 bg-ivory/20 hover:bg-ivory/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-12 w-12 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-all duration-500 hover:border-champagne hover:text-champagne"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
