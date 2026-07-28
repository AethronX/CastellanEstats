/**
 * Castellan Estates — procedural cinematic art library.
 *
 * Every visual asset of the site is composed here as layered SVG:
 * dusk-sky gradients, silhouetted architecture traced with champagne
 * hairlines, warm glass, water reflections, atmosphere and film grain.
 * Scenes are deterministic (seeded PRNG) so builds are reproducible.
 */

export const GOLD = "#c9a96a";
export const GOLD_LIGHT = "#e2cb96";
export const EMBER = "#e8a05c";
export const WARM_GLASS = "#f3c98b";

/* Light ("golden morning") art direction */
export const INK = "#3d3223";
export const BRONZE = "#8a6d43";
export const STONE_LIGHT = "#f0e9da";
export const STONE_MID = "#ddd2bc";
export const STONE_SHADE = "#c3b598";
export const GLASS_COOL = "#aec4c9";
export const SAGE = "#8b8f6f";
export const OLIVE = "#6d7355";
export const SEA_DAY = "#8fb8bd";

/* ---------------------------------------------------------------- utils */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function svgDoc(w, h, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
}

export function linGrad(id, stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1 } = {}) {
  const s = stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("");
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
}

export function radGrad(id, stops, { cx = 0.5, cy = 0.5, r = 0.5 } = {}) {
  const s = stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("");
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${s}</radialGradient>`;
}

export function blurFilter(id, dev) {
  return `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${dev}"/></filter>`;
}

export function grainFilter(id, tone = "bright") {
  const rgb = tone === "dark" ? "0.32  0 0 0 0 0.27  0 0 0 0 0.2" : "0.8  0 0 0 0 0.75  0 0 0 0 0.65";
  return `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 ${rgb}  0 0 0 0.5 0"/></filter>`;
}

export function marbleFilter(id) {
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="turbulence" baseFrequency="0.004 0.012" numOctaves="4" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.82  0 0 0 0 0.75  0 0 0 0.22 0"/><feComposite operator="in" in2="SourceGraphic"/></filter>`;
}

/** Standard atmosphere pass: grain + vignette, applied last in every scene. */
export function atmosphere(w, h, grainId, { vignette = 0.72, grain = 0.055 } = {}) {
  return (
    `<rect width="${w}" height="${h}" filter="url(#${grainId})" opacity="${grain}"/>` +
    `<rect width="${w}" height="${h}" fill="url(#vig)" opacity="${vignette}"/>`
  );
}

export function vignetteDef() {
  return radGrad("vig", [
    [0, "#000", 0],
    [0.62, "#000", 0],
    [1, "#000", 0.85],
  ], { r: 0.75 });
}

export function stars(rand, w, maxY, n, maxR = 1.6) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * w;
    const y = rand() * maxY;
    const r = 0.4 + rand() * maxR;
    const o = 0.12 + rand() * 0.5 * (1 - y / maxY);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#efe6d4" opacity="${o.toFixed(2)}"/>`;
  }
  return out;
}

/** Warm dust motes / bokeh for interiors. */
export function motes(rand, w, h, n, color = WARM_GLASS) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * w;
    const y = h * 0.25 + rand() * h * 0.65;
    const r = 1 + rand() * 5;
    const o = 0.04 + rand() * 0.12;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${o.toFixed(3)}" filter="url(#soft)"/>`;
  }
  return out;
}

/** Dusk sky. mood: "ember" (golden hour) | "night" | "blue" */
export function skyDefs(mood = "ember") {
  const palettes = {
    ember: [
      [0, "#040406"],
      [0.42, "#12101c"],
      [0.62, "#2b1c26"],
      [0.78, "#5b3327"],
      [0.9, "#a05c30"],
      [1, "#d98d4b"],
    ],
    night: [
      [0, "#020204"],
      [0.5, "#0a0a14"],
      [0.78, "#141226"],
      [1, "#2c1f2a"],
    ],
    blue: [
      [0, "#04050a"],
      [0.5, "#0b1020"],
      [0.8, "#1d2438"],
      [1, "#54402f"],
    ],
  };
  return linGrad("sky", palettes[mood]);
}

export function sunGlow(cx, cy, r, intensity = 1) {
  return (
    radGrad("sun", [
      [0, "#ffe9c4", 0.95 * intensity],
      [0.25, "#f3b96e", 0.55 * intensity],
      [0.6, "#c9743a", 0.18 * intensity],
      [1, "#c9743a", 0],
    ], {}) +
    `@@<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sun)"/>`
  );
}

/** Grid of glass windows, some lit. Returns rects. */
export function glassGrid(rand, x, y, w, h, cols, rows, { lit = 0.55, pad = 0.14, warm = WARM_GLASS, dark = "#0e0d12", glow = false } = {}) {
  const cw = w / cols;
  const ch = h / rows;
  let out = "";
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const on = rand() < lit;
      const gx = x + c * cw + cw * pad * 0.5;
      const gy = y + r * ch + ch * pad * 0.5;
      const gw = cw * (1 - pad);
      const gh = ch * (1 - pad);
      if (on) {
        const o = 0.5 + rand() * 0.5;
        out += `<rect x="${gx.toFixed(1)}" y="${gy.toFixed(1)}" width="${gw.toFixed(1)}" height="${gh.toFixed(1)}" fill="${warm}" opacity="${o.toFixed(2)}"${glow ? ' filter="url(#soft)"' : ""}/>`;
      } else {
        out += `<rect x="${gx.toFixed(1)}" y="${gy.toFixed(1)}" width="${gw.toFixed(1)}" height="${gh.toFixed(1)}" fill="${dark}" opacity="0.9"/>`;
      }
    }
  }
  return out;
}

/** Champagne hairline — the signature of the art direction. */
export function hairline(x1, y1, x2, y2, opacity = 0.55, width = 2, color = GOLD) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`;
}

export function hairRect(x, y, w, h, opacity = 0.4, width = 2, color = GOLD) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}"/>`;
}

/** Soft cast shadow (light theme). */
export function shadow(cx, cy, rx, ry, opacity = 0.16) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4a3c26" opacity="${opacity}" filter="url(#soft2)"/>`;
}

/** Distant birds — small life in bright skies. */
export function birds(rand, w, yBase, n = 5) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = w * (0.15 + rand() * 0.7);
    const y = yBase * (0.4 + rand() * 0.6);
    const s = 8 + rand() * 12;
    out += `<path d="M ${x - s} ${y} Q ${x - s * 0.4} ${y - s * 0.5} ${x} ${y} Q ${x + s * 0.4} ${y - s * 0.5} ${x + s} ${y}" stroke="${INK}" stroke-width="2.4" fill="none" opacity="${(0.25 + rand() * 0.3).toFixed(2)}" stroke-linecap="round"/>`;
  }
  return out;
}

/** Mirror a group vertically about waterline y with fading mask. */
export function reflection(inner, y, h, opacity = 0.35) {
  return (
    `<g transform="translate(0 ${2 * y}) scale(1 -1)" mask="url(#refl-mask)" opacity="${opacity}" filter="url(#refl-blur)">${inner}</g>`
  );
}

export function reflectionDefs(y, h) {
  return (
    `<linearGradient id="refl-grad" x1="0" y1="${y}" x2="0" y2="${y - h}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="refl-mask"><rect x="0" y="${y - h}" width="9999" height="${h}" fill="url(#refl-grad)"/></mask>` +
    `<filter id="refl-blur"><feGaussianBlur stdDeviation="6 2"/></filter>`
  );
}

/** Slim cypress silhouette. */
export function cypress(x, baseY, h, w, fill = "#07070a") {
  const cx = x;
  return `<path d="M ${cx} ${baseY - h} C ${cx + w * 0.55} ${baseY - h * 0.72}, ${cx + w * 0.5} ${baseY - h * 0.3}, ${cx + w * 0.28} ${baseY} L ${cx - w * 0.28} ${baseY} C ${cx - w * 0.5} ${baseY - h * 0.3}, ${cx - w * 0.55} ${baseY - h * 0.72}, ${cx} ${baseY - h}" fill="${fill}"/>`;
}

/** Palm silhouette. */
export function palm(rand, x, baseY, h, fill = "#060608", flip = 1) {
  const top = baseY - h;
  let fronds = "";
  for (let i = 0; i < 7; i++) {
    const a = -160 + i * 40 + (rand() - 0.5) * 18;
    const len = h * (0.34 + rand() * 0.14);
    const rad = (a * Math.PI) / 180;
    const ex = x + Math.cos(rad) * len * flip;
    const ey = top + Math.sin(rad) * len * 0.62;
    const mx = x + Math.cos(rad) * len * 0.5 * flip;
    const my = top + Math.sin(rad) * len * 0.2 - h * 0.06;
    fronds += `<path d="M ${x} ${top} Q ${mx} ${my} ${ex} ${ey}" stroke="${fill}" stroke-width="${h * 0.045}" fill="none" stroke-linecap="round"/>`;
  }
  const trunk = `<path d="M ${x - h * 0.02} ${baseY} C ${x - h * 0.06 * flip} ${baseY - h * 0.55}, ${x + h * 0.04 * flip} ${baseY - h * 0.7}, ${x} ${top}" stroke="${fill}" stroke-width="${h * 0.05}" fill="none"/>`;
  return trunk + fronds;
}

/** Soft glowing orb (path lights, candles, pendants). */
export function orb(x, y, r, color = WARM_GLASS, opacity = 0.9) {
  return (
    `<circle cx="${x}" cy="${y}" r="${r * 3.2}" fill="${color}" opacity="${(opacity * 0.16).toFixed(3)}" filter="url(#soft)"/>` +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffedc9" opacity="${opacity}"/>`
  );
}

/** Ceiling recessed light strip with glow. */
export function lightStrip(x1, y1, x2, y2, width = 5, opacity = 0.85) {
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${WARM_GLASS}" stroke-width="${width * 3.4}" opacity="${(opacity * 0.22).toFixed(2)}" filter="url(#soft)" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffe9c4" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round"/>`
  );
}

/** Shared defs every scene wants. */
export function baseDefs() {
  return (
    vignetteDef() +
    grainFilter("grain") +
    blurFilter("soft", 26) +
    blurFilter("soft2", 9)
  );
}
