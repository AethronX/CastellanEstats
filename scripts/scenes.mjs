/**
 * Scene compositions for Castellan Estates — light "golden morning" grade.
 * Warm white stone, cool glass, sage greenery, bronze linework, soft sun haze.
 * Each scene returns a complete SVG document string.
 */
import {
  INK, BRONZE, STONE_LIGHT, STONE_MID, STONE_SHADE, GLASS_COOL, SAGE, OLIVE, SEA_DAY,
  mulberry32, svgDoc, linGrad, radGrad, blurFilter, grainFilter, marbleFilter,
  vignetteDef, stars, skyDefs, hairline, hairRect, shadow, birds,
  reflectionDefs, reflection, cypress, palm, orb,
} from "./art.mjs";

const W = 2560;
const H = 1440;

/* ------------------------------------------------------------- shared kit */

function defsLight() {
  return (
    vignetteDef() +
    grainFilter("grain", "dark") +
    blurFilter("soft", 26) +
    blurFilter("soft2", 9)
  );
}

function atmosphereLight(w, h, { vignette = 0.2, grain = 0.045 } = {}) {
  return (
    `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grain}"/>` +
    `<rect width="${w}" height="${h}" fill="url(#vig)" opacity="${vignette}"/>`
  );
}

/** Morning sky gradients. mood: "morning" | "noon" | "golden" */
function daySky(mood = "morning") {
  const palettes = {
    morning: [
      [0, "#9db8ca"],
      [0.4, "#c3d4d8"],
      [0.68, "#e8e0cb"],
      [0.88, "#f6dfb0"],
      [1, "#f9d79d"],
    ],
    noon: [
      [0, "#8fb3cc"],
      [0.5, "#c8d9dd"],
      [0.85, "#eee8d6"],
      [1, "#f4ecd8"],
    ],
    golden: [
      [0, "#a8b4c4"],
      [0.45, "#d9cfc0"],
      [0.72, "#f0d7a6"],
      [1, "#f6c47e"],
    ],
  };
  return linGrad("sky", palettes[mood]);
}

function sunHaze(cx, cy, r, intensity = 1) {
  const defs = radGrad("sun", [
    [0, "#fffdf4", 0.95 * intensity],
    [0.18, "#fdf3d2", 0.7 * intensity],
    [0.5, "#f7e0a8", 0.28 * intensity],
    [1, "#f7e0a8", 0],
  ]);
  const body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sun)"/>`;
  return { defs, body };
}

/** Stone volume with face/side shading and ink roofline. */
function volume(x, y, w2, h2, { face = STONE_LIGHT, top = true } = {}) {
  return (
    `<rect x="${x}" y="${y}" width="${w2}" height="${h2}" fill="${face}"/>` +
    `<rect x="${x}" y="${y}" width="${w2}" height="${h2 * 0.12}" fill="#fff" opacity="0.35"/>` +
    (top ? hairline(x, y, x + w2, y, 0.55, 3, INK) : "")
  );
}

/** Cool glass band with sky reflection + sun streaks + mullions. */
function glassBand(rand, x, y, w2, h2, panes = 6, { streak = true } = {}) {
  let out =
    `<rect x="${x}" y="${y}" width="${w2}" height="${h2}" fill="url(#glassg)"/>`;
  if (streak)
    out += `<path d="M ${x + w2 * 0.12} ${y + h2} L ${x + w2 * 0.3} ${y} L ${x + w2 * 0.42} ${y} L ${x + w2 * 0.24} ${y + h2} Z" fill="#fdf4d8" opacity="0.4"/>` +
      `<path d="M ${x + w2 * 0.55} ${y + h2} L ${x + w2 * 0.66} ${y} L ${x + w2 * 0.71} ${y} L ${x + w2 * 0.6} ${y + h2} Z" fill="#fdf4d8" opacity="0.28"/>`;
  for (let i = 1; i < panes; i++)
    out += hairline(x + (w2 / panes) * i, y, x + (w2 / panes) * i, y + h2, 0.4, 2.5, INK);
  out += hairRect(x, y, w2, h2, 0.5, 2.5, INK);
  return out;
}

function glassDefs() {
  return linGrad("glassg", [
    [0, "#bfd3d6"],
    [0.5, GLASS_COOL],
    [1, "#93a8ad"],
  ]);
}

/** Olive tree — round sage canopy on a dark trunk. */
function olive(rand, x, baseY, h2, tone = OLIVE) {
  const r = h2 * 0.42;
  let canopy = "";
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand()) * r * 0.75;
    canopy += `<circle cx="${x + Math.cos(a) * rr}" cy="${baseY - h2 * 0.62 + Math.sin(a) * rr * 0.72}" r="${r * (0.4 + rand() * 0.35)}" fill="${tone}" opacity="${0.75 + rand() * 0.25}"/>`;
  }
  return (
    shadow(x, baseY + 6, r * 1.15, r * 0.2, 0.14) +
    `<path d="M ${x - 6} ${baseY} C ${x - 10} ${baseY - h2 * 0.35}, ${x + 8} ${baseY - h2 * 0.4}, ${x + 2} ${baseY - h2 * 0.6}" stroke="#5c4a33" stroke-width="${h2 * 0.05}" fill="none"/>` +
    canopy
  );
}

/* -------------------------------------------------- interior shared shell */

/**
 * One-point-perspective light interior: cream walls, travertine floor,
 * bright back wall. Returns {defs, body, bx, by, bw, bh}.
 */
function roomLight(rand, { backW = 0.5, backH = 0.52 } = {}) {
  const w = W, h = H;
  const bw = w * backW, bh = h * backH;
  const bx = (w - bw) / 2, by = (h - bh) / 2 - h * 0.015;
  const defs =
    linGrad("floorg", [[0, "#e9dfc9"], [0.55, "#e0d4ba"], [1, "#cfc0a0"]]) +
    linGrad("ceilg", [[0, "#f7f2e7"], [1, "#efe7d5"]]) +
    linGrad("wallLg", [[0, "#efe8d8"], [1, "#f6f1e5"]], { x1: 1, x2: 0, y1: 0, y2: 0 }) +
    linGrad("wallRg", [[0, "#e6ddc8"], [1, "#efe8d8"]], { x1: 0, x2: 1, y1: 0, y2: 0 }) +
    linGrad("glow", [[0, "#fdf6e0", 0.85], [1, "#fdf6e0", 0]]);
  const body =
    `<path d="M0 0 L${w} 0 L${bx + bw} ${by} L${bx} ${by} Z" fill="url(#ceilg)"/>` +
    `<path d="M0 ${h} L${w} ${h} L${bx + bw} ${by + bh} L${bx} ${by + bh} Z" fill="url(#floorg)"/>` +
    `<path d="M0 0 L${bx} ${by} L${bx} ${by + bh} L0 ${h} Z" fill="url(#wallLg)"/>` +
    `<path d="M${w} 0 L${bx + bw} ${by} L${bx + bw} ${by + bh} L${w} ${h} Z" fill="url(#wallRg)"/>` +
    // light spilling from the back onto the floor
    `<path d="M${bx + bw * 0.1} ${by + bh} L${bx + bw * 0.9} ${by + bh} L${w * 0.8} ${h} L${w * 0.2} ${h} Z" fill="url(#glow)" opacity="0.5"/>` +
    // perspective floor joints
    [0.25, 0.5, 0.75].map((t) =>
      `<line x1="${bx + bw * t}" y1="${by + bh}" x2="${w * (0.5 + (t - 0.5) * 1.9)}" y2="${h}" stroke="${INK}" stroke-width="1.6" opacity="0.12"/>`,
    ).join("") +
    // cove shadow lines where walls meet ceiling
    hairline(bx, by, 0, 0, 0.2, 2, INK) +
    hairline(bx + bw, by, w, 0, 0.2, 2, INK);
  return { defs, body, bx, by, bw, bh };
}

/** Bright picture window on the back wall with sea horizon. */
function seaWindow(bx, by, bw, bh, { mullions = 4, horizon = 0.62, mood = "morning" } = {}) {
  let out =
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#sky)"/>` +
    `<rect x="${bx}" y="${by + bh * horizon}" width="${bw}" height="${bh * (1 - horizon)}" fill="url(#seag)"/>` +
    `<rect x="${bx}" y="${by + bh * horizon}" width="${bw}" height="3" fill="#fff" opacity="0.5"/>`;
  for (let i = 0; i < 6; i++) {
    const y = by + bh * horizon + 14 + i * (bh * (1 - horizon) * 0.15);
    out += `<line x1="${bx + bw * 0.06}" y1="${y}" x2="${bx + bw * (0.3 + (i % 3) * 0.2)}" y2="${y}" stroke="#fff" stroke-width="2" opacity="${0.3 - i * 0.04}"/>`;
  }
  for (let i = 1; i < mullions; i++)
    out += hairline(bx + (bw / mullions) * i, by, bx + (bw / mullions) * i, by + bh, 0.5, 3, INK);
  out += hairRect(bx, by, bw, bh, 0.65, 3.5, INK);
  void mood;
  return out;
}

function seaDefs() {
  return linGrad("seag", [[0, "#a7cdd0"], [0.5, SEA_DAY], [1, "#6f9ba1"]]);
}

/* ================================================================ EXTERIOR */

export function sceneExterior({ w = W, h = H, seed = 11, closeness = 0 } = {}) {
  const rand = mulberry32(seed);
  const horizon = h * 0.64;
  const s = sunHaze(w * 0.66, h * 0.24, h * 0.36, 1);
  const defs = defsLight() + daySky("morning") + s.defs + glassDefs() +
    linGrad("water", [[0, "#c8dcda"], [0.5, "#a9c8c8"], [1, "#7fa3a4"]]) +
    reflectionDefs(h * 0.82, h * 0.3);

  const gx = w * (0.18 - closeness * 0.06);
  const gw = w * (0.64 + closeness * 0.12);
  const baseY = h * 0.82;
  const rnd2 = mulberry32(seed + 5);

  const villa =
    // ground floor: full glass beneath a floating slab
    volume(gx, baseY - h * 0.145, gw, h * 0.02, { top: false }) +
    glassBand(rnd2, gx + gw * 0.02, baseY - h * 0.125, gw * 0.96, h * 0.125, 11) +
    hairline(gx, baseY - h * 0.145, gx + gw, baseY - h * 0.145, 0.6, 4, INK) +
    // upper stone volume cantilevered left
    volume(gx - w * 0.03, baseY - h * 0.26, gw * 0.72, h * 0.115, { face: STONE_LIGHT }) +
    `<rect x="${gx - w * 0.03}" y="${baseY - h * 0.26}" width="${gw * 0.72}" height="${h * 0.115}" fill="#5a4a30" opacity="0.06"/>` +
    glassBand(rnd2, gx + gw * 0.04, baseY - h * 0.235, gw * 0.5, h * 0.075, 6) +
    // penthouse volume right
    volume(gx + gw * 0.44, baseY - h * 0.35, gw * 0.5, h * 0.09, { face: STONE_MID }) +
    glassBand(rnd2, gx + gw * 0.47, baseY - h * 0.33, gw * 0.42, h * 0.055, 5, { streak: false }) +
    // deep shade under the cantilevers
    `<rect x="${gx - w * 0.03}" y="${baseY - h * 0.147}" width="${gw * 0.72}" height="${h * 0.012}" fill="${INK}" opacity="0.3"/>` +
    `<rect x="${gx + gw * 0.44}" y="${baseY - h * 0.262}" width="${gw * 0.5}" height="${h * 0.01}" fill="${INK}" opacity="0.25"/>`;

  const green =
    olive(rand, w * 0.1, baseY, h * 0.24) +
    olive(rand, w * 0.92, baseY, h * 0.2) +
    cypress(w * 0.165, baseY, h * 0.19, w * 0.02, "#5d6247") +
    cypress(w * 0.865, baseY, h * 0.16, w * 0.018, "#5d6247");

  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` +
    s.body +
    birds(rand, w, h * 0.34, 6) +
    // distant hazed ridge
    `<path d="M0 ${horizon} C ${w * 0.25} ${horizon - h * 0.05}, ${w * 0.5} ${horizon - h * 0.01}, ${w * 0.68} ${horizon - h * 0.06} S ${w} ${horizon - h * 0.02} ${w} ${horizon - h * 0.03} L ${w} ${horizon + 10} L 0 ${horizon + 10} Z" fill="#a9b4ae" opacity="0.55"/>` +
    `<rect x="0" y="${horizon - h * 0.04}" width="${w}" height="${h * 0.08}" fill="#f2e6c9" opacity="0.35" filter="url(#soft)"/>` +
    villa + green +
    reflection(villa + green, baseY, h * 0.3, 0.3) +
    // infinity pool foreground mirroring the sky
    `<rect x="0" y="${baseY}" width="${w}" height="${h - baseY}" fill="url(#water)"/>` +
    `<rect x="0" y="${baseY}" width="${w}" height="3" fill="#fff" opacity="0.65"/>` +
    Array.from({ length: 9 }, (_, i) => {
      const y = baseY + 24 + i * ((h - baseY) / 9);
      const x0 = w * (0.08 + rand() * 0.3);
      const len = w * (0.2 + rand() * 0.5);
      return `<line x1="${x0}" y1="${y}" x2="${x0 + len}" y2="${y}" stroke="#ffffff" stroke-width="2" opacity="${(0.15 + rand() * 0.25).toFixed(2)}"/>`;
    }).join("") +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ============================================================== APPROACH */

export function sceneApproach({ seed = 21 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const vpx = w * 0.5, vpy = h * 0.58;
  const s = sunHaze(w * 0.5, h * 0.34, h * 0.3, 0.9);
  const defs = defsLight() + daySky("morning") + s.defs +
    linGrad("path", [[0, "#e4d9bf"], [1, "#cdbd99"]]) +
    linGrad("hedgeL", [[0, "#9aa07c"], [1, "#7a8161"]], { x1: 0, x2: 1, y1: 0, y2: 0 }) +
    linGrad("hedgeR", [[0, "#7a8161"], [1, "#9aa07c"]], { x1: 0, x2: 1, y1: 0, y2: 0 });

  const gw2 = w * 0.115;
  const gate =
    volume(vpx - gw2, vpy - h * 0.26, gw2 * 2, h * 0.26, { face: STONE_LIGHT }) +
    `<rect x="${vpx - gw2 * 0.42}" y="${vpy - h * 0.195}" width="${gw2 * 0.84}" height="${h * 0.195}" fill="#f9efd6"/>` +
    hairRect(vpx - gw2 * 0.42, vpy - h * 0.195, gw2 * 0.84, h * 0.195, 0.7, 3.5, INK) +
    `<rect x="${vpx - gw2 * 0.42}" y="${vpy - h * 0.195}" width="${gw2 * 0.1}" height="${h * 0.195}" fill="${BRONZE}" opacity="0.5"/>` +
    hairline(vpx - gw2 * 1.8, vpy - h * 0.26, vpx + gw2 * 1.8, vpy - h * 0.26, 0.4, 3, INK);

  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.3, 4) +
    // sage hedge walls converging
    `<path d="M0 ${h} L0 ${h * 0.4} L ${vpx - w * 0.14} ${vpy - h * 0.07} L ${vpx - w * 0.115} ${vpy} L 0 ${h} Z" fill="url(#hedgeL)"/>` +
    `<path d="M${w} ${h} L${w} ${h * 0.4} L ${vpx + w * 0.14} ${vpy - h * 0.07} L ${vpx + w * 0.115} ${vpy} L ${w} ${h} Z" fill="url(#hedgeR)"/>` +
    cypress(w * 0.12, h * 0.76, h * 0.44, w * 0.032, "#5d6247") +
    cypress(w * 0.88, h * 0.76, h * 0.44, w * 0.032, "#5d6247") +
    cypress(w * 0.28, h * 0.66, h * 0.27, w * 0.021, "#6b7152") +
    cypress(w * 0.72, h * 0.66, h * 0.27, w * 0.021, "#6b7152") +
    // stone path
    `<path d="M ${vpx - w * 0.055} ${vpy} L ${vpx + w * 0.055} ${vpy} L ${vpx + w * 0.44} ${h} L ${vpx - w * 0.44} ${h} Z" fill="url(#path)"/>` +
    Array.from({ length: 8 }, (_, i) => {
      const t = (i + 1) / 9;
      const y = vpy + (h - vpy) * Math.pow(t, 1.9);
      const half = w * 0.055 + (w * 0.44 - w * 0.055) * Math.pow(t, 1.9);
      return `<line x1="${vpx - half}" y1="${y}" x2="${vpx + half}" y2="${y}" stroke="${INK}" stroke-width="${1.5 + 4 * t}" opacity="0.2"/>`;
    }).join("") +
    // dappled tree shadows across the path
    Array.from({ length: 6 }, (_, i) => {
      const t = (i + 0.7) / 7;
      const y = vpy + (h - vpy) * Math.pow(t, 1.7);
      return shadow(vpx + (rand() - 0.5) * w * 0.3 * t, y, w * (0.05 + t * 0.16), 10 + t * 26, 0.1);
    }).join("") +
    gate +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================== DOOR */

export function sceneDoor({ seed = 31, gap = 0.055 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const cx = w / 2;
  const doorW = w * 0.3, doorH = h * 0.78, doorY = h * 0.115;
  const defs = defsLight() + marbleFilter("marble") +
    linGrad("doorpanel", [[0, "#7d6647"], [0.5, "#6a5539"], [1, "#5b4830"]], { x1: 0, x2: 1, y1: 0, y2: 0 }) +
    linGrad("insideLight", [[0, "#fdf7e3"], [1, "#f3e3b8"]]) +
    linGrad("stonewall", [[0, "#f2ecdd"], [1, "#ddd2ba"]]);

  const gapW = w * gap;
  const body =
    `<rect width="${w}" height="${h}" fill="url(#stonewall)"/>` +
    `<rect width="${w}" height="${h}" filter="url(#marble)" opacity="0.35"/>` +
    // coursing joints in the travertine
    Array.from({ length: 14 }, (_, i) => hairline(0, (i + 1) * (h / 15), w, (i + 1) * (h / 15), 0.1, 1.5, INK)).join("") +
    // portal frame
    volume(cx - doorW / 2 - w * 0.045, doorY - h * 0.05, doorW + w * 0.09, doorH + h * 0.05, { face: "#e7dcc4" }) +
    hairRect(cx - doorW / 2 - w * 0.045, doorY - h * 0.05, doorW + w * 0.09, doorH + h * 0.05, 0.7, 4, INK) +
    // bright interior seen through the opening gap
    `<rect x="${cx - gapW * 1.6}" y="${doorY}" width="${gapW * 3.2}" height="${doorH}" fill="url(#insideLight)"/>` +
    `<rect x="${cx - gapW * 0.5}" y="${doorY + doorH * 0.3}" width="${gapW}" height="${doorH * 0.7}" fill="#e8d49e" opacity="0.6"/>` +
    // bronze door leaves, ajar
    `<rect x="${cx - doorW / 2}" y="${doorY}" width="${doorW / 2 - gapW / 2}" height="${doorH}" fill="url(#doorpanel)"/>` +
    `<rect x="${cx + gapW / 2}" y="${doorY}" width="${doorW / 2 - gapW / 2}" height="${doorH}" fill="url(#doorpanel)"/>` +
    Array.from({ length: 5 }, (_, i) => {
      const y = doorY + doorH * (0.14 + i * 0.18);
      return hairline(cx - doorW / 2 + 30, y, cx - gapW / 2 - 26, y, 0.4, 2, "#d9c393") +
        hairline(cx + gapW / 2 + 26, y, cx + doorW / 2 - 30, y, 0.4, 2, "#d9c393");
    }).join("") +
    `<rect x="${cx - gapW / 2 - 20}" y="${doorY + doorH * 0.42}" width="8" height="${doorH * 0.16}" rx="4" fill="#e9d5a4"/>` +
    `<rect x="${cx + gapW / 2 + 12}" y="${doorY + doorH * 0.42}" width="8" height="${doorH * 0.16}" rx="4" fill="#e9d5a4"/>` +
    // stone floor with light spilling out
    `<rect x="0" y="${doorY + doorH}" width="${w}" height="${h - doorY - doorH}" fill="#d8cbae"/>` +
    `<path d="M ${cx - gapW * 2.6} ${h} L ${cx - gapW * 1.6} ${doorY + doorH} L ${cx + gapW * 1.6} ${doorY + doorH} L ${cx + gapW * 2.6} ${h} Z" fill="#fdf5dd" opacity="0.75"/>` +
    // planters flanking the portal
    olive(rand, cx - doorW / 2 - w * 0.1, h * 0.86, h * 0.2) +
    olive(rand, cx + doorW / 2 + w * 0.1, h * 0.86, h * 0.2) +
    atmosphereLight(w, h, { vignette: 0.24 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================= LOBBY */

export function sceneLobby({ seed = 41 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.4, backH: 0.52 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + marbleFilter("marble") +
    radGrad("skylight", [[0, "#fdf8e6", 0.9], [0.6, "#fdf8e6", 0.3], [1, "#fdf8e6", 0]]);

  // skylight shaft
  const shaft =
    `<path d="M ${w * 0.38} 0 L ${w * 0.62} 0 L ${w * 0.58} ${h * 0.75} L ${w * 0.42} ${h * 0.75} Z" fill="#fdf6da" opacity="0.32" filter="url(#soft2)"/>` +
    `<ellipse cx="${w * 0.5}" cy="${h * 0.78}" rx="${w * 0.11}" ry="${h * 0.03}" fill="#fdf6da" opacity="0.5" filter="url(#soft2)"/>`;

  // sculptural stair sweeping along the right wall
  let stair = "";
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x1 = bx + bw + (w - bx - bw) * 0.14 + t * bw * 0.34;
    const yy = by + bh - t * bh * 0.72;
    stair +=
      `<rect x="${x1}" y="${yy}" width="${bw * 0.15}" height="${10 + t * 4}" fill="${STONE_MID}"/>` +
      hairline(x1, yy, x1 + bw * 0.15, yy, 0.4, 2, INK);
  }
  stair += `<path d="M ${bx + bw + (w - bx - bw) * 0.14} ${by + bh + 12} L ${bx + bw + (w - bx - bw) * 0.14 + bw * 0.34} ${by + bh - bh * 0.72 + 12} " stroke="${BRONZE}" stroke-width="4" opacity="0.8"/>`;

  // brass pendants descending in the void
  let pendants = "";
  for (let i = 0; i < 9; i++) {
    const x = w * 0.42 + rand() * w * 0.16;
    const y = h * 0.16 + rand() * h * 0.28;
    pendants += `<line x1="${x}" y1="0" x2="${x}" y2="${y - 8}" stroke="${BRONZE}" stroke-width="1.5" opacity="0.5"/>` + orb(x, y, 5 + rand() * 4, "#f0d79c", 0.9);
  }

  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    // back feature wall: bookmatched light marble with a bright doorway
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#eee7d6"/>` +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" filter="url(#marble)" opacity="0.55"/>` +
    `<rect x="${bx + bw * 0.4}" y="${by + bh * 0.34}" width="${bw * 0.2}" height="${bh * 0.66}" fill="#fbf3dc"/>` +
    hairRect(bx + bw * 0.4, by + bh * 0.34, bw * 0.2, bh * 0.66, 0.6, 3, INK) +
    hairRect(bx, by, bw, bh, 0.5, 3, INK) +
    // stone columns
    volume(bx - w * 0.05, by - h * 0.06, w * 0.02, bh + h * 0.14, { face: "#e8dfc9", top: false }) +
    volume(bx + bw + w * 0.03, by - h * 0.06, w * 0.02, bh + h * 0.14, { face: "#e8dfc9", top: false }) +
    shaft + stair + pendants +
    // reflecting sheen on the marble floor
    `<ellipse cx="${w * 0.5}" cy="${h * 0.9}" rx="${w * 0.22}" ry="${h * 0.05}" fill="#fff" opacity="0.28" filter="url(#soft)"/>` +
    // low stone bench with cushion
    `<rect x="${w * 0.3}" y="${h * 0.83}" width="${w * 0.14}" height="${h * 0.02}" rx="6" fill="#d9cdb2"/>` +
    `<rect x="${w * 0.3}" y="${h * 0.845}" width="${w * 0.14}" height="${h * 0.05}" fill="${STONE_MID}"/>` +
    shadow(w * 0.37, h * 0.9, w * 0.08, 12, 0.14) +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* =============================================================== HALLWAY */

export function sceneHallway({ seed = 51 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.24, backH: 0.42 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + daySky("noon") + glassDefs();

  // art frames along walls in perspective
  let frames = "";
  for (let i = 0; i < 4; i++) {
    const t = 0.18 + i * 0.2;
    const xL = bx * t, xR = w - bx * t;
    const fy = h * 0.5 - h * 0.16 * (1 - t);
    const fh = h * (0.32 - 0.18 * t);
    const fw = w * (0.05 - 0.028 * t);
    const art = i % 2 === 0 ? "#c9b482" : "#98a08a";
    frames +=
      `<rect x="${xL - fw}" y="${fy - fh / 2}" width="${fw}" height="${fh}" fill="${art}" opacity="0.85"/>` +
      hairRect(xL - fw, fy - fh / 2, fw, fh, 0.6, 3, INK) +
      `<rect x="${xR}" y="${fy - fh / 2}" width="${fw}" height="${fh}" fill="${art}" opacity="0.85"/>` +
      hairRect(xR, fy - fh / 2, fw, fh, 0.6, 3, INK);
  }
  // rhythm of daylight slots along the left wall
  let slots = "";
  for (let i = 0; i < 4; i++) {
    const t = 0.14 + i * 0.2;
    slots += `<path d="M ${bx * t - w * 0.006} ${h * 0.16 * (1 + t)} L ${bx * t + w * 0.006} ${h * 0.16 * (1 + t)} L ${bx * t + w * 0.006} ${h - h * 0.2 * (1 + t * 0.4)} L ${bx * t - w * 0.006} ${h - h * 0.2 * (1 + t * 0.4)} Z" fill="#fdf4d6" opacity="${0.75 - t * 0.4}"/>` +
      // light pooling on floor from each slot
      shadow(bx * t + w * 0.04, h * (0.86 - t * 0.1), w * 0.045, 14, 0.08);
  }

  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    // end of gallery: glass wall to a courtyard olive
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#sky)"/>` +
    `<rect x="${bx}" y="${by + bh * 0.72}" width="${bw}" height="${bh * 0.28}" fill="#cabf9f"/>` +
    olive(rand, bx + bw * 0.5, by + bh * 0.74, bh * 0.42, "#77805c") +
    Array.from({ length: 3 }, (_, i) => hairline(bx + (bw / 3) * i, by, bx + (bw / 3) * i, by + bh, 0.45, 3, INK)).join("") +
    hairRect(bx, by, bw, bh, 0.65, 3.5, INK) +
    frames + slots +
    // slim console table with sculpture
    `<rect x="${w * 0.44}" y="${h * 0.755}" width="${w * 0.12}" height="${h * 0.012}" fill="#b59a6b"/>` +
    `<rect x="${w * 0.448}" y="${h * 0.767}" width="${w * 0.008}" height="${h * 0.09}" fill="#8f7a55"/>` +
    `<rect x="${w * 0.545}" y="${h * 0.767}" width="${w * 0.008}" height="${h * 0.09}" fill="#8f7a55"/>` +
    `<path d="M ${w * 0.5} ${h * 0.7} C ${w * 0.508} ${h * 0.72}, ${w * 0.492} ${h * 0.735}, ${w * 0.5} ${h * 0.755}" stroke="${BRONZE}" stroke-width="7" fill="none" opacity="0.85"/>` +
    shadow(w * 0.5, h * 0.87, w * 0.07, 12, 0.12) +
    atmosphereLight(w, h, { vignette: 0.22 });
  return svgDoc(w, h, defs, body);
}

/* ============================================================ LIVING ROOM */

export function sceneLiving({ seed = 61 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.56, backH: 0.54 });
  const { bx, by, bw, bh } = shell;
  const s = sunHaze(bx + bw * 0.68, by + bh * 0.28, bh * 0.4, 0.85);
  const defs = defsLight() + shell.defs + s.defs + daySky("morning") + seaDefs();

  const sofaY = h * 0.76;
  const furniture =
    // cast light patch from the window across the floor
    `<path d="M ${w * 0.3} ${h * 0.98} L ${bx + bw * 0.2} ${by + bh} L ${bx + bw * 0.55} ${by + bh} L ${w * 0.62} ${h * 0.98} Z" fill="#fdf3d2" opacity="0.4"/>` +
    // long cream sofa
    shadow(w * 0.5, sofaY + h * 0.09, w * 0.22, 18, 0.16) +
    `<rect x="${w * 0.3}" y="${sofaY}" width="${w * 0.4}" height="${h * 0.085}" rx="16" fill="#efe6d2"/>` +
    `<rect x="${w * 0.3}" y="${sofaY - h * 0.012}" width="${w * 0.4}" height="${h * 0.02}" rx="10" fill="#f7f0e0"/>` +
    `<rect x="${w * 0.3}" y="${sofaY - h * 0.05}" width="${w * 0.055}" height="${h * 0.135}" rx="14" fill="#e7dcc4"/>` +
    `<rect x="${w * 0.645}" y="${sofaY - h * 0.05}" width="${w * 0.055}" height="${h * 0.135}" rx="14" fill="#e7dcc4"/>` +
    hairline(w * 0.3, sofaY + h * 0.085, w * 0.7, sofaY + h * 0.085, 0.3, 2, INK) +
    // cushions
    `<rect x="${w * 0.37}" y="${sofaY - h * 0.028}" width="${w * 0.05}" height="${h * 0.035}" rx="8" fill="#d9c9a6"/>` +
    `<rect x="${w * 0.43}" y="${sofaY - h * 0.028}" width="${w * 0.05}" height="${h * 0.035}" rx="8" fill="#c2b391"/>` +
    `<rect x="${w * 0.55}" y="${sofaY - h * 0.028}" width="${w * 0.05}" height="${h * 0.035}" rx="8" fill="#a9b0a1"/>` +
    // travertine coffee table
    shadow(w * 0.5, h * 0.93, w * 0.1, 14, 0.14) +
    `<ellipse cx="${w * 0.5}" cy="${h * 0.905}" rx="${w * 0.085}" ry="${h * 0.028}" fill="#d6c9ab"/>` +
    `<ellipse cx="${w * 0.5}" cy="${h * 0.898}" rx="${w * 0.085}" ry="${h * 0.026}" fill="#eee4cd"/>` +
    // ceramics
    `<ellipse cx="${w * 0.478}" cy="${h * 0.885}" rx="14" ry="7" fill="#a68d5e"/>` +
    `<path d="M ${w * 0.52} ${h * 0.885} c 0 -26 22 -26 22 0 z" fill="#7d8471"/>` +
    // sculptural floor lamp
    `<path d="M ${w * 0.235} ${h * 0.88} C ${w * 0.23} ${h * 0.7}, ${w * 0.255} ${h * 0.66}, ${w * 0.258} ${h * 0.6}" stroke="${BRONZE}" stroke-width="5" fill="none" opacity="0.9"/>` +
    orb(w * 0.259, h * 0.59, 15, "#f7e3ad", 0.9) +
    shadow(w * 0.24, h * 0.89, w * 0.03, 8, 0.12) +
    // fireplace in the right wall: travertine surround
    `<rect x="${w * 0.83}" y="${h * 0.52}" width="${w * 0.13}" height="${h * 0.36}" fill="#e3d8bf"/>` +
    hairRect(w * 0.83, h * 0.52, w * 0.13, h * 0.36, 0.4, 3, INK) +
    `<rect x="${w * 0.848}" y="${h * 0.63}" width="${w * 0.094}" height="${h * 0.07}" fill="#3f3524"/>` +
    `<rect x="${w * 0.852}" y="${h * 0.665}" width="${w * 0.086}" height="${h * 0.028}" fill="#e8963f" opacity="0.85" filter="url(#soft2)"/>`;

  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    seaWindow(bx, by, bw, bh, { mullions: 5 }) + s.body +
    furniture +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================ KITCHEN */

export function sceneKitchen({ seed = 71 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.5, backH: 0.5 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + marbleFilter("marble");
  const islandY = h * 0.7;
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    // back wall: oak cabinetry + long clerestory window
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#d9c9a4"/>` +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh * 0.3}" fill="#f3ead2"/>` +
    `<rect x="${bx + bw * 0.06}" y="${by + bh * 0.05}" width="${bw * 0.88}" height="${bh * 0.2}" fill="#cfe0df"/>` +
    hairRect(bx + bw * 0.06, by + bh * 0.05, bw * 0.88, bh * 0.2, 0.55, 3, INK) +
    [1, 2, 3].map((i) => hairline(bx + bw * (0.06 + 0.22 * i), by + bh * 0.05, bx + bw * (0.06 + 0.22 * i), by + bh * 0.25, 0.4, 2.5, INK)).join("") +
    // oak cabinet joints + bronze pulls
    Array.from({ length: 6 }, (_, i) => hairline(bx + bw * (0.155 * (i + 1)), by + bh * 0.32, bx + bw * (0.155 * (i + 1)), by + bh, 0.3, 2, INK)).join("") +
    Array.from({ length: 5 }, (_, i) => `<rect x="${bx + bw * (0.07 + 0.155 * i)}" y="${by + bh * 0.5}" width="${bw * 0.03}" height="5" rx="2" fill="${BRONZE}" opacity="0.8"/>`).join("") +
    hairline(bx, by + bh * 0.3, bx + bw, by + bh * 0.3, 0.4, 3, INK) +
    // brass pendant trio
    [0.4, 0.5, 0.6].map((t) =>
      `<line x1="${w * t}" y1="0" x2="${w * t}" y2="${h * 0.4}" stroke="${BRONZE}" stroke-width="2.5" opacity="0.7"/>` +
      `<path d="M ${w * t - 24} ${h * 0.435} a 24 24 0 0 1 48 0 z" fill="${BRONZE}"/>` +
      orb(w * t, h * 0.44, 8, "#f7e3ad", 0.9)
    ).join("") +
    // marble island with waterfall edges
    shadow(w * 0.5, islandY + h * 0.26, w * 0.21, 18, 0.16) +
    `<rect x="${w * 0.3}" y="${islandY}" width="${w * 0.4}" height="${h * 0.05}" fill="#f3ecdc"/>` +
    `<rect x="${w * 0.3}" y="${islandY}" width="${w * 0.4}" height="${h * 0.05}" filter="url(#marble)" opacity="0.6"/>` +
    `<rect x="${w * 0.3}" y="${islandY + h * 0.05}" width="${w * 0.02}" height="${h * 0.2}" fill="#e6dcc4"/>` +
    `<rect x="${w * 0.68}" y="${islandY + h * 0.05}" width="${w * 0.02}" height="${h * 0.2}" fill="#e6dcc4"/>` +
    `<rect x="${w * 0.32}" y="${islandY + h * 0.05}" width="${w * 0.36}" height="${h * 0.2}" fill="#efe7d3"/>` +
    hairline(w * 0.3, islandY, w * 0.7, islandY, 0.55, 3, INK) +
    hairRect(w * 0.3, islandY, w * 0.4, h * 0.25, 0.3, 2, INK) +
    // fruit bowl + board
    `<path d="M ${w * 0.45 - 30} ${islandY - 4} a 30 30 0 0 0 60 0 z" fill="#7d8471"/>` +
    `<circle cx="${w * 0.443}" cy="${islandY - 12}" r="8" fill="#c9a13c"/>` +
    `<circle cx="${w * 0.457}" cy="${islandY - 14}" r="8" fill="#b4842e"/>` +
    `<rect x="${w * 0.54}" y="${islandY - 8}" width="${w * 0.05}" height="8" rx="4" fill="#b59a6b"/>` +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================= DINING */

export function sceneDining({ seed = 81 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.52, backH: 0.52 });
  const { bx, by, bw, bh } = shell;
  const s = sunHaze(bx + bw * 0.3, by + bh * 0.3, bh * 0.34, 0.7);
  const defs = defsLight() + shell.defs + s.defs + daySky("noon") + seaDefs();
  const tableY = h * 0.72;
  const chairs = Array.from({ length: 5 }, (_, i) => {
    const x = w * (0.335 + i * 0.083);
    return `<rect x="${x}" y="${tableY - h * 0.075}" width="${w * 0.03}" height="${h * 0.075}" rx="10" fill="#ddd0b4"/>` +
      hairRect(x, tableY - h * 0.075, w * 0.03, h * 0.075, 0.25, 2, INK);
  }).join("");
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    seaWindow(bx, by, bw, bh, { mullions: 4, horizon: 0.66 }) + s.body +
    // linear bronze pendant
    `<line x1="${w * 0.35}" y1="0" x2="${w * 0.35}" y2="${h * 0.335}" stroke="${BRONZE}" stroke-width="2.5" opacity="0.7"/>` +
    `<line x1="${w * 0.65}" y1="0" x2="${w * 0.65}" y2="${h * 0.335}" stroke="${BRONZE}" stroke-width="2.5" opacity="0.7"/>` +
    `<rect x="${w * 0.345}" y="${h * 0.335}" width="${w * 0.31}" height="${h * 0.012}" rx="6" fill="${BRONZE}"/>` +
    `<rect x="${w * 0.35}" y="${h * 0.347}" width="${w * 0.3}" height="${h * 0.006}" fill="#f7e3ad" opacity="0.9" filter="url(#soft2)"/>` +
    // long oak table
    shadow(w * 0.5, tableY + h * 0.2, w * 0.23, 18, 0.16) +
    chairs +
    `<rect x="${w * 0.3}" y="${tableY}" width="${w * 0.4}" height="${h * 0.032}" fill="#c2a674"/>` +
    `<rect x="${w * 0.3}" y="${tableY}" width="${w * 0.4}" height="${h * 0.008}" fill="#dbc394"/>` +
    hairline(w * 0.3, tableY + h * 0.032, w * 0.7, tableY + h * 0.032, 0.35, 2.5, INK) +
    `<rect x="${w * 0.37}" y="${tableY + h * 0.032}" width="${w * 0.032}" height="${h * 0.16}" fill="#a98e60"/>` +
    `<rect x="${w * 0.6}" y="${tableY + h * 0.032}" width="${w * 0.032}" height="${h * 0.16}" fill="#a98e60"/>` +
    // tablescape: linen runner, ceramics, greens
    `<rect x="${w * 0.4}" y="${tableY - 3}" width="${w * 0.2}" height="6" fill="#f4ecda"/>` +
    [0.43, 0.5, 0.57].map((t) => `<ellipse cx="${w * t}" cy="${tableY - 4}" rx="15" ry="6" fill="#9aa389"/>`).join("") +
    `<path d="M ${w * 0.5} ${tableY - 10} c -6 -18 8 -30 4 -44 M ${w * 0.5} ${tableY - 10} c 8 -14 -2 -28 6 -40" stroke="#77805c" stroke-width="3" fill="none"/>` +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================ BEDROOM */

export function sceneBedroom({ seed = 91 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.5, backH: 0.52 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + daySky("morning") + seaDefs() +
    linGrad("sheer", [[0, "#ffffff", 0.65], [1, "#f4ead2", 0.25]]);
  const bedY = h * 0.75;
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    seaWindow(bx, by, bw, bh, { mullions: 3, horizon: 0.6 }) +
    // sheer curtains breathing at both edges of the glass
    `<path d="M ${bx + 6} ${by} C ${bx + bw * 0.1} ${by + bh * 0.4}, ${bx - bw * 0.02} ${by + bh * 0.7}, ${bx + bw * 0.07} ${by + bh} L ${bx + 6} ${by + bh} Z" fill="url(#sheer)"/>` +
    `<path d="M ${bx + bw - 6} ${by} C ${bx + bw * 0.9} ${by + bh * 0.45}, ${bx + bw * 1.02} ${by + bh * 0.75}, ${bx + bw * 0.93} ${by + bh} L ${bx + bw - 6} ${by + bh} Z" fill="url(#sheer)"/>` +
    // platform bed in cream linen
    shadow(w * 0.5, bedY + h * 0.1, w * 0.21, 18, 0.16) +
    `<rect x="${w * 0.335}" y="${bedY - h * 0.155}" width="${w * 0.33}" height="${h * 0.155}" fill="#e2d5b8"/>` +
    hairRect(w * 0.335, bedY - h * 0.155, w * 0.33, h * 0.155, 0.3, 2.5, INK) +
    `<rect x="${w * 0.32}" y="${bedY}" width="${w * 0.36}" height="${h * 0.08}" rx="12" fill="#f4ecdb"/>` +
    `<rect x="${w * 0.335}" y="${bedY + h * 0.006}" width="${w * 0.33}" height="${h * 0.02}" rx="8" fill="#fdf8ec"/>` +
    // throw across the foot
    `<path d="M ${w * 0.335} ${bedY + h * 0.045} L ${w * 0.665} ${bedY + h * 0.045} L ${w * 0.66} ${bedY + h * 0.08} L ${w * 0.34} ${bedY + h * 0.08} Z" fill="#b3a180"/>` +
    // pillows
    `<rect x="${w * 0.36}" y="${bedY - h * 0.022}" width="${w * 0.09}" height="${h * 0.03}" rx="10" fill="#efe4cb"/>` +
    `<rect x="${w * 0.55}" y="${bedY - h * 0.022}" width="${w * 0.09}" height="${h * 0.03}" rx="10" fill="#efe4cb"/>` +
    // floating oak side tables + ceramics
    `<rect x="${w * 0.272}" y="${bedY - h * 0.01}" width="${w * 0.04}" height="${h * 0.012}" fill="#b59a6b"/>` +
    `<rect x="${w * 0.688}" y="${bedY - h * 0.01}" width="${w * 0.04}" height="${h * 0.012}" fill="#b59a6b"/>` +
    orb(w * 0.292, bedY - h * 0.045, 9, "#f7e3ad", 0.85) +
    `<path d="M ${w * 0.708} ${bedY - h * 0.012} c 0 -20 16 -20 16 0 z" fill="#7d8471"/>` +
    // wool rug
    `<ellipse cx="${w * 0.5}" cy="${h * 0.93}" rx="${w * 0.19}" ry="${h * 0.035}" fill="#eee5d0" opacity="0.9"/>` +
    hairline(w * 0.34, h * 0.945, w * 0.66, h * 0.945, 0.2, 2, INK) +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================ CLOSET */

export function sceneCloset({ seed = 101 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.3, backH: 0.44 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs;
  // oak wardrobe bays receding on both walls
  let bays = "";
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const t0 = i / 4, t1 = (i + 0.85) / 4;
      const xA = w / 2 + side * (bw / 2 + (w / 2 - bw / 2) * (1 - t0) * 0.92);
      const xB = w / 2 + side * (bw / 2 + (w / 2 - bw / 2) * (1 - t1) * 0.92);
      const yTopA = by * (1 - t0) * 0.5 + by * t0;
      const yTopB = by * (1 - t1) * 0.5 + by * t1;
      const yBotA = h - (h - by - bh) * (1 - (1 - t0) * 0.92);
      const yBotB = h - (h - by - bh) * (1 - (1 - t1) * 0.92);
      bays +=
        `<path d="M${xA} ${yTopA} L${xB} ${yTopB} L${xB} ${yBotB} L${xA} ${yBotA} Z" fill="${i % 2 ? "#d3bd92" : "#c9b283"}"/>` +
        `<path d="M${xA} ${yTopA + 8} L${xB} ${yTopB + 6} L${xB} ${yTopB + 12} L${xA} ${yTopA + 16}" fill="#fdf4d6" opacity="0.7"/>` +
        hairline(xA, yTopA, xA, yBotA, 0.4, 2.5, INK) +
        // garment silhouettes in the open bay
        (i === 1
          ? Array.from({ length: 4 }, (_, g) => {
              const gx = xA + (xB - xA) * (0.18 + g * 0.2);
              const gy = yTopA + (yTopB - yTopA) * (0.18 + g * 0.2) + 28;
              const gh2 = (yBotA - yTopA) * 0.32;
              const tones = ["#e8dfc9", "#a9b0a1", "#b3a180", "#8f8a76"];
              return `<rect x="${gx - 11}" y="${gy}" width="22" height="${gh2}" rx="8" fill="${tones[g]}"/>`;
            }).join("")
          : "");
    }
  }
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#efe7d4"/>` +
    // full-height mirror at the end reflecting light
    `<rect x="${bx + bw * 0.3}" y="${by + bh * 0.12}" width="${bw * 0.4}" height="${bh * 0.78}" rx="${bw * 0.2}" fill="#dfe6e0"/>` +
    `<path d="M ${bx + bw * 0.38} ${by + bh * 0.85} L ${bx + bw * 0.5} ${by + bh * 0.15} L ${bx + bw * 0.56} ${by + bh * 0.15} L ${bx + bw * 0.44} ${by + bh * 0.85} Z" fill="#fff" opacity="0.55"/>` +
    hairRect(bx + bw * 0.3, by + bh * 0.12, bw * 0.4, bh * 0.78, 0.55, 3, INK) +
    bays +
    // leather-topped island with jewellery trays
    shadow(w * 0.5, h * 0.9, w * 0.1, 14, 0.16) +
    `<rect x="${w * 0.42}" y="${h * 0.755}" width="${w * 0.16}" height="${h * 0.012}" fill="#8f7a55"/>` +
    `<rect x="${w * 0.425}" y="${h * 0.767}" width="${w * 0.15}" height="${h * 0.12}" fill="#c9b283"/>` +
    hairRect(w * 0.425, h * 0.767, w * 0.15, h * 0.12, 0.35, 2, INK) +
    `<rect x="${w * 0.45}" y="${h * 0.748}" width="${w * 0.035}" height="6" rx="3" fill="${BRONZE}"/>` +
    `<rect x="${w * 0.52}" y="${h * 0.748}" width="${w * 0.035}" height="6" rx="3" fill="${BRONZE}"/>` +
    // ceiling light coffer
    `<rect x="${w * 0.3}" y="${h * 0.045}" width="${w * 0.4}" height="${h * 0.012}" rx="6" fill="#fdf4d6" opacity="0.9"/>` +
    atmosphereLight(w, h, { vignette: 0.22 });
  return svgDoc(w, h, defs, body);
}

/* =============================================================== BATHROOM */

export function sceneBathroom({ seed = 111 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.5, backH: 0.5 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + marbleFilter("marble") + daySky("noon");
  const tubY = h * 0.78;
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    // travertine feature wall
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#e9dfc9"/>` +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" filter="url(#marble)" opacity="0.5"/>` +
    Array.from({ length: 4 }, (_, i) => hairline(bx, by + (bh / 4) * (i + 1), bx + bw, by + (bh / 4) * (i + 1), 0.15, 2, INK)).join("") +
    // garden picture window above the tub
    `<rect x="${bx + bw * 0.22}" y="${by + bh * 0.1}" width="${bw * 0.56}" height="${bh * 0.52}" fill="url(#sky)"/>` +
    `<rect x="${bx + bw * 0.22}" y="${by + bh * 0.44}" width="${bw * 0.56}" height="${bh * 0.18}" fill="#8b9471"/>` +
    olive(rand, bx + bw * 0.4, by + bh * 0.52, bh * 0.26, "#77805c") +
    olive(rand, bx + bw * 0.64, by + bh * 0.54, bh * 0.2, "#6b7152") +
    hairRect(bx + bw * 0.22, by + bh * 0.1, bw * 0.56, bh * 0.52, 0.6, 3, INK) +
    // freestanding stone tub
    shadow(w * 0.5, tubY + h * 0.055, w * 0.16, 16, 0.18) +
    `<path d="M ${w * 0.36} ${tubY - h * 0.075} C ${w * 0.36} ${tubY + h * 0.045}, ${w * 0.64} ${tubY + h * 0.045}, ${w * 0.64} ${tubY - h * 0.075} L ${w * 0.62} ${tubY - h * 0.075} C ${w * 0.62} ${tubY + h * 0.02}, ${w * 0.38} ${tubY + h * 0.02}, ${w * 0.38} ${tubY - h * 0.075} Z" fill="#efe8d6"/>` +
    `<path d="M ${w * 0.38} ${tubY - h * 0.075} C ${w * 0.38} ${tubY + h * 0.02}, ${w * 0.62} ${tubY + h * 0.02}, ${w * 0.62} ${tubY - h * 0.075} Z" fill="#dfe9e4"/>` +
    `<ellipse cx="${w * 0.5}" cy="${tubY - h * 0.072}" rx="${w * 0.117}" ry="10" fill="#f7f2e4"/>` +
    hairline(w * 0.365, tubY - h * 0.072, w * 0.635, tubY - h * 0.072, 0.4, 2, INK) +
    // brass floor filler
    `<path d="M ${w * 0.5} ${tubY - h * 0.075} L ${w * 0.5} ${tubY - h * 0.2} L ${w * 0.532} ${tubY - h * 0.2}" stroke="${BRONZE}" stroke-width="5" fill="none" opacity="0.9"/>` +
    // towels + stool + plant
    `<rect x="${w * 0.29}" y="${tubY - h * 0.03}" width="${w * 0.04}" height="${h * 0.075}" fill="#f7f2e4"/>` +
    hairRect(w * 0.29, tubY - h * 0.03, w * 0.04, h * 0.075, 0.3, 2, INK) +
    `<ellipse cx="${w * 0.685}" cy="${tubY + h * 0.03}" rx="26" ry="8" fill="#b59a6b"/>` +
    `<rect x="${w * 0.681}" y="${tubY + h * 0.03}" width="16" height="${h * 0.045}" fill="#a98e60"/>` +
    `<path d="M ${w * 0.685} ${tubY + h * 0.02} c -14 -22 -2 -34 2 -46 c 6 14 16 26 2 46" fill="#77805c"/>` +
    atmosphereLight(w, h, { vignette: 0.22 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================ CINEMA */

export function sceneCinema({ seed = 121 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.54, backH: 0.5 });
  const { bx, by, bw, bh } = shell;
  const s = sunHaze(bx + bw * 0.62, by + bh * 0.3, bh * 0.34, 0.9);
  const defs = defsLight() + shell.defs + s.defs + daySky("golden") + seaDefs() +
    linGrad("dim", [[0, "#2e2921", 0.5], [0.4, "#2e2921", 0.12], [1, "#2e2921", 0]]);
  // cream seats, two rows
  let seats = "";
  for (let r = 0; r < 2; r++) {
    const y = h * (0.75 + r * 0.115);
    const scale = 1 + r * 0.35;
    for (let i = 0; i < 4; i++) {
      const x = w * (0.29 + i * 0.115) - (scale - 1) * w * 0.06;
      const sw = w * 0.085 * scale;
      seats +=
        shadow(x + sw / 2, y + h * 0.08 * scale, sw * 0.6, 12, 0.14) +
        `<rect x="${x}" y="${y}" width="${sw}" height="${h * 0.075 * scale}" rx="18" fill="#e9dfc8"/>` +
        `<rect x="${x}" y="${y - h * 0.05 * scale}" width="${sw}" height="${h * 0.055 * scale}" rx="16" fill="#f1e8d4"/>` +
        hairline(x, y, x + sw, y, 0.25, 2, INK);
    }
  }
  const body =
    `<rect width="${w}" height="${h}" fill="#efe8d7"/>` + shell.body +
    // the screen: a golden coast film playing
    `<rect x="${bx - bw * 0.035}" y="${by - bh * 0.05}" width="${bw * 1.07}" height="${bh * 1.1}" fill="#3a3227"/>` +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#sky)"/>` + s.body +
    `<rect x="${bx}" y="${by + bh * 0.66}" width="${bw}" height="${bh * 0.34}" fill="url(#seag)"/>` +
    `<path d="M${bx} ${by + bh * 0.72} C ${bx + bw * 0.3} ${by + bh * 0.64}, ${bx + bw * 0.6} ${by + bh * 0.8}, ${bx + bw} ${by + bh * 0.68} L ${bx + bw} ${by + bh} L ${bx} ${by + bh} Z" fill="#caa96a" opacity="0.8"/>` +
    hairRect(bx, by, bw, bh, 0.7, 4, INK) +
    // soft dimming toward the viewer for cinema mood
    `<rect width="${w}" height="${h}" fill="url(#dim)" transform="translate(0 ${h}) scale(1 -1)"/>` +
    seats +
    // bronze wall sconces
    orb(w * 0.09, h * 0.45, 8, "#f7e3ad", 0.8) + orb(w * 0.91, h * 0.45, 8, "#f7e3ad", 0.8) +
    atmosphereLight(w, h, { vignette: 0.3 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================ OFFICE */

export function sceneOffice({ seed = 131 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const shell = roomLight(rand, { backW: 0.52, backH: 0.52 });
  const { bx, by, bw, bh } = shell;
  const defs = defsLight() + shell.defs + daySky("morning");
  // oak bookshelf wall left
  let shelves = "";
  for (let i = 0; i < 5; i++) {
    const t = i / 5;
    const y0 = h * 0.16 + t * h * 0.62;
    shelves += `<path d="M ${w * 0.04} ${y0} L ${bx - 8} ${by + bh * (0.08 + t * 0.78)}" stroke="#a98e60" stroke-width="5" opacity="0.7"/>`;
    for (let b = 0; b < 9; b++) {
      const tt = b / 9 + rand() * 0.04;
      const x = w * 0.05 + (bx - w * 0.07) * tt;
      const bh2 = 36 - 17 * tt + rand() * 14;
      const tones = ["#8f8a76", "#b3a180", "#a9b0a1", "#c9b283", "#7d8471"];
      shelves += `<rect x="${x}" y="${y0 - bh2 + (by + bh * (0.08 + t * 0.78) - y0) * tt}" width="${9 - 4 * tt}" height="${bh2}" fill="${tones[Math.floor(rand() * tones.length)]}"/>`;
    }
  }
  // daylight skyline in the window
  const cr = mulberry32(seed + 3);
  let city = "";
  for (let i = 0; i < 10; i++) {
    const tw = bw * (0.05 + cr() * 0.07);
    const tx = bx + cr() * (bw - tw);
    const th = bh * (0.16 + cr() * 0.3);
    city += `<rect x="${tx}" y="${by + bh - th}" width="${tw}" height="${th}" fill="#b9c2c4" opacity="${0.5 + cr() * 0.3}"/>` +
      hairline(tx, by + bh - th, tx + tw, by + bh - th, 0.3, 2, INK);
  }
  const deskY = h * 0.74;
  const body =
    `<rect width="${w}" height="${h}" fill="#f4eee0"/>` + shell.body +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#sky)"/>` +
    `<rect x="${bx}" y="${by + bh * 0.82}" width="${bw}" height="${bh * 0.18}" fill="#cdd6d2"/>` + city +
    hairRect(bx, by, bw, bh, 0.6, 3.5, INK) +
    hairline(bx + bw / 2, by, bx + bw / 2, by + bh, 0.4, 3, INK) +
    shelves +
    // walnut desk
    shadow(w * 0.51, deskY + h * 0.19, w * 0.16, 16, 0.16) +
    `<rect x="${w * 0.37}" y="${deskY}" width="${w * 0.29}" height="${h * 0.024}" fill="#9a7b4f"/>` +
    `<rect x="${w * 0.37}" y="${deskY}" width="${w * 0.29}" height="${h * 0.007}" fill="#c2a674"/>` +
    `<rect x="${w * 0.395}" y="${deskY + h * 0.024}" width="${w * 0.02}" height="${h * 0.15}" fill="#7d633f"/>` +
    `<rect x="${w * 0.615}" y="${deskY + h * 0.024}" width="${w * 0.02}" height="${h * 0.15}" fill="#7d633f"/>` +
    // task lamp + books + chair
    `<path d="M ${w * 0.42} ${deskY} L ${w * 0.428} ${deskY - h * 0.075} L ${w * 0.465} ${deskY - h * 0.06}" stroke="${BRONZE}" stroke-width="4" fill="none" opacity="0.9"/>` +
    orb(w * 0.468, deskY - h * 0.058, 8, "#f7e3ad", 0.85) +
    `<rect x="${w * 0.55}" y="${deskY - h * 0.02}" width="${w * 0.05}" height="${h * 0.02}" fill="#a9b0a1"/>` +
    `<path d="M ${w * 0.51} ${h * 0.92} C ${w * 0.48} ${h * 0.82}, ${w * 0.48} ${h * 0.78}, ${w * 0.51} ${h * 0.72} C ${w * 0.54} ${h * 0.78}, ${w * 0.54} ${h * 0.82}, ${w * 0.51} ${h * 0.92}" fill="#c9b283"/>` +
    shadow(w * 0.515, h * 0.93, w * 0.045, 10, 0.12) +
    atmosphereLight(w, h);
  return svgDoc(w, h, defs, body);
}

/* ================================================================== POOL */

export function scenePool({ seed = 141 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const horizon = h * 0.48;
  const s = sunHaze(w * 0.5, h * 0.2, h * 0.3, 0.9);
  const defs = defsLight() + daySky("noon") + s.defs + seaDefs() +
    linGrad("poolw", [[0, "#9fd0d2"], [0.5, "#7dbdc2"], [1, "#5da3ab"]]);
  const poolTop = h * 0.6;
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.26, 5) +
    // sea
    `<rect x="0" y="${horizon}" width="${w}" height="${poolTop - horizon}" fill="url(#seag)"/>` +
    `<rect x="0" y="${horizon}" width="${w}" height="3" fill="#fff" opacity="0.6"/>` +
    Array.from({ length: 5 }, (_, i) => {
      const y = horizon + 16 + i * 22;
      const x0 = rand() * w * 0.6;
      return `<line x1="${x0}" y1="${y}" x2="${x0 + w * (0.1 + rand() * 0.3)}" y2="${y}" stroke="#fff" stroke-width="2" opacity="${(0.2 + rand() * 0.2).toFixed(2)}"/>`;
    }).join("") +
    // sail on the horizon
    `<path d="M ${w * 0.78} ${horizon + 22} l 0 -34 l 18 30 z" fill="#fdfaf0" opacity="0.9"/>` +
    // infinity edge
    `<rect x="0" y="${poolTop - 5}" width="${w}" height="7" fill="#fff" opacity="0.75"/>` +
    // pool water
    `<rect x="0" y="${poolTop}" width="${w}" height="${h - poolTop}" fill="url(#poolw)"/>` +
    // sun sparkle net on the water
    Array.from({ length: 16 }, (_, i) => {
      const y = poolTop + 18 + (i * (h - poolTop)) / 16;
      const x0 = w * rand() * 0.5;
      const len = w * (0.15 + rand() * 0.5);
      return `<path d="M ${x0} ${y} q ${len / 4} ${5 + rand() * 8} ${len / 2} 0 t ${len / 2} 0" stroke="#ffffff" stroke-width="${1.5 + rand() * 2}" fill="none" opacity="${(0.2 + rand() * 0.3).toFixed(2)}"/>`;
    }).join("") +
    `<ellipse cx="${w * 0.5}" cy="${poolTop + (h - poolTop) * 0.4}" rx="${w * 0.2}" ry="${h * 0.05}" fill="#fff" opacity="0.14" filter="url(#soft)"/>` +
    // travertine decks with loungers + umbrellas
    `<path d="M0 ${h} L0 ${poolTop + (h - poolTop) * 0.25} L ${w * 0.11} ${poolTop + (h - poolTop) * 0.28} L ${w * 0.17} ${h} Z" fill="#e8dec4"/>` +
    `<path d="M${w} ${h} L${w} ${poolTop + (h - poolTop) * 0.25} L ${w * 0.89} ${poolTop + (h - poolTop) * 0.28} L ${w * 0.83} ${h} Z" fill="#e8dec4"/>` +
    `<g transform="translate(${w * 0.045} ${h * 0.82}) rotate(-8)"><rect width="${w * 0.085}" height="${h * 0.022}" rx="10" fill="#f4ecda"/><rect x="${-w * 0.012}" y="${-h * 0.045}" width="${w * 0.035}" height="${h * 0.05}" rx="10" fill="#e9dfc8"/></g>` +
    `<g transform="translate(${w * 0.87} ${h * 0.82}) rotate(8)"><rect width="${w * 0.085}" height="${h * 0.022}" rx="10" fill="#f4ecda"/><rect x="${w * 0.062}" y="${-h * 0.045}" width="${w * 0.035}" height="${h * 0.05}" rx="10" fill="#e9dfc8"/></g>` +
    // white umbrellas
    `<g transform="translate(${w * 0.1} ${h * 0.7})"><line x1="0" y1="0" x2="0" y2="${h * 0.14}" stroke="#8f7a55" stroke-width="4"/><path d="M -${w * 0.05} 0 Q 0 -${h * 0.05} ${w * 0.05} 0 Z" fill="#faf6ea"/><path d="M -${w * 0.05} 0 Q 0 -${h * 0.05} ${w * 0.05} 0" stroke="${INK}" stroke-width="2" opacity="0.3" fill="none"/></g>` +
    `<g transform="translate(${w * 0.9} ${h * 0.7})"><line x1="0" y1="0" x2="0" y2="${h * 0.14}" stroke="#8f7a55" stroke-width="4"/><path d="M -${w * 0.05} 0 Q 0 -${h * 0.05} ${w * 0.05} 0 Z" fill="#faf6ea"/><path d="M -${w * 0.05} 0 Q 0 -${h * 0.05} ${w * 0.05} 0" stroke="${INK}" stroke-width="2" opacity="0.3" fill="none"/></g>` +
    palm(rand, w * 0.055, poolTop + 6, h * 0.22, "#5d6247", 1) +
    palm(rand, w * 0.95, poolTop + 6, h * 0.2, "#5d6247", -1) +
    atmosphereLight(w, h, { vignette: 0.16 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================ LOUNGE */

export function sceneLounge({ seed = 151 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const horizon = h * 0.56;
  const s = sunHaze(w * 0.5, horizon - h * 0.06, h * 0.34, 1);
  const defs = defsLight() + daySky("golden") + s.defs +
    linGrad("seaGold", [[0, "#d9c49a"], [0.5, "#b3a68f"], [1, "#8f8a76"]]) +
    linGrad("deckg", [[0, "#dcC9a2"], [1, "#c2ab7e"]]);
  // pergola with slat shadows raking the deck
  const pergola =
    hairline(w * 0.1, h * 0.1, w * 0.9, h * 0.1, 0.75, 6, "#6a5539") +
    hairline(w * 0.1, h * 0.1, w * 0.045, h * 0.86, 0.7, 6, "#6a5539") +
    hairline(w * 0.9, h * 0.1, w * 0.955, h * 0.86, 0.7, 6, "#6a5539") +
    Array.from({ length: 8 }, (_, i) => hairline(w * (0.14 + i * 0.105), h * 0.1, w * (0.125 + i * 0.11), h * 0.04, 0.55, 5, "#6a5539")).join("") +
    // raking slat shadows
    Array.from({ length: 8 }, (_, i) =>
      `<path d="M ${w * (0.1 + i * 0.105)} ${h * 0.72} L ${w * (0.16 + i * 0.105)} ${h} L ${w * (0.13 + i * 0.105)} ${h} L ${w * (0.08 + i * 0.105)} ${h * 0.72} Z" fill="#4a3c26" opacity="0.1"/>`,
    ).join("");
  const fireY = h * 0.8;
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.3, 4) +
    // golden sea
    `<rect x="0" y="${horizon}" width="${w}" height="${h * 0.14}" fill="url(#seaGold)"/>` +
    `<rect x="${w * 0.42}" y="${horizon}" width="${w * 0.16}" height="${h * 0.14}" fill="#fdf0c9" opacity="0.6" filter="url(#soft2)"/>` +
    `<rect x="0" y="${horizon}" width="${w}" height="2.5" fill="#fff" opacity="0.55"/>` +
    // teak deck
    `<rect x="0" y="${horizon + h * 0.14}" width="${w}" height="${h - horizon - h * 0.14}" fill="url(#deckg)"/>` +
    Array.from({ length: 6 }, (_, i) => {
      const t = (i + 1) / 7;
      const y = horizon + h * 0.14 + t * (h - horizon - h * 0.14);
      return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${INK}" stroke-width="${1 + t * 2.5}" opacity="0.16"/>`;
    }).join("") +
    pergola +
    // curved linen sofas around the fire table
    shadow(w * 0.5, h * 0.88, w * 0.26, 20, 0.16) +
    `<path d="M ${w * 0.24} ${h * 0.83} A ${w * 0.28} ${h * 0.22} 0 0 1 ${w * 0.76} ${h * 0.83}" stroke="#f1e8d4" stroke-width="${h * 0.075}" fill="none" stroke-linecap="round"/>` +
    `<path d="M ${w * 0.26} ${h * 0.815} A ${w * 0.26} ${h * 0.2} 0 0 1 ${w * 0.74} ${h * 0.815}" stroke="${INK}" stroke-width="2" fill="none" opacity="0.2"/>` +
    // cushions along the curve
    [0.32, 0.42, 0.58, 0.68].map((t) => `<rect x="${w * t - 26}" y="${h * (0.79 - Math.abs(t - 0.5) * 0.12)}" width="52" height="26" rx="9" fill="${t < 0.5 ? "#c2b391" : "#a9b0a1"}"/>`).join("") +
    // stone fire table with low flame
    `<ellipse cx="${w * 0.5}" cy="${fireY + h * 0.045}" rx="${w * 0.055}" ry="${h * 0.02}" fill="#d6c9ab"/>` +
    `<rect x="${w * 0.445}" y="${fireY}" width="${w * 0.11}" height="${h * 0.045}" rx="10" fill="#e3d8bf"/>` +
    `<path d="M ${w * 0.49} ${fireY} C ${w * 0.485} ${fireY - h * 0.03}, ${w * 0.5} ${fireY - h * 0.035}, ${w * 0.5} ${fireY - h * 0.055} C ${w * 0.503} ${fireY - h * 0.028}, ${w * 0.514} ${fireY - h * 0.02}, ${w * 0.51} ${fireY} Z" fill="#e8963f" opacity="0.9"/>` +
    `<circle cx="${w * 0.5}" cy="${fireY - h * 0.02}" r="${h * 0.07}" fill="#f7c877" opacity="0.25" filter="url(#soft)"/>` +
    // olive pots at the corners
    olive(rand, w * 0.08, h * 0.86, h * 0.17) +
    olive(rand, w * 0.92, h * 0.86, h * 0.17) +
    atmosphereLight(w, h, { vignette: 0.2 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================ AERIAL */

export function sceneAerial({ seed = 161 } = {}) {
  const w = W, h = H;
  const rand = mulberry32(seed);
  const horizon = h * 0.36;
  const s = sunHaze(w * 0.5, horizon - h * 0.04, h * 0.4, 0.9);
  const defs = defsLight() + daySky("morning") + s.defs +
    linGrad("seaA", [[0, "#9ec6cb"], [0.4, "#7db3ba"], [1, "#5d9aa3"]]) +
    linGrad("landA", [[0, "#d9cba3"], [1, "#c9b283"]]);
  const coast = `M 0 ${h * 0.76} C ${w * 0.22} ${h * 0.6}, ${w * 0.38} ${h * 0.84}, ${w * 0.58} ${h * 0.72} C ${w * 0.74} ${h * 0.63}, ${w * 0.86} ${h * 0.76}, ${w} ${h * 0.68} L ${w} ${h} L 0 ${h} Z`;
  // scattered estates + greenery on the land
  let estates = "";
  const er = mulberry32(seed + 6);
  for (let i = 0; i < 34; i++) {
    const x = er() * w;
    const y = h * 0.8 + er() * h * 0.16;
    if (er() < 0.55) {
      estates += `<rect x="${x}" y="${y}" width="${10 + er() * 22}" height="${8 + er() * 14}" fill="#f4ecda" opacity="0.95"/>` +
        `<rect x="${x}" y="${y}" width="${10 + er() * 22}" height="3" fill="${INK}" opacity="0.3"/>`;
    } else {
      estates += `<circle cx="${x}" cy="${y}" r="${6 + er() * 14}" fill="${er() < 0.5 ? OLIVE : SAGE}" opacity="0.8"/>`;
    }
  }
  const ex = w * 0.62, ey = h * 0.84;
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.2, 6) +
    // haze bands
    `<ellipse cx="${w * 0.3}" cy="${h * 0.28}" rx="${w * 0.24}" ry="${h * 0.02}" fill="#fff" opacity="0.35" filter="url(#soft)"/>` +
    `<ellipse cx="${w * 0.72}" cy="${h * 0.22}" rx="${w * 0.28}" ry="${h * 0.018}" fill="#fff" opacity="0.3" filter="url(#soft)"/>` +
    // turquoise sea with sun path
    `<rect x="0" y="${horizon}" width="${w}" height="${h * 0.48}" fill="url(#seaA)"/>` +
    `<rect x="0" y="${horizon}" width="${w}" height="3" fill="#fff" opacity="0.5"/>` +
    `<path d="M ${w * 0.46} ${horizon} L ${w * 0.54} ${horizon} L ${w * 0.6} ${h * 0.8} L ${w * 0.4} ${h * 0.8} Z" fill="#fdf3d2" opacity="0.4" filter="url(#soft)"/>` +
    Array.from({ length: 12 }, (_, i) => {
      const y = horizon + 24 + (i * h * 0.36) / 12;
      const x0 = rand() * w * 0.7;
      return `<path d="M ${x0} ${y} q ${w * 0.06} 8 ${w * 0.12} 0 t ${w * 0.12} 0" stroke="#fff" stroke-width="2" fill="none" opacity="${(0.16 + rand() * 0.2).toFixed(2)}"/>`;
    }).join("") +
    // white wake of a yacht
    `<path d="M ${w * 0.3} ${h * 0.56} q ${w * 0.02} 4 ${w * 0.05} 3 l ${w * 0.05} -1" stroke="#fff" stroke-width="5" fill="none" opacity="0.7"/>` +
    `<rect x="${w * 0.395}" y="${h * 0.548}" width="26" height="9" rx="4" fill="#fdfaf0"/>` +
    // golden coastline with surf line
    `<path d="${coast}" fill="url(#landA)"/>` +
    `<path d="M 0 ${h * 0.76} C ${w * 0.22} ${h * 0.6}, ${w * 0.38} ${h * 0.84}, ${w * 0.58} ${h * 0.72} C ${w * 0.74} ${h * 0.63}, ${w * 0.86} ${h * 0.76}, ${w} ${h * 0.68}" stroke="#fff" stroke-width="7" fill="none" opacity="0.75"/>` +
    estates +
    // the featured estate: courtyard plan + turquoise pool
    `<g transform="translate(${ex} ${ey}) rotate(-6)">` +
    `<rect x="${-w * 0.05}" y="${-h * 0.02}" width="${w * 0.1}" height="${h * 0.045}" fill="#faf6ea"/>` +
    hairRect(-w * 0.05, -h * 0.02, w * 0.1, h * 0.045, 0.7, 3, INK) +
    `<rect x="${-w * 0.028}" y="${-h * 0.048}" width="${w * 0.075}" height="${h * 0.028}" fill="#f1e8d4"/>` +
    hairRect(-w * 0.028, -h * 0.048, w * 0.075, h * 0.028, 0.6, 2.5, INK) +
    `<rect x="${w * 0.055}" y="${-h * 0.012}" width="${w * 0.03}" height="${h * 0.028}" fill="#6fc2c9"/>` +
    hairRect(w * 0.055, -h * 0.012, w * 0.03, h * 0.028, 0.5, 2, INK) +
    `<circle cx="${-w * 0.062}" cy="${h * 0.008}" r="9" fill="${OLIVE}"/>` +
    `<circle cx="${-w * 0.066}" cy="${-h * 0.028}" r="7" fill="${SAGE}"/>` +
    `</g>` +
    atmosphereLight(w, h, { vignette: 0.14 });
  return svgDoc(w, h, defs, body);
}

/* ===================================================== PROJECT CARD ART */

export function projectTower({ w = 1400, h = 1750, seed = 201, mood = "morning" } = {}) {
  const rand = mulberry32(seed);
  const s = sunHaze(w * 0.72, h * 0.24, h * 0.26, 0.85);
  const defs = defsLight() + daySky(mood === "blue" ? "noon" : mood) + s.defs + glassDefs() +
    reflectionDefs(h * 0.9, h * 0.12);
  const tw = w * 0.34, tx = w * 0.33, ty = h * 0.14, th = h * 0.76;
  const tower =
    `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="url(#glassg)"/>` +
    // sun streak across the curtain wall
    `<path d="M ${tx + tw * 0.1} ${ty + th} L ${tx + tw * 0.55} ${ty} L ${tx + tw * 0.75} ${ty} L ${tx + tw * 0.3} ${ty + th} Z" fill="#fdf4d8" opacity="0.4"/>` +
    // balcony bands
    Array.from({ length: 21 }, (_, i) => hairline(tx, ty + (th / 21) * (i + 1), tx + tw, ty + (th / 21) * (i + 1), 0.4, 2.5, INK)).join("") +
    hairline(tx + tw * 0.5, ty, tx + tw * 0.5, ty + th, 0.35, 2.5, INK) +
    hairRect(tx, ty, tw, th, 0.7, 4, INK) +
    // stone crown + fins
    volume(tx + tw * 0.2, ty - h * 0.035, tw * 0.6, h * 0.035, { face: STONE_LIGHT }) +
    `<rect x="${tx - w * 0.014}" y="${ty + th * 0.06}" width="${w * 0.014}" height="${th * 0.94}" fill="${STONE_MID}"/>` +
    `<rect x="${tx + tw}" y="${ty + th * 0.06}" width="${w * 0.014}" height="${th * 0.94}" fill="${STONE_MID}"/>`;
  const wings =
    volume(tx - w * 0.16, h * 0.62, w * 0.17, h * 0.28, { face: STONE_LIGHT }) +
    glassBand(rand, tx - w * 0.15, h * 0.65, w * 0.15, h * 0.08, 3, { streak: false }) +
    volume(tx + tw - w * 0.01, h * 0.68, w * 0.17, h * 0.22, { face: STONE_MID }) +
    glassBand(rand, tx + tw, h * 0.71, w * 0.15, h * 0.06, 3, { streak: false });
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.3, 4) +
    tower + wings +
    palm(rand, w * 0.12, h * 0.9, h * 0.14, "#5d6247", 1) +
    palm(rand, w * 0.88, h * 0.9, h * 0.13, "#5d6247", -1) +
    `<rect x="0" y="${h * 0.9}" width="${w}" height="${h * 0.1}" fill="#c3d4d4"/>` +
    reflection(tower, h * 0.9, h * 0.12, 0.25) +
    `<rect x="0" y="${h * 0.9}" width="${w}" height="3" fill="#fff" opacity="0.6"/>` +
    atmosphereLight(w, h, { vignette: 0.18 });
  return svgDoc(w, h, defs, body);
}

export function projectCourtyard({ w = 1400, h = 1750, seed = 211 } = {}) {
  const rand = mulberry32(seed);
  const s = sunHaze(w * 0.74, h * 0.13, h * 0.18, 0.9);
  const defs = defsLight() + daySky("morning") + s.defs + glassDefs() +
    linGrad("waterC", [[0, "#a9d2d4"], [1, "#6fb0b8"]]);
  const cy2 = h * 0.52;
  const villa =
    volume(w * 0.08, cy2 - h * 0.125, w * 0.84, h * 0.125, { face: STONE_LIGHT }) +
    glassBand(rand, w * 0.1, cy2 - h * 0.108, w * 0.8, h * 0.09, 7) +
    volume(w * 0.3, cy2 - h * 0.22, w * 0.4, h * 0.095, { face: STONE_MID }) +
    glassBand(rand, w * 0.315, cy2 - h * 0.203, w * 0.37, h * 0.06, 4, { streak: false });
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.3, 3) +
    villa +
    olive(rand, w * 0.06, cy2, h * 0.13) +
    olive(rand, w * 0.94, cy2, h * 0.12) +
    cypress(w * 0.16, cy2, h * 0.13, w * 0.026, "#5d6247") +
    cypress(w * 0.84, cy2, h * 0.11, w * 0.024, "#5d6247") +
    // courtyard reflecting pool leading to the entry
    `<rect x="0" y="${cy2}" width="${w}" height="${h - cy2}" fill="url(#waterC)"/>` +
    `<rect x="0" y="${cy2}" width="${w}" height="3" fill="#fff" opacity="0.65"/>` +
    Array.from({ length: 8 }, (_, i) => {
      const t = (i + 1) / 9;
      const y = cy2 + t * (h - cy2);
      return `<line x1="${w * (0.5 - 0.42 * t)}" y1="${y}" x2="${w * (0.5 + 0.42 * t)}" y2="${y}" stroke="#fff" stroke-width="2" opacity="${(0.3 - t * 0.2).toFixed(2)}"/>`;
    }).join("") +
    // floating stone steps
    Array.from({ length: 5 }, (_, i) => {
      const t = (i + 0.5) / 5;
      const y = cy2 + Math.pow(t, 1.6) * (h - cy2) * 0.92;
      const sw2 = w * (0.05 + t * 0.13);
      return shadow(w * 0.5, y + 12 + t * 10, sw2 * 0.7, 8 + t * 8, 0.14) +
        `<rect x="${w * 0.5 - sw2 / 2}" y="${y}" width="${sw2}" height="${9 + t * 15}" rx="5" fill="#f0e9da"/>` +
        hairline(w * 0.5 - sw2 / 2, y, w * 0.5 + sw2 / 2, y, 0.4, 2, INK);
    }).join("") +
    atmosphereLight(w, h, { vignette: 0.18 });
  return svgDoc(w, h, defs, body);
}

export function projectCliff({ w = 1400, h = 1750, seed = 221 } = {}) {
  const rand = mulberry32(seed);
  const horizon = h * 0.44;
  const s = sunHaze(w * 0.32, h * 0.2, h * 0.26, 0.9);
  const defs = defsLight() + daySky("noon") + s.defs + glassDefs() + seaDefs();
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.28, 4) +
    `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#seag)"/>` +
    `<rect x="0" y="${horizon}" width="${w}" height="3" fill="#fff" opacity="0.6"/>` +
    Array.from({ length: 10 }, (_, i) => {
      const y = horizon + 30 + i * (h - horizon) * 0.06;
      const x0 = rand() * w * 0.5;
      return `<path d="M ${x0} ${y} q ${w * 0.08} 9 ${w * 0.16} 0 t ${w * 0.16} 0" stroke="#fff" stroke-width="2" fill="none" opacity="${(0.14 + rand() * 0.16).toFixed(2)}"/>`;
    }).join("") +
    // limestone cliff from the right
    `<path d="M ${w} ${h * 0.3} C ${w * 0.8} ${h * 0.38}, ${w * 0.72} ${h * 0.52}, ${w * 0.66} ${h} L ${w} ${h} Z" fill="#d9cba3"/>` +
    `<path d="M ${w} ${h * 0.3} C ${w * 0.8} ${h * 0.38}, ${w * 0.72} ${h * 0.52}, ${w * 0.66} ${h}" stroke="${INK}" stroke-width="3" opacity="0.3" fill="none"/>` +
    `<path d="M ${w * 0.7} ${h * 0.62} C ${w * 0.76} ${h * 0.6}, ${w * 0.8} ${h * 0.66}, ${w * 0.86} ${h * 0.64} L ${w} ${h * 0.7} L ${w} ${h} L ${w * 0.68} ${h} Z" fill="#c9b283" opacity="0.8"/>` +
    // cantilevered white villa
    shadow(w * 0.73, h * 0.395, w * 0.2, 12, 0.2) +
    volume(w * 0.52, h * 0.315, w * 0.42, h * 0.062, { face: "#faf6ea" }) +
    glassBand(rand, w * 0.535, h * 0.325, w * 0.39, h * 0.042, 6) +
    volume(w * 0.6, h * 0.245, w * 0.28, h * 0.055, { face: STONE_LIGHT }) +
    glassBand(rand, w * 0.613, h * 0.254, w * 0.255, h * 0.037, 4, { streak: false }) +
    // glass-edge pool on the cliff lip
    `<rect x="${w * 0.545}" y="${h * 0.378}" width="${w * 0.2}" height="${h * 0.014}" fill="#6fc2c9"/>` +
    `<rect x="${w * 0.545}" y="${h * 0.378}" width="${w * 0.2}" height="3" fill="#fff" opacity="0.7"/>` +
    cypress(w * 0.96, h * 0.31, h * 0.09, w * 0.02, "#5d6247") +
    olive(rand, w * 0.905, h * 0.315, h * 0.075, "#6b7152") +
    atmosphereLight(w, h, { vignette: 0.16 });
  return svgDoc(w, h, defs, body);
}

/* ============================================================== SKYLINE */

export function skylineWide({ w = 2560, h = 1200, seed = 301 } = {}) {
  const rand = mulberry32(seed);
  const horizon = h * 0.78;
  const s = sunHaze(w * 0.5, h * 0.24, h * 0.34, 0.9);
  const defs = defsLight() + daySky("morning") + s.defs + reflectionDefs(horizon, h * 0.22);
  let back = "";
  const br = mulberry32(seed + 2);
  for (let i = 0; i < 12; i++) {
    const tw = w * (0.04 + br() * 0.05);
    const tx = (i / 12) * w + br() * w * 0.03;
    const th = h * (0.14 + br() * 0.3);
    back += `<rect x="${tx}" y="${horizon - th}" width="${tw}" height="${th}" fill="#b9c6c9" opacity="0.55"/>`;
  }
  let towers = "";
  const tr = mulberry32(seed + 1);
  const n = 13;
  for (let i = 0; i < n; i++) {
    const tw = w * (0.032 + tr() * 0.05);
    const tx = (i / n) * w + tr() * w * 0.02;
    const th = h * (0.18 + tr() * 0.42) * (1 - Math.abs(i / n - 0.5) * 0.45);
    const ty = horizon - th;
    towers += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="${i % 2 ? "#dfe5e2" : "#e9e2cf"}"/>` +
      `<path d="M ${tx + tw * 0.15} ${ty + th} L ${tx + tw * 0.5} ${ty} L ${tx + tw * 0.7} ${ty} L ${tx + tw * 0.35} ${ty + th} Z" fill="#fdf4d8" opacity="0.35"/>` +
      Array.from({ length: Math.max(3, Math.round(th / 90)) }, (_, r) => hairline(tx, ty + ((r + 1) * th) / Math.max(3, Math.round(th / 90)), tx + tw, ty + ((r + 1) * th) / Math.max(3, Math.round(th / 90)), 0.25, 2, INK)).join("") +
      hairRect(tx, ty, tw, th, 0.45, 2.5, INK);
  }
  const cx = w * 0.53;
  towers += `<path d="M ${cx - w * 0.02} ${horizon} L ${cx - w * 0.006} ${h * 0.14} L ${cx} ${h * 0.08} L ${cx + w * 0.006} ${h * 0.14} L ${cx + w * 0.02} ${horizon} Z" fill="#e9e2cf"/>` +
    hairline(cx - w * 0.006, h * 0.14, cx - w * 0.02, horizon, 0.4, 2.5, INK) +
    hairline(cx + w * 0.006, h * 0.14, cx + w * 0.02, horizon, 0.4, 2.5, INK);
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.32, 6) +
    `<rect x="0" y="${horizon - h * 0.16}" width="${w}" height="${h * 0.16}" fill="#f4ead0" opacity="0.4" filter="url(#soft)"/>` +
    back + towers +
    `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="#b9d2d2"/>` +
    reflection(towers, horizon, h * 0.22, 0.22) +
    `<rect x="0" y="${horizon}" width="${w}" height="3" fill="#fff" opacity="0.6"/>` +
    atmosphereLight(w, h, { vignette: 0.14 });
  return svgDoc(w, h, defs, body);
}

/* ================================================================ ABOUT */

export function aboutDetail({ w = 1600, h = 2000, seed = 311 } = {}) {
  const rand = mulberry32(seed);
  const s = sunHaze(w * 0.72, h * 0.24, h * 0.24, 0.95);
  const defs = defsLight() + daySky("morning") + s.defs;
  // floating brass stair between white planes
  let steps = "";
  for (let i = 0; i < 15; i++) {
    const t = i / 15;
    const a = -0.4 + t * 2.2;
    const r = w * 0.16 + t * w * 0.26;
    const x = w * 0.36 + Math.cos(a) * r * 0.7;
    const y = h * 0.6 + Math.sin(a) * r * 0.42 + t * h * 0.1;
    steps +=
      `<rect x="${x}" y="${y - 8}" width="${w * 0.11 * (1 - t * 0.4)}" height="14" rx="4" fill="#efe8d6" opacity="${1 - t * 0.25}"/>` +
      `<line x1="${x}" y1="${y + 6}" x2="${x + w * 0.11 * (1 - t * 0.4)}" y2="${y + 6}" stroke="${BRONZE}" stroke-width="${3.5 - t * 1.5}" opacity="${(0.85 - t * 0.4).toFixed(2)}"/>`;
  }
  const body =
    `<rect width="${w}" height="${h}" fill="url(#sky)"/>` + s.body +
    birds(rand, w, h * 0.24, 4) +
    // intersecting white stone planes
    `<path d="M 0 ${h * 0.2} L ${w * 0.62} ${h * 0.34} L ${w * 0.62} ${h} L 0 ${h} Z" fill="#f2ecdd"/>` +
    `<path d="M ${w} ${h * 0.44} L ${w * 0.44} ${h * 0.56} L ${w * 0.44} ${h} L ${w} ${h} Z" fill="#e2d7bf" opacity="0.96"/>` +
    hairline(0, h * 0.2, w * 0.62, h * 0.34, 0.6, 4, INK) +
    hairline(w, h * 0.44, w * 0.44, h * 0.56, 0.55, 3.5, INK) +
    hairline(w * 0.62, h * 0.34, w * 0.62, h, 0.35, 2.5, INK) +
    // slit of sunlight between the planes
    `<path d="M ${w * 0.62} ${h * 0.34} L ${w * 0.66} ${h * 0.35} L ${w * 0.66} ${h} L ${w * 0.62} ${h} Z" fill="#fdf2cd" opacity="0.85"/>` +
    steps +
    shadow(w * 0.5, h * 0.94, w * 0.3, 24, 0.12) +
    atmosphereLight(w, h, { vignette: 0.16 });
  return svgDoc(w, h, defs, body);
}

/* ============================================================= FLOORPLAN */

export function floorplan({ w = 1800, h = 1300, seed = 321 } = {}) {
  void seed;
  const defs = defsLight() +
    linGrad("planbg", [[0, "#f7f2e6"], [1, "#efe8d6"]]);
  const L = (x1, y1, x2, y2, o = 0.85, sw = 3) => hairline(x1, y1, x2, y2, o, sw, INK);
  const room = (x, y, rw, rh) => hairRect(x, y, rw, rh, 0.6, 2.5, INK);
  const mx = w * 0.12, my = h * 0.14;
  const body =
    `<rect width="${w}" height="${h}" fill="url(#planbg)"/>` +
    Array.from({ length: 22 }, (_, i) => `<line x1="${(i * w) / 22}" y1="0" x2="${(i * w) / 22}" y2="${h}" stroke="${INK}" stroke-width="1" opacity="0.05"/>`).join("") +
    Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${(i * h) / 16}" x2="${w}" y2="${(i * h) / 16}" stroke="${INK}" stroke-width="1" opacity="0.05"/>`).join("") +
    hairRect(mx, my, w * 0.76, h * 0.72, 0.9, 5, INK) +
    room(mx, my, w * 0.34, h * 0.42) +
    room(mx + w * 0.34, my, w * 0.2, h * 0.28) +
    room(mx + w * 0.54, my, w * 0.22, h * 0.42) +
    room(mx, my + h * 0.42, w * 0.24, h * 0.3) +
    room(mx + w * 0.24, my + h * 0.42, w * 0.3, h * 0.3) +
    room(mx + w * 0.54, my + h * 0.42, w * 0.22, h * 0.3) +
    // pool wing in turquoise wash
    `<rect x="${mx + w * 0.585}" y="${my + h * 0.47}" width="${w * 0.15}" height="${h * 0.2}" fill="#8fd0d4" opacity="0.55"/>` +
    hairRect(mx + w * 0.585, my + h * 0.47, w * 0.15, h * 0.2, 0.7, 2.5, INK) +
    // garden wash along the west wing
    `<rect x="${mx + w * 0.015}" y="${my + h * 0.45}" width="${w * 0.06}" height="${h * 0.24}" fill="#a9c0930" opacity="0"/>` +
    `<circle cx="${mx + w * 0.05}" cy="${my + h * 0.52}" r="${h * 0.03}" fill="${SAGE}" opacity="0.5"/>` +
    `<circle cx="${mx + w * 0.04}" cy="${my + h * 0.62}" r="${h * 0.024}" fill="${OLIVE}" opacity="0.5"/>` +
    // furniture hints in bronze
    `<circle cx="${mx + w * 0.17}" cy="${my + h * 0.2}" r="${h * 0.052}" fill="none" stroke="${BRONZE}" stroke-width="2.5" opacity="0.75"/>` +
    hairRect(mx + w * 0.06, my + h * 0.5, w * 0.13, h * 0.14, 0.7, 2, BRONZE) +
    hairRect(mx + w * 0.37, my + h * 0.05, w * 0.14, h * 0.05, 0.7, 2, BRONZE) +
    hairRect(mx + w * 0.29, my + h * 0.5, w * 0.2, h * 0.06, 0.7, 2, BRONZE) +
    // door arcs
    `<path d="M ${mx + w * 0.34} ${my + h * 0.34} A ${w * 0.05} ${w * 0.05} 0 0 1 ${mx + w * 0.29} ${my + h * 0.30}" stroke="${BRONZE}" stroke-width="2" fill="none" opacity="0.8"/>` +
    `<path d="M ${mx + w * 0.54} ${my + h * 0.52} A ${w * 0.05} ${w * 0.05} 0 0 0 ${mx + w * 0.59} ${my + h * 0.48}" stroke="${BRONZE}" stroke-width="2" fill="none" opacity="0.8"/>` +
    // dimension ticks
    L(mx, my - 40, mx + w * 0.76, my - 40, 0.4, 1.5) +
    L(mx, my - 52, mx, my - 28, 0.4, 1.5) +
    L(mx + w * 0.76, my - 52, mx + w * 0.76, my - 28, 0.4, 1.5) +
    L(mx - 40, my, mx - 40, my + h * 0.72, 0.4, 1.5) +
    L(mx - 52, my, mx - 28, my, 0.4, 1.5) +
    L(mx - 52, my + h * 0.72, mx - 28, my + h * 0.72, 0.4, 1.5) +
    // north arrow
    `<g transform="translate(${w * 0.92} ${h * 0.88})"><circle r="34" fill="none" stroke="${BRONZE}" stroke-width="2.5" opacity="0.75"/><path d="M0 -22 L8 10 L0 4 L-8 10 Z" fill="${BRONZE}" opacity="0.9"/></g>` +
    `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.03"/>`;
  return svgDoc(w, h, defs, body);
}
