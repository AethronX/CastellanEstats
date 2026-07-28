"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Bath, Ruler } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { PROJECTS, img, type Project } from "@/data/content";
import ProjectModal from "./ProjectModal";

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const image = img(project.image);
  return (
    <FadeIn delay={(index % 3) * 0.12} className="group">
      <motion.article
        layoutId={`card-${project.slug}`}
        onClick={onOpen}
        data-cursor-label="View"
        className="luxe-shadow relative cursor-pointer overflow-hidden rounded-sm bg-graphite"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={image.src}
            alt={`${project.name}, ${project.location} — ${project.description}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.07]"
          />
          {/* hover lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
          <div className="absolute inset-0 bg-champagne/0 mix-blend-overlay transition-colors duration-700 group-hover:bg-champagne/15" />
          <span className="absolute left-4 top-4 rounded-full border border-champagne/30 bg-obsidian/55 px-4 py-1.5 text-[9px] font-medium uppercase tracking-wide2 text-champagne backdrop-blur-sm">
            {project.status}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <p className="mb-1.5 text-[10px] uppercase tracking-wide2 text-champagne/90">
            {project.location}
          </p>
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-light text-ivory md:text-3xl">
              {project.name}
            </h3>
            <span className="mb-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory transition-all duration-500 ease-luxe group-hover:border-champagne group-hover:bg-champagne group-hover:text-obsidian">
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-5 text-[11px] font-light text-ivory/55 opacity-0 transition-all duration-600 ease-luxe [transform:translateY(8px)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-champagne/70" aria-hidden="true" />{project.beds} beds</span>
            <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-champagne/70" aria-hidden="true" />{project.baths} baths</span>
            <span className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-champagne/70" aria-hidden="true" />{project.area}</span>
          </div>
          <p className="mt-2 text-sm font-light text-champagne-light">{project.price}</p>
        </div>
      </motion.article>
    </FadeIn>
  );
}

export default function FeaturedProjects() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="projects" aria-label="Featured projects" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:mb-20">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Addresses the map is redrawn around"
          />
          <FadeIn delay={0.2}>
            <p className="max-w-[220px] text-right text-[11px] font-light uppercase leading-relaxed tracking-wide2 text-ivory/40">
              Six residences currently in composition or release
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
