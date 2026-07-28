"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
  { href: "#journey", label: "The Journey" },
  { href: "#story", label: "Company" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#invest", label: "Invest" },
  { href: "#contact", label: "Contact" },
];

/**
 * Stays out of sight for the opening act; slides in once the visitor
 * has scrolled past the hero, per the cinematic brief.
 */
export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -90, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[110]"
          >
            <div className="glass-panel mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full px-6 py-3 md:px-8">
              <a href="#top" aria-label="Castellan Estates — back to top" data-cursor="hover">
                <Logo compact />
              </a>
              <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="group relative text-[11px] font-medium uppercase tracking-wide2 text-ivory/70 transition-colors duration-300 hover:text-ivory"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-champagne transition-all duration-500 ease-luxe group-hover:w-full" />
                  </a>
                ))}
              </nav>
              <div className="hidden lg:block">
                <MagneticButton
                  variant="solid"
                  className="!px-7 !py-3"
                  onClick={() => document.querySelector("#contact")?.scrollIntoView()}
                >
                  Enquire
                </MagneticButton>
              </div>
              <button
                className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen(!open)}
              >
                <span
                  className={`h-px w-6 bg-ivory transition-transform duration-500 ease-luxe ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
                />
                <span
                  className={`h-px w-6 bg-ivory transition-transform duration-500 ease-luxe ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
                />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[105] flex flex-col justify-center bg-charcoal/98 px-10 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 46, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-ivory/5 py-4 font-display text-4xl font-light text-ivory/90"
                >
                  <span className="mr-4 text-xs tracking-luxe text-champagne">
                    0{i + 1}
                  </span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 text-[10px] uppercase tracking-luxe text-ivory/40"
            >
              Dubai · London · Muscat
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
