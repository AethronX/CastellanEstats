import { Logo } from "@/components/ui/Logo";
import FadeIn from "@/components/ui/FadeIn";
import { OFFICES, BRAND } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

const NAV = [
  ["The Journey", "#journey"],
  ["Projects", "#projects"],
  ["Services", "#services"],
  ["Investment", "#invest"],
  ["Contact", "#contact"],
] as const;

const SOCIAL = ["Instagram", "LinkedIn", "Pinterest"] as const;

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-champagne/15 bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 md:px-10">
        <FadeIn>
          <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-ivory/45">
                {BRAND.tagline}. Private residences composed like cinema, on
                addresses the map is redrawn around.
              </p>
            </div>
            <div>
              <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-luxe text-champagne/80">
                Explore
              </h3>
              <ul className="space-y-3">
                {NAV.map(([label, href]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-sm font-light text-ivory/60 transition-colors duration-300 hover:text-ivory"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-luxe text-champagne/80">
                Offices
              </h3>
              <ul className="space-y-4">
                {OFFICES.map((o) => (
                  <li key={o.city} className="text-sm font-light text-ivory/60">
                    <span className="block text-ivory/90">{o.city}</span>
                    {o.line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-luxe text-champagne/80">
                Follow
              </h3>
              <ul className="space-y-3">
                {SOCIAL.map((s) => (
                  <li key={s}>
                    <a
                      href="#top"
                      className="group inline-flex items-center gap-1.5 text-sm font-light text-ivory/60 transition-colors duration-300 hover:text-ivory"
                    >
                      {s}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-champagne/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ivory/5 pt-8 text-[11px] font-light tracking-wide text-ivory/35 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Castellan Estates. All rights reserved.</p>
          <p className="flex gap-8">
            <a href="#top" className="transition-colors hover:text-ivory/70">Privacy</a>
            <a href="#top" className="transition-colors hover:text-ivory/70">Terms</a>
            <a href="#top" className="transition-colors hover:text-ivory/70">Cookies</a>
          </p>
        </div>
      </div>

      {/* Oversized watermark */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[16vw] font-light leading-[0.75] text-ivory/[0.025]"
      >
        CASTELLAN
      </p>
    </footer>
  );
}
