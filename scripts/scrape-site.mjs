import fs from "node:fs";

async function main() {
  const url = "https://maharat-pearl.vercel.app";
  console.log("Fetching:", url);
  const res = await fetch(url);
  const html = await res.text();
  console.log("HTML length:", html.length);

  // Write HTML to inspect if needed
  fs.writeFileSync("scraped_page.html", html);

  // Find all image URLs or media files
  const regex = /https?:\/\/[^\s"'<>\(\)]+\.(?:png|jpg|jpeg|webp|avif|svg)/gi;
  const matches = [...html.matchAll(regex)].map(m => m[0]);
  
  // Also look for relative paths /_next/image or /images/ or relative image extensions
  const relativeRegex = /["'](\/[^"'\s]+\.(?:png|jpg|jpeg|webp|avif|svg)(\?[^"']*)?)["']/gi;
  const relMatches = [...html.matchAll(relativeRegex)].map(m => m[1]);

  // Next image optimizer URLs
  const nextImgRegex = /["'](\/_next\/image\?url=[^"'\s]+)["']/gi;
  const nextImgMatches = [...html.matchAll(nextImgRegex)].map(m => m[1]);

  console.log("Absolute Image URLs:", [...new Set(matches)]);
  console.log("Relative Image URLs:", [...new Set(relMatches)]);
  console.log("Next Image URLs:", [...new Set(nextImgMatches)]);

  // Let's also check JS bundle files if images are imported in JS
  const jsBundles = [...html.matchAll(/src=["'](\/_next\/static\/chunks\/[^"']+\.js)["']/gi)].map(m => m[1]);
  console.log("JS Bundles count:", jsBundles.length);

  for (const jsPath of jsBundles) {
    try {
      const jsUrl = url + jsPath;
      const jsRes = await fetch(jsUrl);
      const jsText = await jsRes.text();
      const jsImages = [...jsText.matchAll(/static\/media\/[^"'\s\)]+\.(?:png|jpg|jpeg|webp|avif|svg)/gi)].map(m => m[0]);
      if (jsImages.length > 0) {
        console.log(`Images found in ${jsPath}:`, [...new Set(jsImages)]);
      }
      const jsHttpImgs = [...jsText.matchAll(/https?:\/\/[^"'\s\)]+\.(?:png|jpg|jpeg|webp|avif|svg)/gi)].map(m => m[0]);
      if (jsHttpImgs.length > 0) {
        console.log(`HTTP Images in ${jsPath}:`, [...new Set(jsHttpImgs)]);
      }
      const unsplashImgs = [...jsText.matchAll(/https:\/\/images\.unsplash\.com\/[^"'\s\)]+/gi)].map(m => m[0]);
      if (unsplashImgs.length > 0) {
        console.log(`Unsplash Images in ${jsPath}:`, [...new Set(unsplashImgs)]);
      }
    } catch (e) {
      console.error("Error fetching JS bundle:", jsPath, e.message);
    }
  }
}

main().catch(console.error);
