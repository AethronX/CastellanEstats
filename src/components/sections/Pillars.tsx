import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { PILLARS } from "@/data/content";
import { Landmark, PenTool, Gem, ConciergeBell } from "lucide-react";

const ICONS = [Landmark, PenTool, Gem, ConciergeBell];

export default function Pillars() {
  return (
    <section aria-label="Why choose Castellan" className="relative bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Why Castellan"
          title="Beyond property, we compose legacies"
          className="mb-16 md:mb-24"
        />
        <div className="grid gap-px overflow-hidden rounded-sm border border-ivory/[0.07] bg-ivory/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <FadeIn key={p.title} delay={i * 0.1} className="bg-obsidian">
                <div className="group h-full p-9 transition-colors duration-700 hover:bg-graphite/70 md:p-10">
                  <span className="mb-8 grid h-14 w-14 place-items-center rounded-full border border-champagne/25 text-champagne transition-all duration-700 ease-luxe group-hover:border-champagne group-hover:shadow-[0_0_34px_rgba(201,169,106,0.25)]">
                    <Icon className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
                  </span>
                  <p className="mb-3 text-[10px] uppercase tracking-wide2 text-champagne/70">
                    0{i + 1}
                  </p>
                  <h3 className="mb-4 font-display text-2xl font-light text-ivory">
                    {p.title}
                  </h3>
                  <p className="text-[13px] font-light leading-relaxed text-ivory/50">
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
