"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { FAQS } from "@/data/content";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-label="Frequently asked questions" className="bg-obsidian py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading
          eyebrow="Questions"
          title="Discretion, answered"
          lead="What our clients most often ask before their first private viewing."
        />

        <div>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={f.q} delay={i * 0.05}>
                <div className="border-b border-ivory/[0.07] first:border-t">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                  >
                    <span
                      className={`font-display text-xl font-light transition-colors duration-500 md:text-2xl ${
                        isOpen ? "text-champagne-light" : "text-ivory/85 group-hover:text-ivory"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-600 ease-luxe ${
                        isOpen
                          ? "rotate-45 border-champagne text-champagne"
                          : "border-ivory/15 text-ivory/60 group-hover:border-ivory/40"
                      }`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 text-sm font-light leading-relaxed text-ivory/55">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
