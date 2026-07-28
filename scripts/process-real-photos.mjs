import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";

const OUT = path.resolve("public/images");
const MANIFEST = path.resolve("src/data/image-manifest.json");

/* 100% photorealistic luxury real estate photography in Oman */
const localGenerated = {
  hero: "/src/assets/images/oman_real_hero_1785247111269.jpg",
  "projects/aurelia-tower": "/src/assets/images/oman_real_almouj_1785247127076.jpg",
  "projects/serena-courtyard": "/src/assets/images/oman_real_jebel_1785247141731.jpg",
  "projects/meridian-cliff": "/src/assets/images/oman_real_jissah_1785247155042.jpg",
  "projects/lumen-tower": "/src/assets/images/oman_real_shatti_1785247170814.jpg",
  "projects/vela-courtyard": "/src/assets/images/oman_real_salalah_1785247186195.jpg",
  "projects/solace-cliff": "/src/assets/images/oman_real_musandam_1785247200280.jpg",
  "sections/skyline": "/src/assets/images/oman_real_skyline_1785247216117.jpg",
  "sections/about": "/src/assets/images/oman_real_about_1785247230270.jpg",
  "sections/floorplan": "/src/assets/images/oman_floorplan_1785245977791.jpg",
};

/* Real photography for journey scenes */
const unsplashRealPhotos = {
  "journey/01-exterior": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=85",
  "journey/02-approach": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
  "journey/03-door": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85",
  "journey/04-lobby": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85",
  "journey/05-hallway": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85",
  "journey/06-living": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=85",
  "journey/07-kitchen": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=85",
  "journey/08-dining": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=2400&q=85",
  "journey/09-bedroom": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=85",
  "journey/10-closet": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=2400&q=85",
  "journey/11-bathroom": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2400&q=85",
  "journey/12-cinema": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2400&q=85",
  "journey/13-office": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2400&q=85",
  "journey/14-pool": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2400&q=85",
  "journey/15-lounge": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85",
  "journey/16-aerial": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85",
};

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function processImage(name, buffer) {
  const file = path.join(OUT, `${name}.webp`);
  await mkdir(path.dirname(file), { recursive: true });

  const img = sharp(buffer);
  const meta = await img.metadata();

  const targetWidth = Math.min(meta.width || 2400, 2400);
  
  await img
    .resize(targetWidth, null, { withoutEnlargement: true })
    .webp({ quality: 85, effort: 4 })
    .toFile(file);

  const tiny = await sharp(buffer)
    .resize(24)
    .blur(1.5)
    .webp({ quality: 30 })
    .toBuffer();

  const finalMeta = await sharp(file).metadata();

  return {
    name,
    src: `/images/${name}.webp`,
    width: finalMeta.width,
    height: finalMeta.height,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
}

async function main() {
  console.log("Processing 100% photorealistic real estate photography...");
  const manifest = {};

  for (const [name, relPath] of Object.entries(localGenerated)) {
    const fullPath = path.resolve("." + relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`File missing: ${fullPath}`);
      continue;
    }
    const buf = fs.readFileSync(fullPath);
    const entry = await processImage(name, buf);
    manifest[name] = entry;
    console.log(`✓ [Real Estate Photo] ${name} -> ${entry.width}x${entry.height}`);
  }

  for (const [name, url] of Object.entries(unsplashRealPhotos)) {
    try {
      const buf = await fetchBuffer(url);
      const entry = await processImage(name, buf);
      manifest[name] = entry;
      console.log(`✓ [Journey Real Photo] ${name} -> ${entry.width}x${entry.height}`);
    } catch (err) {
      console.error(`Error processing ${name}:`, err.message);
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest updated successfully at ${MANIFEST}`);
}

main().catch(console.error);
