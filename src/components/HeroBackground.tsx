"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface HeroBackgroundProps {
  intensity?: number;
  parallax?: boolean;
  mouse?: boolean;
}

type Variant = "cosmic" | "daylight";

type ShapeKind = "rect" | "circle" | "ring" | "tri";
type Tint = "accent" | "violet" | "mint";

interface Shape {
  kind: ShapeKind;
  x: number;
  y: number;
  size: number;
  rot: number;
  drift: number;
  speed: number;
  alpha: number;
  tint: Tint;
}

const SHAPES: Shape[] = [
  { kind: "rect",   x: 0.15, y: 0.22, size: 180, rot: 0.12,  drift: 0.08, speed: 0.04, alpha: 0.07, tint: "accent" },
  { kind: "circle", x: 0.78, y: 0.18, size: 140, rot: 0,     drift: 0.06, speed: 0.05, alpha: 0.08, tint: "accent" },
  { kind: "tri",    x: 0.62, y: 0.38, size: 120, rot: 0.35,  drift: 0.10, speed: 0.03, alpha: 0.06, tint: "violet" },
  { kind: "rect",   x: 0.88, y: 0.48, size: 90,  rot: -0.18, drift: 0.07, speed: 0.06, alpha: 0.08, tint: "accent" },
  { kind: "circle", x: 0.28, y: 0.52, size: 70,  rot: 0,     drift: 0.09, speed: 0.07, alpha: 0.06, tint: "mint" },
  { kind: "ring",   x: 0.45, y: 0.15, size: 100, rot: 0,     drift: 0.05, speed: 0.04, alpha: 0.10, tint: "accent" },
  { kind: "tri",    x: 0.08, y: 0.44, size: 60,  rot: -0.6,  drift: 0.12, speed: 0.08, alpha: 0.05, tint: "violet" },
  { kind: "rect",   x: 0.55, y: 0.58, size: 50,  rot: 0.25,  drift: 0.11, speed: 0.09, alpha: 0.07, tint: "accent" },
  { kind: "circle", x: 0.92, y: 0.32, size: 35,  rot: 0,     drift: 0.13, speed: 0.11, alpha: 0.09, tint: "mint" },
  { kind: "ring",   x: 0.18, y: 0.08, size: 55,  rot: 0,     drift: 0.08, speed: 0.06, alpha: 0.08, tint: "violet" },
];

type StarLayer = "far" | "mid" | "near";

interface StarColor {
  r: number;
  g: number;
  b: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: StarLayer;
  color: StarColor;
  sparkle: boolean;
  parallaxMx: number;
  parallaxSy: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface Spacecraft {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  startT: number;
  size: number;
  alpha: number;
  hueWarm: boolean;
}

interface PlanetCache {
  canvas: HTMLCanvasElement;
  centerX: number;
  centerY: number;
  radius: number;
  padding: number;
}

interface PlanetConfig {
  type: "gas" | "rocky";
  baseX: number;
  baseY: number;
  jitterX: number;
  jitterY: number;
  radius: number;
  parallaxMx: number;
  parallaxSy: number;
  driftSpeed: number;
  bandPalette: { r: number; g: number; b: number };
  lightFromRight: boolean;
}

function pickStarColor(): StarColor {
  const roll = Math.random();
  if (roll < 0.7) return { r: 232, g: 240, b: 255 };
  if (roll < 0.85) return { r: 255, g: 240, b: 200 };
  if (roll < 0.95) return { r: 200, g: 215, b: 255 };
  return { r: 255, g: 200, b: 170 };
}

function makeStarLayer(
  count: number,
  layer: StarLayer,
  sizeMin: number,
  sizeMax: number,
  parallaxMx: number,
  parallaxSy: number,
  twinkleMin: number,
  twinkleMax: number,
  sparkleProb: number
): Star[] {
  const arr: Star[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random(),
      y: Math.random() * 0.62,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      twinkleSpeed: twinkleMin + Math.random() * (twinkleMax - twinkleMin),
      twinkleOffset: Math.random() * Math.PI * 2,
      layer,
      color: pickStarColor(),
      sparkle: Math.random() < sparkleProb,
      parallaxMx,
      parallaxSy,
    });
  }
  return arr;
}

function buildGasGiantCache(
  radiusPx: number,
  palette: { r: number; g: number; b: number },
  lightFromRight: boolean,
  dpr: number
): PlanetCache {
  const r = radiusPx * dpr;
  const ringExtra = r * 0.95;
  const cw = (r + ringExtra) * 2;
  const ch = (r + ringExtra) * 2;
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(cw);
  cv.height = Math.ceil(ch);
  const c = cv.getContext("2d");
  if (!c) {
    return { canvas: cv, centerX: cw / 2, centerY: ch / 2, radius: r, padding: ringExtra };
  }
  const cx = cw / 2;
  const cy = ch / 2;

  // Atmospheric haze (extends 4-6px past the planet edge)
  const haloOuter = r * 1.08;
  const haze = c.createRadialGradient(cx, cy, r * 0.95, cx, cy, haloOuter);
  haze.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},0.18)`);
  haze.addColorStop(0.6, `rgba(${palette.r},${palette.g},${palette.b},0.08)`);
  haze.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0)`);
  c.fillStyle = haze;
  c.beginPath();
  c.arc(cx, cy, haloOuter, 0, Math.PI * 2);
  c.fill();

  // Sphere base shading (light from upper-right or upper-left depending on flag)
  const lightX = lightFromRight ? cx + r * 0.35 : cx - r * 0.35;
  const lightY = cy - r * 0.35;
  const sphere = c.createRadialGradient(lightX, lightY, 0, cx, cy, r * 1.05);
  const lit = (channel: number) => Math.min(255, Math.round(channel * 1.35 + 30));
  const dark = (channel: number) => Math.round(channel * 0.18);
  sphere.addColorStop(0, `rgba(${lit(palette.r)},${lit(palette.g)},${lit(palette.b)},0.85)`);
  sphere.addColorStop(0.45, `rgba(${palette.r},${palette.g},${palette.b},0.7)`);
  sphere.addColorStop(0.85, `rgba(${Math.round(palette.r * 0.55)},${Math.round(palette.g * 0.55)},${Math.round(palette.b * 0.7)},0.55)`);
  sphere.addColorStop(1, `rgba(${dark(palette.r)},${dark(palette.g)},${dark(palette.b)},0.55)`);
  c.fillStyle = sphere;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();

  // Terminator shadow (left ~35% darkens to near-black)
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  const termStartX = lightFromRight ? cx - r : cx + r;
  const termEndX = lightFromRight ? cx + r * 0.5 : cx - r * 0.5;
  const term = c.createLinearGradient(termStartX, cy, termEndX, cy);
  term.addColorStop(0, "rgba(4,8,18,0.65)");
  term.addColorStop(0.5, "rgba(4,8,18,0.25)");
  term.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = term;
  c.fillRect(cx - r, cy - r, r * 2, r * 2);
  c.restore();

  // Soft outer rim line (subtle definition without harsh edge)
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = `rgba(${palette.r},${palette.g},${palette.b},0.22)`;
  c.lineWidth = 0.75 * dpr;
  c.stroke();

  return { canvas: cv, centerX: cx, centerY: cy, radius: r, padding: ringExtra };
}

function buildRockyPlanetCache(
  radiusPx: number,
  palette: { r: number; g: number; b: number },
  lightFromRight: boolean,
  dpr: number
): PlanetCache {
  const r = radiusPx * dpr;
  const haloExtra = r * 0.25;
  const cw = (r + haloExtra) * 2;
  const ch = (r + haloExtra) * 2;
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(cw);
  cv.height = Math.ceil(ch);
  const c = cv.getContext("2d");
  if (!c) {
    return { canvas: cv, centerX: cw / 2, centerY: ch / 2, radius: r, padding: haloExtra };
  }
  const cx = cw / 2;
  const cy = ch / 2;

  // Thin cool atmospheric glow
  const haloOuter = r * 1.05;
  const haze = c.createRadialGradient(cx, cy, r * 0.96, cx, cy, haloOuter);
  haze.addColorStop(0, "rgba(180,210,255,0.14)");
  haze.addColorStop(1, "rgba(180,210,255,0)");
  c.fillStyle = haze;
  c.beginPath();
  c.arc(cx, cy, haloOuter, 0, Math.PI * 2);
  c.fill();

  // Sphere base shading
  const lightX = lightFromRight ? cx + r * 0.3 : cx - r * 0.3;
  const lightY = cy - r * 0.3;
  const sphere = c.createRadialGradient(lightX, lightY, 0, cx, cy, r * 1.05);
  sphere.addColorStop(0, `rgba(${Math.min(255, Math.round(palette.r * 1.25 + 25))},${Math.min(255, Math.round(palette.g * 1.25 + 25))},${Math.min(255, Math.round(palette.b * 1.25 + 25))},0.7)`);
  sphere.addColorStop(0.5, `rgba(${palette.r},${palette.g},${palette.b},0.55)`);
  sphere.addColorStop(1, `rgba(${Math.round(palette.r * 0.3)},${Math.round(palette.g * 0.3)},${Math.round(palette.b * 0.4)},0.5)`);
  c.fillStyle = sphere;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();

  // Crater spots (5 random softly-shaded dots)
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  const craterCount = 5;
  for (let i = 0; i < craterCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * r * 0.7;
    const ccx = cx + Math.cos(angle) * dist;
    const ccy = cy + Math.sin(angle) * dist;
    const cr = (1.5 + Math.random() * 3) * dpr;
    const grad = c.createRadialGradient(ccx, ccy, 0, ccx, ccy, cr);
    grad.addColorStop(0, "rgba(15,18,28,0.55)");
    grad.addColorStop(1, "rgba(15,18,28,0)");
    c.fillStyle = grad;
    c.beginPath();
    c.arc(ccx, ccy, cr, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();

  // Terminator shadow
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.clip();
  const termStartX = lightFromRight ? cx - r : cx + r;
  const termEndX = lightFromRight ? cx + r * 0.5 : cx - r * 0.5;
  const term = c.createLinearGradient(termStartX, cy, termEndX, cy);
  term.addColorStop(0, "rgba(2,4,10,0.6)");
  term.addColorStop(0.5, "rgba(2,4,10,0.22)");
  term.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = term;
  c.fillRect(cx - r, cy - r, r * 2, r * 2);
  c.restore();

  // Subtle rim line
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = "rgba(190,210,240,0.18)";
  c.lineWidth = 0.75 * dpr;
  c.stroke();

  return { canvas: cv, centerX: cx, centerY: cy, radius: r, padding: haloExtra };
}

export function HeroBackground({
  intensity = 60,
  parallax = true,
  mouse = true,
}: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [variant, setVariant] = useState<Variant>("daylight");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setVariant(t === "dark" ? "cosmic" : "daylight");
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const accentRGB = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-rgb")
        .trim();
      const parts = raw.split(",").map((s) => parseInt(s.trim(), 10));
      if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
        return { r: parts[0], g: parts[1], b: parts[2] };
      }
      return { r: 8, g: 145, b: 178 };
    };

    const tintRGB = (name: Tint) => {
      if (name === "violet") return { r: 124, g: 58, b: 237 };
      if (name === "mint") return { r: 5, g: 150, b: 105 };
      return accentRGB();
    };

    const planetConfigs: PlanetConfig[] = [
      {
        type: "gas",
        baseX: 0.82,
        baseY: 0.18,
        jitterX: (Math.random() - 0.5) * 0.05,
        jitterY: (Math.random() - 0.5) * 0.05,
        radius: 90,
        parallaxMx: 0.45,
        parallaxSy: 0.2,
        driftSpeed: 0.02,
        bandPalette: { r: 220, g: 180, b: 130 },
        lightFromRight: true,
      },
      ...(isHome
        ? [
            {
              type: "rocky" as const,
              baseX: 0.12,
              baseY: 0.32,
              jitterX: (Math.random() - 0.5) * 0.05,
              jitterY: (Math.random() - 0.5) * 0.05,
              radius: 50,
              parallaxMx: 0.25,
              parallaxSy: 0.1,
              driftSpeed: 0.03,
              bandPalette: { r: 175, g: 165, b: 155 },
              lightFromRight: false,
            },
          ]
        : []),
    ];

    let planetCaches: PlanetCache[] = [];
    let stars: { far: Star[]; mid: Star[]; near: Star[] } = { far: [], mid: [], near: [] };

    const buildPlanetCaches = () => {
      planetCaches = planetConfigs.map((p) =>
        p.type === "gas"
          ? buildGasGiantCache(p.radius, p.bandPalette, p.lightFromRight, dpr)
          : buildRockyPlanetCache(p.radius, p.bandPalette, p.lightFromRight, dpr)
      );
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = window.innerWidth * dpr;
      H = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      buildPlanetCaches();
    };
    resize();

    if (variant === "cosmic") {
      stars = {
        far: makeStarLayer(170, "far", 0.3, 0.8, 0.15, 0.05, 0.4, 1.2, 0),
        mid: makeStarLayer(85, "mid", 0.8, 1.5, 0.35, 0.15, 0.6, 1.8, 0.35),
        near: makeStarLayer(30, "near", 1.5, 2.5, 0.6, 0.3, 0.8, 2.2, 1),
      };
    }

    const st = { mouseX: 0.5, mouseY: 0.5, scrollY: 0 };
    const onMouse = (e: MouseEvent) => {
      st.mouseX = e.clientX / window.innerWidth;
      st.mouseY = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      st.scrollY = window.scrollY;
    };

    let shooter: Shooter | null = null;
    let nextShooter = 3 + Math.random() * 5;

    let craft: Spacecraft | null = null;
    let nextCraftCheck = 30 + Math.random() * 30;

    const t0 = performance.now();
    let rafId: number | null = null;

    const drawStarLayer = (
      arr: Star[],
      t: number,
      mx: number,
      my: number,
      sy: number,
      allowSparkle: boolean
    ) => {
      const speed = intensity / 100;
      for (const s of arr) {
        const px = s.x * W + mx * 80 * dpr * s.parallaxMx - sy * s.parallaxSy * dpr;
        const py = s.y * H + my * 40 * dpr * s.parallaxMx - sy * s.parallaxSy * 0.7 * dpr;
        if (py > H * 0.66) continue;
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * speed + s.twinkleOffset);
        const baseAlpha = s.layer === "far" ? 0.35 : s.layer === "mid" ? 0.55 : 0.75;
        const alpha = baseAlpha * (0.55 + 0.45 * twinkle);
        ctx.beginPath();
        ctx.arc(px, py, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${alpha})`;
        ctx.fill();

        if (allowSparkle && s.sparkle && twinkle > 0.85) {
          const spikeAlpha = (twinkle - 0.85) / 0.15 * 0.55 * baseAlpha;
          const spikeLen = s.size * 3.2 * dpr;
          ctx.strokeStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${spikeAlpha})`;
          ctx.lineWidth = 0.5 * dpr;
          ctx.beginPath();
          ctx.moveTo(px - spikeLen, py);
          ctx.lineTo(px + spikeLen, py);
          ctx.moveTo(px, py - spikeLen);
          ctx.lineTo(px, py + spikeLen);
          ctx.stroke();
        }
      }
    };

    const drawCachedPlanet = (
      cfg: PlanetConfig,
      cache: PlanetCache,
      t: number,
      mx: number,
      my: number,
      sy: number
    ) => {
      const px =
        (cfg.baseX + cfg.jitterX) * W +
        Math.cos(t * cfg.driftSpeed) * 6 * dpr +
        mx * 30 * dpr * cfg.parallaxMx -
        sy * cfg.parallaxSy * dpr;
      const py =
        (cfg.baseY + cfg.jitterY) * H +
        Math.sin(t * cfg.driftSpeed) * 3 * dpr +
        my * 20 * dpr * cfg.parallaxMx -
        sy * cfg.parallaxSy * 0.6 * dpr;

      ctx.globalAlpha = 0.85;
      ctx.drawImage(
        cache.canvas,
        px - cache.centerX,
        py - cache.centerY
      );
      ctx.globalAlpha = 1;

      // Per-frame band rendering for gas giant (allows slow rotation drift)
      if (cfg.type === "gas") {
        const r = cache.radius;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.clip();
        const bandPhase = t * 0.08;
        const bandCount = 7;
        const drift = (t * 0.6) % (r * 2);
        for (let i = 0; i < bandCount; i++) {
          const offset = (i / bandCount) * r * 2 - r + (drift * 0.05);
          const wobble = Math.sin(bandPhase + i * 1.3) * r * 0.04;
          const bandY = py + offset + wobble;
          const bandH = r * 0.18;
          const tone = i % 2 === 0 ? 1.15 : 0.85;
          const br = Math.min(255, Math.round(cfg.bandPalette.r * tone));
          const bg = Math.min(255, Math.round(cfg.bandPalette.g * tone));
          const bb = Math.min(255, Math.round(cfg.bandPalette.b * tone));
          const alpha = 0.13 + 0.05 * Math.cos(bandPhase + i);
          ctx.fillStyle = `rgba(${br},${bg},${bb},${alpha})`;
          ctx.fillRect(px - r * 1.05, bandY, r * 2.1, bandH);
        }

        // Re-apply terminator on top of bands so shading stays consistent
        const termGrad = ctx.createLinearGradient(px - r, py, px + r * 0.5, py);
        termGrad.addColorStop(0, "rgba(4,8,18,0.45)");
        termGrad.addColorStop(0.6, "rgba(4,8,18,0.15)");
        termGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = termGrad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        ctx.restore();

        // Ring system (drawn after the planet body, with the back half occluded
        // by re-drawing the planet circle clip)
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.32 + my * 0.08);
        ctx.scale(1, 0.22);

        // Back half (behind planet) — draw, then the planet body cache redraws on top in next frame layer
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cfg.bandPalette.r},${cfg.bandPalette.g},${cfg.bandPalette.b},0.32)`;
        ctx.lineWidth = 2.5 * dpr;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 1.78, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cfg.bandPalette.r},${cfg.bandPalette.g},${cfg.bandPalette.b},0.16)`;
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cfg.bandPalette.r},${cfg.bandPalette.g},${cfg.bandPalette.b},0.22)`;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
        ctx.restore();

        // Subtle ring shadow on planet surface (thin band where the ring crosses)
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.clip();
        const shadowGrad = ctx.createLinearGradient(px - r, py - r * 0.05, px + r, py + r * 0.05);
        shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
        shadowGrad.addColorStop(0.5, "rgba(0,0,0,0.18)");
        shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(px - r, py - r * 0.06, r * 2, r * 0.12);
        ctx.restore();
      }
    };

    const drawSpacecraft = (t: number, mx: number, my: number, sy: number) => {
      if (reduced) return;
      if (!craft && t > nextCraftCheck) {
        nextCraftCheck = t + 30 + Math.random() * 30;
        if (Math.random() < 0.7) {
          // Spawn from top, left, or right edge
          const edge = Math.floor(Math.random() * 3);
          const margin = 40 * dpr;
          let sx = 0, sy2 = 0, ex = 0, ey = 0;
          if (edge === 0) {
            // top → bottom (with slight drift)
            sx = Math.random() * W;
            sy2 = -margin;
            ex = sx + (Math.random() - 0.5) * W * 0.5;
            ey = H * (0.45 + Math.random() * 0.2);
          } else if (edge === 1) {
            // left → right
            sx = -margin;
            sy2 = H * (0.1 + Math.random() * 0.45);
            ex = W + margin;
            ey = sy2 + (Math.random() - 0.5) * H * 0.2;
          } else {
            // right → left
            sx = W + margin;
            sy2 = H * (0.1 + Math.random() * 0.45);
            ex = -margin;
            ey = sy2 + (Math.random() - 0.5) * H * 0.2;
          }
          craft = {
            startX: sx,
            startY: sy2,
            endX: ex,
            endY: ey,
            duration: 8 + Math.random() * 7,
            startT: t,
            size: (6 + Math.random() * 6) * dpr,
            alpha: 0.22 + Math.random() * 0.13,
            hueWarm: Math.random() < 0.5,
          };
        }
      }
      if (!craft) return;
      const prog = (t - craft.startT) / craft.duration;
      if (prog >= 1) {
        craft = null;
        return;
      }
      const eased = prog;
      const cx0 = craft.startX + (craft.endX - craft.startX) * eased;
      const cy0 = craft.startY + (craft.endY - craft.startY) * eased;
      // Apply ship-layer parallax
      const px = cx0 + mx * 80 * dpr * 0.5 - sy * 0.25 * dpr;
      const py = cy0 + my * 40 * dpr * 0.5 - sy * 0.18 * dpr;
      const dx = craft.endX - craft.startX;
      const dy = craft.endY - craft.startY;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const fade = Math.sin(prog * Math.PI); // fades in and out
      const a = craft.alpha * fade;

      // Engine trail (3 fading dots behind craft)
      const trailColor = craft.hueWarm
        ? "255, 170, 110"
        : "180, 220, 255";
      for (let i = 1; i <= 3; i++) {
        const tx = px - ux * craft.size * (i * 1.4);
        const ty = py - uy * craft.size * (i * 1.4);
        const tAlpha = a * (1 - i / 4);
        const tSize = craft.size * (0.5 - i * 0.1);
        ctx.beginPath();
        ctx.arc(tx, ty, tSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${trailColor},${tAlpha})`;
        ctx.fill();
      }

      // Body — short pill perpendicular to motion
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(Math.atan2(dy, dx));
      const bodyW = craft.size;
      const bodyH = craft.size * 0.4;
      ctx.fillStyle = `rgba(220,230,245,${a})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW * 0.55, bodyH * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.7})`;
      ctx.lineWidth = 0.4 * dpr;
      ctx.stroke();
      ctx.restore();
    };

    const drawCosmic = (t: number) => {
      const speed = intensity / 100;
      ctx.clearRect(0, 0, W, H);

      const { r, g, b } = accentRGB();
      const mx = mouse ? st.mouseX - 0.5 : 0;
      const my = mouse ? st.mouseY - 0.5 : 0;
      const sy = parallax ? st.scrollY : 0;

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      skyGrad.addColorStop(0, `rgba(${r},${g},${b},0.10)`);
      skyGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.04)`);
      skyGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H * 0.7);

      // Far stars (deepest layer, behind nebula)
      drawStarLayer(stars.far, t, mx, my, sy, false);

      // Nebula blobs (3 with subtle drift)
      const driftA = Math.sin(t * 0.08) * 14 * dpr;
      const driftB = Math.cos(t * 0.07) * 12 * dpr;
      const driftC = Math.sin(t * 0.11 + 2) * 10 * dpr;

      const neb1 = ctx.createRadialGradient(
        W * 0.7 + driftA,
        H * 0.25 + driftB,
        0,
        W * 0.7 + driftA,
        H * 0.25 + driftB,
        W * 0.38
      );
      neb1.addColorStop(0, `rgba(${r},${g},${b},0.07)`);
      neb1.addColorStop(0.5, `rgba(${r},${g},${b},0.02)`);
      neb1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, W, H * 0.7);

      const neb2 = ctx.createRadialGradient(
        W * 0.2 + driftC,
        H * 0.18 + driftA * 0.6,
        0,
        W * 0.2 + driftC,
        H * 0.18 + driftA * 0.6,
        W * 0.32
      );
      neb2.addColorStop(0, "rgba(140,110,210,0.06)");
      neb2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, W, H * 0.7);

      const neb3 = ctx.createRadialGradient(
        W * 0.5 + driftB * 0.7,
        H * 0.1 + driftC,
        0,
        W * 0.5 + driftB * 0.7,
        H * 0.1 + driftC,
        W * 0.22
      );
      neb3.addColorStop(0, `rgba(${Math.round(r * 0.6)},${Math.round(g * 0.7)},${Math.min(255, b + 20)},0.05)`);
      neb3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb3;
      ctx.fillRect(0, 0, W, H * 0.55);

      // Planet 2 (rocky, "farther" layer) — homepage only
      if (planetCaches[1]) drawCachedPlanet(planetConfigs[1], planetCaches[1], t, mx, my, sy);

      // Mid stars
      drawStarLayer(stars.mid, t, mx, my, sy, !reduced);

      // Planet 1 (gas giant, "closer" layer)
      if (planetCaches[0]) drawCachedPlanet(planetConfigs[0], planetCaches[0], t, mx, my, sy);


      // Near stars (with sparkle)
      drawStarLayer(stars.near, t, mx, my, sy, !reduced);

      // Shooting star
      if (!shooter && t > nextShooter) {
        shooter = {
          x: Math.random() * 0.5 * W,
          y: Math.random() * 0.25 * H,
          vx: (200 + Math.random() * 200) * dpr,
          vy: (80 + Math.random() * 60) * dpr,
          life: 0,
          maxLife: 1.2,
        };
        nextShooter = t + 4 + Math.random() * 6;
      }
      if (shooter) {
        shooter.life += 1 / 60;
        const prog = shooter.life / shooter.maxLife;
        if (prog >= 1) {
          shooter = null;
        } else {
          const sx = shooter.x + shooter.vx * shooter.life;
          const sy2 = shooter.y + shooter.vy * shooter.life;
          const tailLen = 80 * dpr;
          const tx = sx - (shooter.vx / Math.hypot(shooter.vx, shooter.vy)) * tailLen;
          const ty = sy2 - (shooter.vy / Math.hypot(shooter.vx, shooter.vy)) * tailLen;
          const a = (1 - prog) * 0.9;
          const g2 = ctx.createLinearGradient(tx, ty, sx, sy2);
          g2.addColorStop(0, "rgba(255,255,255,0)");
          g2.addColorStop(1, `rgba(255,255,255,${a})`);
          ctx.strokeStyle = g2;
          ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(sx, sy2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(sx, sy2, 2 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fill();
        }
      }

      // Spacecraft
      drawSpacecraft(t, mx, my, sy);

      // Wireframe grid
      const cx = W / 2 + mx * 60 * dpr;
      const horizon = H * 0.62 + sy * 0.15 * dpr;

      const hg = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, H * 0.6);
      hg.addColorStop(0, `rgba(${r},${g},${b},0.26)`);
      hg.addColorStop(0.4, `rgba(${r},${g},${b},0.10)`);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - H * 0.32, W, H - (horizon - H * 0.32));

      const rows = 20;
      const cols = 22;
      const scroll = (t * 40 * speed) % (H * 0.05);

      for (let i = 0; i <= rows; i++) {
        const p = i / rows;
        const y = horizon + Math.pow(p, 1.3) * (H - horizon) + scroll * Math.pow(p, 1.2);
        if (y > H) continue;
        const nearFade = Math.min(1, p * 3.2);
        const alpha = 0.35 * (1 - p * 0.7) * nearFade;
        if (alpha < 0.005) continue;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        const spread = (y - horizon) * 2.2;
        ctx.moveTo(cx - spread, y);
        ctx.lineTo(cx + spread, y);
        ctx.stroke();
      }

      for (let j = -cols; j <= cols; j++) {
        const p = j / cols;
        const farX = cx + p * W * 0.6;
        const nearX = cx + p * W * 3;
        const colGrad = ctx.createLinearGradient(farX, horizon, nearX, H);
        colGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        colGrad.addColorStop(0.25, `rgba(${r},${g},${b},0.08)`);
        colGrad.addColorStop(1, `rgba(${r},${g},${b},0.3)`);
        ctx.strokeStyle = colGrad;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(farX, horizon);
        ctx.lineTo(nearX, H);
        ctx.stroke();
      }
    };

    const drawDaylight = (t: number) => {
      const speed = intensity / 100;
      const mx = mouse ? st.mouseX - 0.5 : 0;
      const my = mouse ? st.mouseY - 0.5 : 0;
      const sy = parallax ? st.scrollY : 0;

      ctx.clearRect(0, 0, W, H);

      const { r: ar, g: ag, b: ab } = accentRGB();

      // 1. Sky wash
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.9);
      sky.addColorStop(0, `rgba(${ar},${ag},${ab},0.10)`);
      sky.addColorStop(0.35, `rgba(${ar},${ag},${ab},0.04)`);
      sky.addColorStop(0.7, "rgba(255, 246, 238, 0.25)");
      sky.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // 1b. Subtle cloud-like atmospheric gradient (new)
      const cloudY = H * 0.18 + Math.sin(t * 0.05) * 14 * dpr;
      const cloud = ctx.createRadialGradient(W * 0.55, cloudY, 0, W * 0.55, cloudY, W * 0.55);
      cloud.addColorStop(0, "rgba(255,250,242,0.045)");
      cloud.addColorStop(0.6, "rgba(255,250,242,0.018)");
      cloud.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cloud;
      ctx.fillRect(0, 0, W, H * 0.6);

      // 2. Atmospheric glows
      const g1x = W * 0.75 + Math.cos(t * 0.05) * 30 * dpr;
      const g1y = H * 0.2 + Math.sin(t * 0.04) * 15 * dpr;
      const g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, W * 0.45);
      g1.addColorStop(0, `rgba(${ar},${ag},${ab},0.08)`);
      g1.addColorStop(0.5, `rgba(${ar},${ag},${ab},0.02)`);
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      const g2x = W * 0.2 + Math.cos(t * 0.06 + 1) * 25 * dpr;
      const g2y = H * 0.3 + Math.sin(t * 0.05 + 1) * 12 * dpr;
      const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, W * 0.4);
      g2.addColorStop(0, "rgba(253, 186, 116, 0.10)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // 3. Floating shapes
      for (let i = 0; i < SHAPES.length; i++) {
        const s = SHAPES[i];
        const phase = t * s.speed * speed + i;
        const px =
          s.x * W + Math.cos(phase) * s.drift * W * 0.06 + mx * 40 * dpr - sy * 0.08 * dpr;
        const py =
          s.y * H +
          Math.sin(phase * 0.9) * s.drift * H * 0.06 +
          my * 25 * dpr -
          sy * 0.15 * dpr;
        const sz = s.size * dpr;
        const rot = s.rot + t * s.speed * 0.3 * speed;
        const { r, g, b } = tintRGB(s.tint);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);

        if (s.kind === "rect") {
          const rr = sz * 0.18;
          const hw = sz / 2;
          const hh = sz / 2;
          ctx.beginPath();
          ctx.moveTo(-hw + rr, -hh);
          ctx.lineTo(hw - rr, -hh);
          ctx.quadraticCurveTo(hw, -hh, hw, -hh + rr);
          ctx.lineTo(hw, hh - rr);
          ctx.quadraticCurveTo(hw, hh, hw - rr, hh);
          ctx.lineTo(-hw + rr, hh);
          ctx.quadraticCurveTo(-hw, hh, -hw, hh - rr);
          ctx.lineTo(-hw, -hh + rr);
          ctx.quadraticCurveTo(-hw, -hh, -hw + rr, -hh);
          ctx.closePath();
          const gr = ctx.createLinearGradient(-hw, -hh, hw, hh);
          gr.addColorStop(0, `rgba(${r},${g},${b},${s.alpha * 1.6})`);
          gr.addColorStop(1, `rgba(${r},${g},${b},${s.alpha * 0.6})`);
          ctx.fillStyle = gr;
          ctx.fill();
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.alpha * 2.2})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        } else if (s.kind === "circle") {
          const gr = ctx.createRadialGradient(-sz * 0.2, -sz * 0.2, 0, 0, 0, sz / 2);
          gr.addColorStop(0, `rgba(${r},${g},${b},${s.alpha * 2})`);
          gr.addColorStop(1, `rgba(${r},${g},${b},${s.alpha * 0.3})`);
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.alpha * 2.2})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        } else if (s.kind === "ring") {
          ctx.beginPath();
          ctx.arc(0, 0, sz / 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.alpha * 2.8})`;
          ctx.lineWidth = 2 * dpr;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, (sz / 2) * 0.72, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.alpha * 1.4})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        } else if (s.kind === "tri") {
          const h = sz * 0.866;
          ctx.beginPath();
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(sz / 2, h / 2);
          ctx.lineTo(-sz / 2, h / 2);
          ctx.closePath();
          const gr = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
          gr.addColorStop(0, `rgba(${r},${g},${b},${s.alpha * 1.8})`);
          gr.addColorStop(1, `rgba(${r},${g},${b},${s.alpha * 0.5})`);
          ctx.fillStyle = gr;
          ctx.fill();
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.alpha * 2.4})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Faint dot grid wash (lower 45%)
      ctx.fillStyle = `rgba(${ar},${ag},${ab},0.18)`;
      const step = 36 * dpr;
      const yStart = H * 0.55;
      for (let y = yStart; y < H; y += step) {
        for (let x = (t * 8 * speed * dpr) % step; x < W; x += step) {
          const d = 1 - (y - yStart) / (H - yStart);
          const a = 0.05 + d * 0.1;
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(x, y, 1.2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      if (variant === "cosmic") drawCosmic(t);
      else drawDaylight(t);
      if (!reduced) rafId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    if (mouse && !reduced) window.addEventListener("mousemove", onMouse);
    if (parallax && !reduced) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant, intensity, parallax, mouse, isHome]);

  return (
    <>
      <canvas ref={canvasRef} className="hero-bg-canvas" aria-hidden="true" />
      <div className="hero-bg-vignette" aria-hidden="true" />
    </>
  );
}
