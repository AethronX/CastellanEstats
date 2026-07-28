"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
};

/** Scroll-triggered fade + rise, with an optional blur-to-focus pass. */
export default function FadeIn({ children, delay = 0, y = 36, blur = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, filter: blur ? "blur(12px)" : "blur(0px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, blur]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
