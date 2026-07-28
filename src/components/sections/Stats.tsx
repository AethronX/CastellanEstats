import Counter from "@/components/ui/Counter";
import FadeIn from "@/components/ui/FadeIn";
import { STATS } from "@/data/content";

export default function Stats() {
  return (
    <section aria-label="Castellan in numbers" className="border-y border-champagne/10 bg-charcoal">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-ivory/[0.06] lg:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.08}>
            <div className="flex flex-col items-center px-4 py-14 text-center md:py-20">
              <Counter
                value={s.value}
                suffix={s.suffix}
                className="font-display text-5xl font-light text-champagne md:text-6xl"
              />
              <p className="mt-3 text-[10px] font-light uppercase tracking-wide2 text-ivory/45 md:text-[11px]">
                {s.label}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
