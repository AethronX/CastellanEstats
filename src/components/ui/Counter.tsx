"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
};

/** Number that counts up when scrolled into view. */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals,
  className = "",
  duration = 2.2,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const dp = decimals ?? (Number.isInteger(value) ? 0 : 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: value,
        duration,
        ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${state.n.toFixed(dp)}${suffix}`;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [value, prefix, suffix, dp, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
