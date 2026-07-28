"use client";

import {
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type ButtonHTMLAttributes,
} from "react";
import { gsap } from "@/lib/gsap";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
  variant?: "outline" | "solid" | "ghost";
};

/**
 * A button that leans toward the cursor and springs back on leave.
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  variant = "outline",
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el || window.matchMedia("(pointer: coarse)").matches) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.6, ease: "power3.out" });
      gsap.to(inner.current, { x: x * 0.4, y: y * 0.4, duration: 0.6 });
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    gsap.to(inner.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  }, []);

  const styles = {
    outline:
      "border border-champagne/40 text-ivory hover:border-champagne hover:bg-champagne/[0.06]",
    solid:
      "bg-champagne text-obsidian hover:bg-champagne-light",
    ghost: "text-champagne hover:text-champagne-light",
  }[variant];

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className={`group relative overflow-hidden rounded-full px-9 py-4 text-[11px] font-medium uppercase tracking-luxe transition-colors duration-500 ${styles} ${className}`}
      {...rest}
    >
      <span ref={inner} className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </button>
  );
}
