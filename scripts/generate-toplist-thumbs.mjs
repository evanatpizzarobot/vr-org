/**
 * Generates the small square box-art thumbnails shown on the right of each row
 * in the sidebar Top List widgets.
 *
 *   node scripts/generate-toplist-thumbs.mjs
 *
 * Source of truth is data/top-lists.json. Any item carrying a `steamAppId` gets
 * its Steam portrait capsule (library_600x900) downloaded, cropped to a square
 * from the TOP, and written to public/toplist-thumbs/<appId>.webp at 88x88 so it
 * stays crisp on 2x displays at its 44px render size.
 *
 * Top-anchored is deliberate. Steam's portrait art puts the logo in the upper
 * half, so a centre or "attention" crop slices the title in half. The wide
 * capsule_231x87 art is worse still: cropping it square leaves fragments like
 * "NIMO" or "TO THE ADIU".
 *
 * Not every app publishes portrait art (Resident Evil Requiem, Little
 * Nightmares and TMNT all 404 on library_600x900, hashed path included). Those
 * fall back to header.jpg cropped square from the RIGHT edge, where the key art
 * lives; a centre crop of a header lands on the logo and slices it.
 *
 * Items with no `steamAppId` (Quest exclusives with no Steam page, hardware,
 * apps) are skipped and the widget renders a neutral tile for them, so the
 * rows stay aligned. Nothing here writes back to top-lists.json; the `image`
 * field is hand-authored alongside `steamAppId` so the file keeps its compact
 * one-line-per-item formatting.
 *
 * `thumbFit: "icon"` switches to app-icon handling: the mark is fitted whole
 * rather than cropped. Store art gets cropped because it is a scene; an app
 * icon is a logo and slicing it is vandalism. Icons that already fill a square
 * are used edge to edge, and icons with transparency are centred on a neutral
 * card so they stay visible in both the light and dark themes.
 *
 * Apps use icons rather than Steam capsules on purpose. A capsule is drawn for
 * a 460px-wide store shelf, so squaring it cuts the wordmark in half (Steam
 * Link becomes "STEAM LIN", Gravity Sketch turns into unreadable grey text).
 * An app icon is drawn to be read at exactly this size.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const LISTS = path.join(ROOT, "data", "top-lists.json");
const OUT_DIR = path.join(ROOT, "public", "toplist-thumbs");
const SIZE = 88;
const UA = "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)";

const CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps";

async function get(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 1000 ? buf : null;
  } catch {
    return null;
  }
}

/** Store art lives under a per-app hash directory for newer titles. */
async function headerUrlFor(appId) {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`, {
      headers: { "User-Agent": UA },
    });
    const json = await res.json();
    return json?.[String(appId)]?.data?.header_image ?? null;
  } catch {
    return null;
  }
}

/**
 * Portrait box art if Steam has it, otherwise the wide header. The caller needs
 * to know which it got, because the two crop differently.
 */
async function fetchArt(appId) {
  const header = await headerUrlFor(appId);
  const hashDir = header ? header.split("?")[0].replace(/\/[^/]+$/, "") : null;

  for (const url of [`${CDN}/${appId}/library_600x900.jpg`, hashDir && `${hashDir}/library_600x900.jpg`]) {
    if (!url) continue;
    const buf = await get(url);
    if (buf) return { buf, portrait: true };
  }

  for (const url of [header, `${CDN}/${appId}/header.jpg`]) {
    if (!url) continue;
    const buf = await get(url);
    if (buf) return { buf, portrait: false };
  }

  return null;
}

const lists = JSON.parse(fs.readFileSync(LISTS, "utf-8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let skipped = 0;
let failed = 0;
const missing = [];

for (const [listKey, list] of Object.entries(lists)) {
  for (const item of list.items ?? []) {
    if (!item.image) {
      missing.push(`${listKey} / ${item.title}`);
      skipped++;
      continue;
    }

    if (!item.image.startsWith("/toplist-thumbs/")) {
      console.error(`  x  ${item.title}: image must live under /toplist-thumbs/, got ${item.image}`);
      failed++;
      continue;
    }

    const dest = path.join(ROOT, "public", item.image.replace(/^\//, ""));

    // Steam is the preferred source. `thumbSource` covers everything Steam does
    // not carry, e.g. Quest exclusives.
    const found = item.steamAppId
      ? await fetchArt(item.steamAppId)
      : item.thumbSource
        ? await get(item.thumbSource).then((buf) => (buf ? { buf, portrait: false } : null))
        : null;

    if (!found) {
      console.error(`  x  ${item.title}: no art found (steamAppId ${item.steamAppId ?? "none"})`);
      failed++;
      continue;
    }

    const meta = await sharp(found.buf).metadata();
    let out;
    let mode;

    if (item.thumbFit === "icon") {
      const square = Math.abs(meta.width - meta.height) <= 2;
      if (square && !meta.hasAlpha) {
        // Already a full-bleed app icon; use it edge to edge.
        out = await sharp(found.buf).resize(SIZE, SIZE, { fit: "cover" }).webp({ quality: 88 }).toBuffer();
        mode = "icon full";
      } else {
        const inner = Math.round(SIZE * 0.8);
        const mark = await sharp(found.buf)
          .resize(inner, inner, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        out = await sharp({
          create: { width: SIZE, height: SIZE, channels: 4, background: { r: 20, g: 26, b: 38, alpha: 1 } },
        })
          .composite([{ input: mark, gravity: "centre" }])
          .webp({ quality: 88 })
          .toBuffer();
        mode = "icon card";
      }
    } else if (found.portrait) {
      out = await sharp(found.buf).resize(SIZE, SIZE, { fit: "cover", position: "top" }).webp({ quality: 82 }).toBuffer();
      mode = "portrait ";
    } else {
      // Square out of the right edge of the wide header, away from the logo.
      const side = Math.min(meta.width, meta.height);
      out = await sharp(found.buf)
        .extract({ left: meta.width - side, top: 0, width: side, height: side })
        .resize(SIZE, SIZE)
        .webp({ quality: 82 })
        .toBuffer();
      mode = "header   ";
    }

    fs.writeFileSync(dest, out);
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`  ok ${item.title.padEnd(38)} ${mode}  ${kb} kB`);
    written++;
  }
}

console.log(`\n${written} thumbnail(s) written, ${skipped} item(s) without art, ${failed} failure(s)`);
if (missing.length) {
  console.log("No image field (widget shows a neutral tile):");
  for (const m of missing) console.log(`  - ${m}`);
}
process.exit(failed > 0 ? 1 : 0);
