"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BedDouble, Bath, Ruler, Sparkles, Filter, Coins } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { PROJECTS, img, type Project } from "@/data/content";
import ProjectModal from "./ProjectModal";

type Currency = "OMR" | "USD" | "EUR";

function convertPrice(priceStr: string, currency: Currency): string {
  // Extracts digits from price string e.g. "From OMR 1,200,000" or similar
  if (currency === "OMR") return priceStr;
  
  const omrMatch = priceStr.match(/[\d,]+/);
  if (!omrMatch) return priceStr;
  const numericOMR = parseFloat(omrMatch[0].replace(/,/g, ""));
  if (isNaN(numericOMR)) return priceStr;

  if (currency === "USD") {
    const usdVal = Math.round(numericOMR * 2.60);
    return `From $${usdVal.toLocaleString()}`;
  }
  if (currency === "EUR") {
    const eurVal = Math.round(numericOMR * 2.39);
    return `From €${eurVal.toLocaleString()}`;
  }
  return priceStr;
}

function ProjectCard({
  project,
  index,
  currency,
  onOpen,
}: {
  project: Project;
  index: number;
  currency: Currency;
  onOpen: () => void;
}) {
  const image = img(project.image);
  const formattedPrice = useMemo(() => convertPrice(project.price, currency), [project.price, currency]);

  return (
    <FadeIn delay={(index % 3) * 0.12} className="group">
      <motion.article
        layout
        layoutId={`card-${project.slug}`}
        onClick={onOpen}
        data-cursor-label="View"
        className="luxe-shadow relative cursor-pointer overflow-hidden rounded-sm bg-graphite transition-all duration-500 hover:shadow-2xl hover:shadow-champagne/10"
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
          {/* subtle golden vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
          <div className="absolute inset-0 bg-champagne/0 mix-blend-overlay transition-colors duration-700 group-hover:bg-champagne/15" />
          
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-champagne/40 bg-obsidian/70 px-4 py-1.5 text-[9px] font-medium uppercase tracking-wide2 text-champagne backdrop-blur-md">
              {project.status}
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide2 text-champagne">
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
          <div className="mt-3 flex items-center gap-5 text-[11px] font-light text-ivory/60 opacity-0 transition-all duration-500 ease-luxe [transform:translateY(8px)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-champagne/80" aria-hidden="true" />{project.beds} beds</span>
            <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-champagne/80" aria-hidden="true" />{project.baths} baths</span>
            <span className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-champagne/80" aria-hidden="true" />{project.area}</span>
          </div>
          <p className="mt-2 text-base font-light text-champagne">{formattedPrice}</p>
        </div>
      </motion.article>
    </FadeIn>
  );
}

export default function FeaturedProjects() {
  const [open, setOpen] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [currency, setCurrency] = useState<Currency>("OMR");

  const categories = ["All", "Beachfront", "Mountain", "Marina"];

  const filteredProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    if (filter === "Beachfront") {
      return PROJECTS.filter((p) => p.name.includes("Beachfront") || p.name.includes("Ocean") || p.name.includes("Jissah") || p.name.includes("Shatti"));
    }
    if (filter === "Mountain") {
      return PROJECTS.filter((p) => p.name.includes("Mountain") || p.name.includes("Jebel") || p.name.includes("Fjord"));
    }
    if (filter === "Marina") {
      return PROJECTS.filter((p) => p.name.includes("Marina") || p.name.includes("Al Mouj"));
    }
    return PROJECTS;
  }, [filter]);

  return (
    <section id="projects" aria-label="Featured projects" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="The Oman Portfolio"
            title="Irreplaceable addresses carved into horizon"
            lead="Explore private sanctuaries across Muscat, Jebel Akhdar, Musandam, and Dhofar."
          />
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Currency selector */}
            <div className="flex items-center rounded-full border border-champagne/30 bg-graphite/80 p-1 backdrop-blur-md">
              <span className="pl-3 pr-2 text-[10px] uppercase tracking-wide2 text-champagne/70 flex items-center gap-1">
                <Coins className="h-3 w-3 text-champagne" /> Currency
              </span>
              {(["OMR", "USD", "EUR"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all duration-300 ${
                    currency === c
                      ? "bg-champagne text-obsidian shadow-sm"
                      : "text-ivory/60 hover:text-ivory"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-ivory/10 pb-6">
          <span className="mr-3 flex items-center gap-1.5 text-[11px] font-light uppercase tracking-wide2 text-ivory/40">
            <Filter className="h-3.5 w-3.5 text-champagne" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-wide2 transition-all duration-500 ${
                filter === cat
                  ? "border border-champagne bg-champagne/15 font-medium text-champagne shadow-sm"
                  : "border border-ivory/10 bg-transparent text-ivory/60 hover:border-ivory/30 hover:text-ivory"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {filteredProjects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} currency={currency} onOpen={() => setOpen(p)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

