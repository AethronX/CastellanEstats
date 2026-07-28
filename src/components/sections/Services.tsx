"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { SERVICES, img } from "@/data/content";

const PREVIEWS = [
  "journey/04-lobby",
  "journey/01-exterior",
  "sections/skyline",
  "journey/06-living",
  "journey/15-lounge",
] as const;

export default function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" aria-label="Services" className="relative bg-charcoal py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              eyebrow="Services"
              title="One house, every discipline"
              lead="Acquisition, creation, and care — a single team accountable for the entire life of your residence."
            />
            {/* hover preview */}
            <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden rounded-sm border border-ivory/10 lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active ?? "rest"}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img(PREVIEWS[active ?? 0]).src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="35vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-obsidian/25" />
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-4 left-4 z-10 text-[10px] uppercase tracking-wide2 text-ivory/70">
                {SERVICES[active ?? 0].title}
              </p>
            </div>
          </div>

          <ul className="self-center" onMouseLeave={() => setActive(null)}>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.07}>
                <li
                  onMouseEnter={() => setActive(i)}
                  className="group border-b border-ivory/[0.07] py-8 transition-colors duration-500 first:border-t md:py-10"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="flex items-baseline gap-6 md:gap-10">
                      <span className="font-display text-sm text-champagne/60 transition-colors duration-500 group-hover:text-champagne">
                        {s.n}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-light text-ivory/85 transition-all duration-500 ease-luxe group-hover:translate-x-2 group-hover:text-ivory md:text-4xl">
                          {s.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-[13px] font-light leading-relaxed text-ivory/45 md:text-sm">
                          {s.body}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-champagne/0 transition-all duration-500 ease-luxe group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-champagne"
                      aria-hidden="true"
                    />
                  </div>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
