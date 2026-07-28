import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";

const BASE_URL = "https://maharat-pearl.vercel.app";
const OUT = path.resolve("public/images");
const MANIFEST = path.resolve("src/data/image-manifest.json");

const assetsToDownload = {
  hero: `${BASE_URL}/media/hero-upload-poster.jpg`,
  "sections/about": `${BASE_URL}/assets/about-D1FQ51xG.jpg`,
  "sections/skyline": `${BASE_URL}/media/og-image.jpg`,
  "sections/floorplan": `${BASE_URL}/assets/story-1-BrjkmURE.jpg`,
  
  // Projects
  "projects/aurelia-tower": `${BASE_URL}/assets/property-apartment-DJR1HXww.jpg`,
  "projects/serena-courtyard": `${BASE_URL}/assets/property-mountain-CaO-yXyD.jpg`,
  "projects/meridian-cliff": `${BASE_URL}/assets/property-beachfront-CzvbexrF.jpg`,
  "projects/lumen-tower": `${BASE_URL}/assets/property-investment-rUqOabYU.jpg`,
  "projects/vela-courtyard": `${BASE_URL}/assets/story-2-CBduYGQZ.jpg`,
  "projects/solace-cliff": `${BASE_URL}/assets/story-3-BBpNAprx.jpg`,
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
  console.log("Downloading and processing Maharat Pearl images from https://maharat-pearl.vercel.app...");
  
  let manifest = {};
  if (fs.existsSync(MANIFEST)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
    } catch (e) {
      manifest = {};
    }
  }

  for (const [name, url] of Object.entries(assetsToDownload)) {
    try {
      console.log(`Fetching ${name} from ${url}...`);
      const buf = await fetchBuffer(url);
      const entry = await processImage(name, buf);
      manifest[name] = entry;
      console.log(`✓ Updated [${name}] -> ${entry.width}x${entry.height}`);
    } catch (err) {
      console.error(`❌ Failed to process ${name}:`, err.message);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\nImage manifest updated at ${MANIFEST}`);
}

main().catch(console.error);
