"use client";

import { useRef, useLayoutEffect, type ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** "lines" slides whole words up from a masked line; "chars" staggers letters */
  mode?: "words" | "chars";
  delay?: number;
  /** play immediately instead of on scroll into view */
  immediate?: boolean;
  stagger?: number;
};

/**
 * Masked text reveal — words or characters rise from beneath a clipping
 * line as the element scrolls into view.
 */
export default function TextReveal({
  children,
  as: Tag = "span",
  className = "",
  mode = "words",
  delay = 0,
  immediate = false,
  stagger,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".char-line > span");
    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        targets,
        { yPercent: 118, rotate: mode === "chars" ? 6 : 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.3,
          delay,
          ease: "power4.out",
          stagger: stagger ?? (mode === "chars" ? 0.022 : 0.055),
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [children, mode, delay, immediate, stagger]);

  const words = children.split(" ");

  return (
    <Tag ref={ref} className={`will-reveal ${className}`} aria-label={children}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          {mode === "chars" ? (
            word.split("").map((ch, ci) => (
              <span key={ci} className="char-line">
                <span>{ch}</span>
              </span>
            ))
          ) : (
            <span className="char-line">
              <span>{word}</span>
            </span>
          )}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
