import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { AWARDS } from "@/data/content";
import { Award } from "lucide-react";

export default function Awards() {
  return (
    <section aria-label="Awards and recognition" className="bg-obsidian py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Recognition"
          title="Quietly collected, worldwide"
          className="mb-16 md:mb-20"
        />
        <ol>
          {AWARDS.map((a, i) => (
            <FadeIn key={`${a.year}-${a.name}`} delay={i * 0.06}>
              <li className="group flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-ivory/[0.07] py-7 transition-colors duration-500 first:border-t hover:bg-ivory/[0.02] md:flex-nowrap md:py-8">
                <span className="w-16 font-display text-lg text-champagne/70">{a.year}</span>
                <span className="flex min-w-0 flex-1 items-center gap-4">
                  <Award
                    className="h-4 w-4 shrink-0 text-champagne/40 transition-colors duration-500 group-hover:text-champagne"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-display text-xl font-light text-ivory/90 transition-transform duration-500 ease-luxe group-hover:translate-x-2 md:text-2xl">
                    {a.name}
                  </span>
                </span>
                <span className="text-[12px] font-light tracking-wide text-ivory/45 md:text-right">
                  {a.detail}
                </span>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
