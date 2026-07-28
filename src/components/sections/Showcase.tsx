"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { img } from "@/data/content";

/**
 * Interactive property showcase — a pinned horizontal promenade of
 * interior stills that glides sideways as the visitor scrolls, with
 * fullscreen preview and the estate's floor plan as the final panel.
 */

const GALLERY = [
  { key: "journey/06-living", title: "The Living Hall", detail: "Nine-metre glass wall facing the sea" },
  { key: "journey/04-lobby", title: "The Grand Lobby", detail: "Backlit marble and cascading glass" },
  { key: "journey/09-bedroom", title: "The Master Suite", detail: "A skyline at your feet" },
  { key: "journey/11-bathroom", title: "The Bath", detail: "Carved stone beneath the stars" },
  { key: "journey/12-cinema", title: "The Cinema", detail: "Eleven seats, one endless sunset" },
  { key: "journey/14-pool", title: "The Infinity Edge", detail: "Water dissolving into horizon" },
] as const;

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<(typeof GALLERY)[number] | null>(null);
  const plan = img("sections/floorplan");

  useLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - el.clientWidth;
      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  useLayoutEffect(() => {
    document.documentElement.style.overflow = zoom ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [zoom]);

  return (
    <section
      ref={root}
      id="showcase"
      aria-label="Inside the residences"
      className="relative overflow-hidden bg-charcoal"
    >
      <div className="flex h-auto flex-col justify-center py-24 md:h-screen md:py-0">
        <div className="mx-auto mb-12 w-full max-w-7xl px-6 md:px-10">
          <p className="mb-5 flex items-center gap-4 text-[10px] font-medium uppercase tracking-luxe text-champagne">
            <span className="h-px w-10 bg-champagne/60" />
            Inside the residences
          </p>
          <h2 className="font-display text-4xl font-light text-ivory md:text-6xl">
            Step through <span className="italic text-champagne-light">every room</span>
          </h2>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-6 will-change-transform md:flex-row md:gap-8 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:pr-24"
        >
          {GALLERY.map((g, i) => {
            const image = img(g.key);
            return (
              <figure
                key={g.key}
                data-cursor-label="Expand"
                onClick={() => setZoom(g)}
                className="luxe-shadow group relative w-full shrink-0 cursor-pointer overflow-hidden rounded-sm md:w-[min(62vw,880px)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={`${g.title} — ${g.detail}`}
                    fill
                    sizes="(min-width: 768px) 62vw, 92vw"
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    className="object-cover transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute bottom-0 flex w-full items-end justify-between p-6 md:p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide2 text-champagne/90">
                      {String(i + 1).padStart(2, "0")} / {String(GALLERY.length + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-light text-ivory md:text-3xl">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-xs font-light text-ivory/55">{g.detail}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}

          {/* Pavilion finale */}
          <figure className="relative w-full shrink-0 overflow-hidden rounded-sm border border-champagne/15 bg-obsidian md:w-[min(62vw,880px)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={plan.src}
                alt="Photorealistic architectural photo of the Master Pavilion — Omani white stone wings around reflecting pool at sunset"
                fill
                sizes="(min-width: 768px) 62vw, 92vw"
                placeholder="blur"
                blurDataURL={plan.blurDataURL}
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-0 w-full p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-wide2 text-champagne/90">
                {String(GALLERY.length + 1).padStart(2, "0")} / {String(GALLERY.length + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-2xl font-light text-ivory md:text-3xl">
                The Master Pavilion
              </h3>
              <p className="mt-1 text-xs font-light text-ivory/55">
                Bandar Jissah Sanctuary — sunset reflecting pool & stone wings
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] bg-obsidian/95 backdrop-blur-sm"
            onClick={() => setZoom(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${zoom.title} fullscreen view`}
          >
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-4 md:inset-14"
            >
              <Image
                src={img(zoom.key).src}
                alt={`${zoom.title} — ${zoom.detail}`}
                fill
                sizes="100vw"
                className="rounded-sm object-contain"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <h3 className="font-display text-3xl font-light text-ivory">{zoom.title}</h3>
                <p className="mt-1 text-sm font-light text-ivory/60">{zoom.detail}</p>
              </div>
            </motion.div>
            <button
              aria-label="Close fullscreen view"
              className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-champagne hover:text-champagne"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
