"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { JOURNEY_SCENES, img } from "@/data/content";

/**
 * The heart of the site: a pinned, scroll-scrubbed walkthrough of the
 * estate. Sixteen cinematic keyframes are interpolated on a <canvas>
 * with a virtual dolly (scale + drift per scene) and long crossfades,
 * so every pixel of scroll renders a unique frame — the image-sequence
 * effect without shipping hundreds of files.
 */

const SCENES = JOURNEY_SCENES.map((s) => ({ ...s, ...img(s.key) }));
const N = SCENES.length;

/** Per-scene virtual camera: gentle alternating drift. */
const CAMERA = SCENES.map((_, i) => ({
  dx: (((i * 7) % 3) - 1) * 0.018,
  dy: ((i % 2) * 2 - 1) * 0.011,
}));

const easeInOut = (t: number) => t * t * (3 - 2 * t);

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cw: number,
  ch: number,
  scale: number,
  ox: number,
  oy: number,
  alpha: number,
) {
  if (alpha <= 0.003 || !image.complete || image.naturalWidth === 0) return;
  const ir = image.naturalWidth / image.naturalHeight;
  const cr = cw / ch;
  let dw: number, dh: number;
  if (ir > cr) {
    dh = ch * scale;
    dw = dh * ir;
  } else {
    dw = cw * scale;
    dh = dw / ir;
  }
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, (cw - dw) / 2 + ox * cw, (ch - dh) / 2 + oy * ch, dw, dh);
  ctx.globalAlpha = 1;
}

export default function CinematicJourney() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const el = root.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const ctx2d = canvas.getContext("2d", { alpha: false });
    if (!ctx2d) return;

    // Progressive preload: first scenes immediately, the rest queued.
    const images: HTMLImageElement[] = SCENES.map((s, i) => {
      const im = new window.Image();
      im.decoding = "async";
      if (i < 3) im.src = s.src;
      return im;
    });
    let queued = 3;
    const loadNext = () => {
      if (queued < N) {
        const i = queued++;
        images[i].src = SCENES[i].src;
        images[i].onload = loadNext;
        images[i].onerror = loadNext;
      }
    };
    images.slice(0, 3).forEach((im) => {
      im.onload = loadNext;
    });
    // Kick the queue even if early frames were cached before onload bound.
    loadNext();

    let cw = 0;
    let ch = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      cw = el.clientWidth;
      ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(lastProgress);
    };

    let lastProgress = 0;
    let activeCaption = -1;

    const render = (progress: number) => {
      lastProgress = progress;
      const p = progress * (N - 1);
      const i = Math.min(Math.floor(p), N - 2);
      const t = p - i;

      ctx2d.fillStyle = "#f6f1e6";
      ctx2d.fillRect(0, 0, cw, ch);

      const et = easeInOut(t);
      const cam = CAMERA[i];
      const nextCam = CAMERA[i + 1];

      // current shot: dolly forward
      const s0 = 1.04 + 0.17 * et;
      // long crossfade in the last third of each shot
      const fade = t < 0.66 ? 0 : easeInOut((t - 0.66) / 0.34);

      drawCover(ctx2d, images[i], cw, ch, s0, cam.dx * et, cam.dy * et, 1);
      if (fade > 0) {
        // incoming shot settles from a slightly wider float
        const s1 = 1.16 - 0.12 * fade;
        drawCover(
          ctx2d,
          images[i + 1],
          cw,
          ch,
          s1,
          -nextCam.dx * (1 - fade) * 0.6,
          -nextCam.dy * (1 - fade) * 0.6,
          fade,
        );
      }

      // captions: fade in mid-shot, out before the cut
      const capIndex = fade > 0.5 ? i + 1 : i;
      const capT = fade > 0.5 ? 0 : t;
      if (capIndex !== activeCaption) {
        captionRefs.current.forEach((c, ci) => {
          if (!c) return;
          gsap.to(c, {
            autoAlpha: ci === capIndex ? 1 : 0,
            y: ci === capIndex ? 0 : 26,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
          });
        });
        activeCaption = capIndex;
        if (counterRef.current)
          counterRef.current.textContent = String(capIndex + 1).padStart(2, "0");
      }
      void capT;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => render(self.progress),
    });

    resize();
    window.addEventListener("resize", resize);
    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Reduced-motion fallback: an editorial list of stills. */
  if (reduced) {
    return (
      <section id="journey" aria-label="A walk through the estate" className="bg-obsidian py-24">
        <div className="mx-auto grid max-w-5xl gap-16 px-6">
          {SCENES.filter((_, i) => i % 3 === 0).map((s) => (
            <figure key={s.key}>
              <Image
                src={s.src}
                alt={`${s.title} — ${s.caption}`}
                width={s.width}
                height={s.height}
                placeholder="blur"
                blurDataURL={s.blurDataURL}
                className="w-full rounded-sm"
              />
              <figcaption className="mt-4 text-sm text-ivory/60">
                <span className="font-display text-lg text-ivory">{s.title}</span> — {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="journey" aria-label="A cinematic walk through the estate">
      {/* Tall scroll runway; the viewport pins via sticky. */}
      <div ref={root} style={{ height: `${N * 58}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

          {/* cinematic matte */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[7vh] bg-gradient-to-b from-obsidian to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-gradient-to-t from-obsidian to-transparent" />
          <div className="pointer-events-none absolute inset-0 vignette-overlay" />

          {/* captions */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[12vh] flex flex-col items-center text-center">
            <div className="relative h-28 w-full">
              {SCENES.map((s, i) => (
                <div
                  key={s.key}
                  ref={(node) => {
                    captionRefs.current[i] = node;
                  }}
                  className="absolute inset-x-0 opacity-0"
                  style={{ transform: "translateY(26px)" }}
                >
                  <p className="mb-3 text-[10px] uppercase tracking-luxe text-champagne">
                    Chapter {s.chapter}
                  </p>
                  <h3 className="font-display text-3xl font-light text-ivory md:text-5xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-xs font-light tracking-wide text-ivory/55 md:text-sm">
                    {s.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* progress rail */}
          <div className="absolute bottom-[5vh] left-1/2 flex w-64 max-w-[70vw] -translate-x-1/2 items-center gap-4 text-[10px] tracking-luxe text-ivory/50">
            <span ref={counterRef} className="text-champagne">01</span>
            <div className="h-px flex-1 overflow-hidden bg-ivory/15">
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-champagne"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span>{String(N).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
