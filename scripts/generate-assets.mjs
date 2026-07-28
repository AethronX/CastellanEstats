/**
 * Renders every procedural scene to optimized WebP (plus a tiny blur
 * placeholder) and writes a manifest consumed by the app.
 *
 *   npm run generate:assets
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  sceneExterior, sceneApproach, sceneDoor, sceneLobby, sceneHallway,
  sceneLiving, sceneKitchen, sceneDining, sceneBedroom, sceneCloset,
  sceneBathroom, sceneCinema, sceneOffice, scenePool, sceneLounge,
  sceneAerial, projectTower, projectCourtyard, projectCliff,
  skylineWide, aboutDetail, floorplan,
} from "./scenes.mjs";

const OUT = path.resolve("public/images");
const MANIFEST = path.resolve("src/data/image-manifest.json");

/** name -> { svg, width, quality } */
const jobs = {
  // — cinematic walkthrough, in narrative order —
  "journey/01-exterior": { svg: sceneExterior(), q: 74 },
  "journey/02-approach": { svg: sceneApproach(), q: 74 },
  "journey/03-door": { svg: sceneDoor(), q: 74 },
  "journey/04-lobby": { svg: sceneLobby(), q: 74 },
  "journey/05-hallway": { svg: sceneHallway(), q: 74 },
  "journey/06-living": { svg: sceneLiving(), q: 74 },
  "journey/07-kitchen": { svg: sceneKitchen(), q: 74 },
  "journey/08-dining": { svg: sceneDining(), q: 74 },
  "journey/09-bedroom": { svg: sceneBedroom(), q: 74 },
  "journey/10-closet": { svg: sceneCloset(), q: 74 },
  "journey/11-bathroom": { svg: sceneBathroom(), q: 74 },
  "journey/12-cinema": { svg: sceneCinema(), q: 74 },
  "journey/13-office": { svg: sceneOffice(), q: 74 },
  "journey/14-pool": { svg: scenePool(), q: 74 },
  "journey/15-lounge": { svg: sceneLounge(), q: 74 },
  "journey/16-aerial": { svg: sceneAerial(), q: 74 },

  // — hero (its own grade so it can differ from journey frame 1) —
  "hero": { svg: sceneExterior({ seed: 7, closeness: 0.06 }), q: 78 },

  // — featured projects —
  "projects/aurelia-tower": { svg: projectTower({ seed: 201 }), q: 74 },
  "projects/serena-courtyard": { svg: projectCourtyard({ seed: 211 }), q: 74 },
  "projects/meridian-cliff": { svg: projectCliff({ seed: 221 }), q: 74 },
  "projects/lumen-tower": { svg: projectTower({ seed: 231, mood: "blue" }), q: 74 },
  "projects/vela-courtyard": { svg: projectCourtyard({ seed: 241 }), q: 74 },
  "projects/solace-cliff": { svg: projectCliff({ seed: 251 }), q: 74 },

  // — sections —
  "sections/skyline": { svg: skylineWide(), q: 74 },
  "sections/about": { svg: aboutDetail(), q: 74 },
  "sections/floorplan": { svg: floorplan(), q: 78 },
};

async function renderJob(name, { svg, q }) {
  const file = path.join(OUT, `${name}.webp`);
  await mkdir(path.dirname(file), { recursive: true });
  const buf = Buffer.from(svg);
  const img = sharp(buf, { density: 96 });
  const meta = await img.metadata();
  await sharp(buf).webp({ quality: q, effort: 5 }).toFile(file);
  // 24px blur placeholder
  const tiny = await sharp(buf)
    .resize(24)
    .blur(1.5)
    .webp({ quality: 40 })
    .toBuffer();
  return {
    name,
    src: `/images/${name}.webp`,
    width: meta.width,
    height: meta.height,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
}

const manifest = {};
for (const [name, job] of Object.entries(jobs)) {
  const entry = await renderJob(name, job);
  manifest[name] = entry;
  console.log(`✓ ${name}  ${entry.width}x${entry.height}`);
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`\nmanifest → ${MANIFEST}`);
