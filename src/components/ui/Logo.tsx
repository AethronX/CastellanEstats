import { BRAND } from "@/data/content";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 46 L26 20 L32 32 L38 20 L50 46" />
        <path d="M22 46 L32 26 L42 46" opacity="0.55" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3 text-champagne">
      <LogoMark className={compact ? "h-7 w-7" : "h-9 w-9"} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display tracking-luxe uppercase text-ivory ${compact ? "text-sm" : "text-base"}`}
        >
          {BRAND.name}
        </span>
        <span className="mt-1 text-[9px] tracking-[0.42em] uppercase text-champagne/80">
          {BRAND.suffix}
        </span>
      </span>
    </span>
  );
}
