"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import MagneticButton from "@/components/ui/MagneticButton";
import { OFFICES } from "@/data/content";

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const floating = focused || filled;
  const shared = {
    id: name,
    name,
    required,
    onFocus: () => setFocused(true),
    onBlur: (e: { target: { value: string } }) => {
      setFocused(false);
      setFilled(e.target.value.length > 0);
    },
    className:
      "peer w-full border-b border-ivory/15 bg-transparent pb-3 pt-6 text-[15px] font-light text-ivory outline-none transition-colors duration-500 focus:border-champagne",
  };

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 transition-all duration-500 ease-luxe ${
          floating
            ? "top-0 text-[9px] uppercase tracking-wide2 text-champagne"
            : "top-6 text-[15px] font-light text-ivory/40"
        }`}
      >
        {label}
      </label>
      {textarea ? <textarea rows={3} suppressHydrationWarning {...shared} /> : <input type={type} suppressHydrationWarning {...shared} />}
      <span
        className={`absolute bottom-0 left-0 h-px bg-champagne transition-all duration-700 ease-luxe ${focused ? "w-full" : "w-0"}`}
        aria-hidden="true"
      />
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" aria-label="Contact us" className="relative overflow-hidden bg-charcoal py-28 md:py-44">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-champagne/[0.05] blur-[140px]"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-20 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="Begin the conversation"
            title="Your residence is already waiting"
            lead="Share a few words and your curator will reach out within one working day — entirely in confidence."
          />

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-16 flex flex-col items-start gap-5 rounded-sm border border-champagne/25 bg-champagne/[0.04] p-10"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-champagne text-champagne">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-3xl font-light text-ivory">
                  Received, in confidence.
                </h3>
                <p className="max-w-md text-sm font-light leading-relaxed text-ivory/55">
                  Thank you. A dedicated curator has been assigned to your enquiry
                  and will write to you personally within one working day.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={onSubmit}
                suppressHydrationWarning
                className="mt-16 grid gap-9"
              >
                <div className="grid gap-9 md:grid-cols-2">
                  <Field label="Full name" name="name" />
                  <Field label="Email address" name="email" type="email" />
                </div>
                <div className="grid gap-9 md:grid-cols-2">
                  <Field label="Phone (optional)" name="phone" type="tel" required={false} />
                  <div className="relative">
                    <label
                      htmlFor="interest"
                      className="pointer-events-none absolute left-0 top-0 text-[9px] uppercase tracking-wide2 text-champagne"
                    >
                      Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      suppressHydrationWarning
                      className="w-full appearance-none border-b border-ivory/15 bg-transparent pb-3 pt-6 text-[15px] font-light text-ivory outline-none transition-colors duration-500 focus:border-champagne [&>option]:bg-charcoal"
                      defaultValue="viewing"
                    >
                      <option value="viewing">A private viewing</option>
                      <option value="bespoke">A bespoke commission</option>
                      <option value="investment">Investment portfolio</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                </div>
                <Field label="A few words about what you seek" name="message" textarea />
                <div>
                  <MagneticButton variant="solid" type="submit">
                    Request private consultation
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <FadeIn delay={0.2}>
          <aside className="lg:border-l lg:border-ivory/[0.07] lg:pl-16">
            <h3 className="mb-10 text-[10px] font-semibold uppercase tracking-luxe text-champagne/80">
              Our offices
            </h3>
            <ul className="space-y-10">
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <p className="font-display text-2xl font-light text-ivory">{o.city}</p>
                  <p className="mt-1.5 text-sm font-light text-ivory/45">{o.line}</p>
                </li>
              ))}
            </ul>
            <div className="mt-14 border-t border-ivory/[0.07] pt-10">
              <p className="text-[10px] uppercase tracking-wide2 text-ivory/40">
                Private line
              </p>
              <a
                href="tel:+97140000000"
                className="mt-2 block font-display text-2xl font-light text-champagne-light transition-colors hover:text-champagne"
              >
                +971 4 000 0000
              </a>
              <p className="mt-6 text-[10px] uppercase tracking-wide2 text-ivory/40">
                Correspondence
              </p>
              <a
                href="mailto:private@castellan-estates.com"
                className="mt-2 block text-sm font-light text-ivory/70 transition-colors hover:text-ivory"
              >
                private@castellan-estates.com
              </a>
            </div>
          </aside>
        </FadeIn>
      </div>
    </section>
  );
}
