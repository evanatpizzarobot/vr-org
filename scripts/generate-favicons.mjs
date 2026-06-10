// Generate all favicon assets from public/favicon.svg.
// Outputs: favicon.ico, apple-touch-icon.png (180), favicon-16x16.png,
// favicon-32x32.png, favicon-192.png, favicon-512.png.
//
// sharp and png-to-ico are not project dependencies (the app never imports
// them and they would bloat the Docker build). Install them ad hoc:
//   npm i --no-save sharp png-to-ico
//   node scripts/generate-favicons.mjs

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(ROOT, "public");
const SVG_PATH = path.join(PUBLIC, "favicon.svg");
const SVG_NATIVE_SIZE = 64; // favicon.svg viewBox is 64x64

const svg = await readFile(SVG_PATH);

// sharp rasterizes SVG at its native size unless density compensates, so
// scale density to the target to keep edges crisp instead of upscaling.
function render(size) {
  return sharp(svg, { density: 72 * (size / SVG_NATIVE_SIZE) }).resize(
    size,
    size
  );
}

const targets = [
  { file: "favicon-16x16.png", size: 16 },
  { file: "favicon-32x32.png", size: 32 },
  { file: "favicon-192.png", size: 192 },
  { file: "favicon-512.png", size: 512 },
];

for (const { file, size } of targets) {
  await render(size).png().toFile(path.join(PUBLIC, file));
  console.log(`wrote public/${file}`);
}

// iOS replaces transparency with black and applies its own corner mask, so
// flatten the touch icon onto the site background color.
await render(180)
  .flatten({ background: "#0a0e17" })
  .png()
  .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
console.log("wrote public/apple-touch-icon.png");

const icoSources = await Promise.all(
  [16, 32, 48].map((size) => render(size).png().toBuffer())
);
await writeFile(path.join(PUBLIC, "favicon.ico"), await pngToIco(icoSources));
console.log("wrote public/favicon.ico");
