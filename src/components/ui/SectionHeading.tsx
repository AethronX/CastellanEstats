import TextReveal from "./TextReveal";
import FadeIn from "./FadeIn";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <FadeIn>
        <p
          className={`mb-6 flex items-center gap-4 text-[10px] font-medium uppercase tracking-luxe text-champagne ${centered ? "justify-center" : ""}`}
        >
          <span className="inline-block h-px w-10 bg-champagne/60" aria-hidden="true" />
          {eyebrow}
          {centered && <span className="inline-block h-px w-10 bg-champagne/60" aria-hidden="true" />}
        </p>
      </FadeIn>
      <TextReveal
        as="h2"
        className="font-display text-4xl font-light leading-[1.08] text-ivory md:text-6xl text-balance"
      >
        {title}
      </TextReveal>
      {lead && (
        <FadeIn delay={0.25}>
          <p className="mt-7 max-w-xl text-[15px] font-light leading-relaxed text-ivory/55 md:text-base">
            {lead}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
