"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { img, type Project } from "@/data/content";

/** Fullscreen expanding preview for a project card. */
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    document.documentElement.style.overflow = project ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[115] flex items-end justify-center bg-obsidian/80 backdrop-blur-md md:items-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} details`}
        >
          <motion.div
            layoutId={`card-${project.slug}`}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-t-2xl bg-charcoal md:grid-cols-[1.2fr_1fr] md:rounded-sm"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[540px]">
              <Image
                src={img(project.image).src}
                alt={`${project.name} — ${project.description}`}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                placeholder="blur"
                blurDataURL={img(project.image).blurDataURL}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent md:bg-gradient-to-r" />
            </div>

            <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wide2 text-champagne">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {project.location}
                </p>
                <h3 className="font-display text-4xl font-light text-ivory md:text-5xl">
                  {project.name}
                </h3>
                <p className="mt-5 text-sm font-light leading-relaxed text-ivory/60">
                  {project.description}
                </p>

                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-ivory/10 py-6">
                  {[
                    { icon: BedDouble, label: "Bedrooms", value: String(project.beds) },
                    { icon: Bath, label: "Bathrooms", value: String(project.baths) },
                    { icon: Ruler, label: "Interior", value: project.area },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <dt className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-ivory/40">
                        <Icon className="h-3.5 w-3.5 text-champagne/70" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="font-display text-xl text-ivory">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 text-[10px] uppercase tracking-wide2 text-ivory/40">
                  Guide price
                </p>
                <p className="font-display text-3xl font-light text-champagne-light">
                  {project.price}
                </p>
              </div>

              <MagneticButton
                variant="solid"
                onClick={() => {
                  onClose();
                  document.querySelector("#contact")?.scrollIntoView();
                }}
              >
                Request private viewing
              </MagneticButton>
            </div>

            <button
              onClick={onClose}
              aria-label="Close preview"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-ivory/20 bg-obsidian/50 text-ivory backdrop-blur transition-colors duration-300 hover:border-champagne hover:text-champagne"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
