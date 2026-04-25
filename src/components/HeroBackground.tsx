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

interface ShipDef {
  file: string;
  width: number;
  baseOp: number;
  weight: number;
  minDur: number;
  maxDur: number;
}

const SHIPS: ShipDef[] = [
  { file: "ship-shuttle.png",  width: 140, baseOp: 0.65, weight: 4, minDur: 14, maxDur: 22 },
  { file: "ship-ufo.png",      width: 90,  baseOp: 0.55, weight: 3, minDur: 18, maxDur: 28 },
  { file: "ship-cargo.png",    width: 170, baseOp: 0.50, weight: 2, minDur: 28, maxDur: 42 },
  { file: "ship-squadron.png", width: 60,  baseOp: 0.50, weight: 3, minDur: 9,  maxDur: 14 },
];

const SCHEDULE = {
  short:  { weight: 0.50, min: 8,  max: 16 },
  medium: { weight: 0.35, min: 16, max: 28 },
  long:   { weight: 0.15, min: 28, max: 45 },
};

const AVOID_LANE = { topMin: 38, topMax: 58 };
const SPAWN_LANE = { topMin: 8,  topMax: 88 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function pickShip(): ShipDef {
  const total = SHIPS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const s of SHIPS) {
    if ((r -= s.weight) <= 0) return s;
  }
  return SHIPS[0];
}

function pickGap(): number {
  const r = Math.random();
  let cum = 0;
  for (const k of ["short", "medium", "long"] as const) {
    cum += SCHEDULE[k].weight;
    if (r <= cum) return rand(SCHEDULE[k].min, SCHEDULE[k].max);
  }
  return rand(SCHEDULE.short.min, SCHEDULE.short.max);
}

function pickLane(): number {
  let top = 0;
  let attempts = 0;
  do {
    top = rand(SPAWN_LANE.topMin, SPAWN_LANE.topMax);
    attempts++;
  } while (top > AVOID_LANE.topMin && top < AVOID_LANE.topMax && attempts < 8);
  return top;
}

// Rotating earth — projects an equirectangular texture onto a sphere each frame.
class EarthRotate {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  surfaceSrc: string;
  cloudsSrc: string;
  rotSpeed = 0.012;
  cloudSpeed = 0.018;
  tilt = -0.35;
  lightDir = { x: -0.6, y: -0.4, z: 0.7 };
  surfData: ImageData | null = null;
  cloudData: ImageData | null = null;
  frameImg: ImageData | null = null;
  W = 0;
  H = 0;
  rot = 0;
  cloudRot = 0;
  raf: number | null = null;
  cancelled = false;

  constructor(canvas: HTMLCanvasElement, surfaceSrc: string, cloudsSrc: string) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("EarthRotate: no 2d context");
    this.ctx = ctx;
    this.surfaceSrc = surfaceSrc;
    this.cloudsSrc = cloudsSrc;
  }

  start(): void {
    Promise.all([loadImage(this.surfaceSrc), loadImage(this.cloudsSrc)])
      .then(([surfImg, cloudImg]) => {
        if (this.cancelled) return;
        this.surfData = bakeImageData(surfImg);
        this.cloudData = bakeImageData(cloudImg);
        this.W = this.canvas.width;
        this.H = this.canvas.height;
        this.frameImg = this.ctx.createImageData(this.W, this.H);
        this.loop();
      })
      .catch(() => {
        // texture failed — leave canvas blank
      });
  }

  stop(): void {
    this.cancelled = true;
    if (this.raf !== null) cancelAnimationFrame(this.raf);
  }

  private loop = (): void => {
    if (this.cancelled) return;
    this.render();
    this.rot += this.rotSpeed * 0.5;
    this.cloudRot += this.cloudSpeed * 0.5;
    this.raf = requestAnimationFrame(this.loop);
  };

  private render(): void {
    if (!this.surfData || !this.cloudData || !this.frameImg) return;
    const W = this.W, H = this.H;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 4;
    const sd = this.surfData.data, sw = this.surfData.width, sh = this.surfData.height;
    const cd = this.cloudData.data;
    const img = this.frameImg.data;
    const rot = this.rot, cloudRot = this.cloudRot;
    const tilt = this.tilt;
    const sinT = Math.sin(tilt), cosT = Math.cos(tilt);
    const L = this.lightDir;
    const Llen = Math.sqrt(L.x * L.x + L.y * L.y + L.z * L.z);
    const lx = L.x / Llen, ly = L.y / Llen, lz = L.z / Llen;

    for (let py = 0; py < H; py++) {
      const dy = (py - cy) / R;
      for (let px = 0; px < W; px++) {
        const dx = (px - cx) / R;
        const r2 = dx * dx + dy * dy;
        const i = (py * W + px) * 4;
        if (r2 >= 1) {
          img[i] = 0; img[i + 1] = 0; img[i + 2] = 0; img[i + 3] = 0;
          continue;
        }
        const nx = dx;
        const ny = dy;
        const nz = Math.sqrt(1 - r2);

        const py2 = ny * cosT - nz * sinT;
        const pz2 = ny * sinT + nz * cosT;
        const px2 = nx;

        let lon = Math.atan2(px2, pz2) + rot;
        const lat = Math.asin(py2);
        lon = lon - Math.floor(lon / (Math.PI * 2)) * Math.PI * 2;
        const u = lon / (Math.PI * 2);
        const v = lat / Math.PI + 0.5;

        const tx = Math.floor(u * sw) % sw;
        let ty = Math.floor(v * sh);
        if (ty < 0) ty = 0; else if (ty >= sh) ty = sh - 1;
        const ti = (ty * sw + tx) * 4;

        const lambert = nx * lx + ny * ly + nz * lz;
        let shade = 0.55 + 0.55 * lambert;
        if (shade < 0.25) shade = 0.25;
        if (shade > 1.05) shade = 1.05;

        const sr = sd[ti], sg = sd[ti + 1], sb = sd[ti + 2];

        let clon = lon - rot + cloudRot;
        clon = clon - Math.floor(clon / (Math.PI * 2)) * Math.PI * 2;
        const cu = clon / (Math.PI * 2);
        const ctx2 = Math.floor(cu * sw) % sw;
        const ci = (ty * sw + ctx2) * 4;
        const cAlpha = cd[ci + 3] / 255;
        let rr = sr * (1 - cAlpha) + cd[ci]     * cAlpha;
        let gg = sg * (1 - cAlpha) + cd[ci + 1] * cAlpha;
        let bb = sb * (1 - cAlpha) + cd[ci + 2] * cAlpha;

        rr *= shade; gg *= shade; bb *= shade;

        const rim = r2 * r2 * r2;
        const rimT = Math.max(0, Math.min(1, (rim - 0.4) / 0.6));
        rr = rr * (1 - rimT * 0.6) + 140 * rimT * 0.6;
        gg = gg * (1 - rimT * 0.6) + 195 * rimT * 0.6;
        bb = bb * (1 - rimT * 0.6) + 245 * rimT * 0.6;

        img[i] = rr;
        img[i + 1] = gg;
        img[i + 2] = bb;
        img[i + 3] = 255;
      }
    }
    this.ctx.putImageData(this.frameImg, 0, 0);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function bakeImageData(img: HTMLImageElement): ImageData {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const cctx = c.getContext("2d");
  if (!cctx) throw new Error("bakeImageData: no 2d context");
  cctx.drawImage(img, 0, 0);
  return cctx.getImageData(0, 0, img.width, img.height);
}

export function HeroBackground({
  intensity = 60,
  parallax = true,
  mouse = true,
}: HeroBackgroundProps) {
  const daylightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const earthCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const shipsLayerRef = useRef<HTMLDivElement | null>(null);
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

  // Cosmic mode: Earth rotation + ship scheduler
  useEffect(() => {
    if (variant !== "cosmic") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let earth: EarthRotate | null = null;
    if (earthCanvasRef.current) {
      earth = new EarthRotate(
        earthCanvasRef.current,
        "/space-bg/earth-surface.png",
        "/space-bg/earth-clouds.png"
      );
      earth.start();
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function launchShip() {
      if (cancelled) return;
      const layer = shipsLayerRef.current;
      if (!layer || document.hidden) return;
      const ship = pickShip();
      const img = document.createElement("img");
      img.className = "space-bg__ship";
      img.src = `/space-bg/${ship.file}`;
      img.alt = "";
      img.style.width = ship.width + "px";

      const layerW = layer.clientWidth || window.innerWidth;
      const layerH = layer.clientHeight || window.innerHeight;
      const padX = ship.width + 40;
      const padY = ship.width + 40;
      const isUFO = ship.file === "ship-ufo.png";
      let durMul = 1;

      if (isUFO) {
        // UFOs travel vertically or diagonally, never simple horizontal
        const sideX = () => {
          // pick X away from hero center (avoid 30-70%)
          return Math.random() < 0.5
            ? rand(0.05, 0.28) * layerW
            : rand(0.72, 0.95) * layerW;
        };
        const variant = Math.floor(Math.random() * 6);
        let startX = 0, startY = 0, endX = 0, endY = 0;
        if (variant === 0) {
          // top → bottom
          startX = sideX(); startY = -padY;
          endX = startX;    endY = layerH + padY;
        } else if (variant === 1) {
          // bottom → top
          startX = sideX(); startY = layerH + padY;
          endX = startX;    endY = -padY;
        } else if (variant === 2) {
          // diagonal ↘ top-left → bottom-right
          startX = -padX;        startY = -padY;
          endX = layerW + padX;  endY = layerH + padY;
          durMul = 1.3;
        } else if (variant === 3) {
          // diagonal ↙ top-right → bottom-left
          startX = layerW + padX; startY = -padY;
          endX = -padX;           endY = layerH + padY;
          durMul = 1.3;
        } else if (variant === 4) {
          // diagonal ↗ bottom-left → top-right
          startX = -padX;        startY = layerH + padY;
          endX = layerW + padX;  endY = -padY;
          durMul = 1.3;
        } else {
          // diagonal ↖ bottom-right → top-left
          startX = layerW + padX; startY = layerH + padY;
          endX = -padX;           endY = -padY;
          durMul = 1.3;
        }
        img.style.left = startX + "px";
        img.style.top = startY + "px";
        img.style.setProperty("--travel-x", (endX - startX) + "px");
        img.style.setProperty("--travel-y", (endY - startY) + "px");
        img.style.setProperty("--ship-flip", "");
      } else {
        // Other ships: horizontal traversal in either direction
        const ltr = Math.random() < 0.5;
        const travel = layerW + padX * 2;
        img.style.top = pickLane() + "%";
        if (ltr) {
          img.style.left = -padX + "px";
          img.style.setProperty("--ship-flip", "scaleX(-1)");
          img.style.setProperty("--travel-x", travel + "px");
        } else {
          img.style.left = layerW + padX - ship.width + "px";
          img.style.setProperty("--ship-flip", "");
          img.style.setProperty("--travel-x", -travel + "px");
        }
        img.style.setProperty("--travel-y", "0px");
      }

      img.style.setProperty(
        "--ship-op",
        Math.min(0.85, ship.baseOp * rand(0.75, 1.1)).toFixed(2)
      );

      const dur = rand(ship.minDur, ship.maxDur) * durMul;
      img.style.animation = `space-bg-ship-pass ${dur}s linear forwards`;

      layer.appendChild(img);
      img.addEventListener("animationend", () => img.remove());
    }

    function tick() {
      launchShip();
      timer = setTimeout(tick, pickGap() * 1000);
    }

    if (!reduced) {
      timer = setTimeout(tick, 800);
    }

    return () => {
      cancelled = true;
      if (timer !== null) clearTimeout(timer);
      if (earth) earth.stop();
      const layer = shipsLayerRef.current;
      if (layer) layer.innerHTML = "";
    };
  }, [variant]);

  // Daylight mode: existing canvas-based geometric shapes
  useEffect(() => {
    if (variant !== "daylight") return;
    const canvas = daylightCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = window.innerWidth * dpr;
      H = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();

    const st = { mouseX: 0.5, mouseY: 0.5, scrollY: 0 };
    const onMouse = (e: MouseEvent) => {
      st.mouseX = e.clientX / window.innerWidth;
      st.mouseY = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      st.scrollY = window.scrollY;
    };

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

    const t0 = performance.now();
    let rafId: number | null = null;

    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      const speed = intensity / 100;
      const mx = mouse ? st.mouseX - 0.5 : 0;
      const my = mouse ? st.mouseY - 0.5 : 0;
      const sy = parallax ? st.scrollY : 0;

      ctx.clearRect(0, 0, W, H);

      const { r: ar, g: ag, b: ab } = accentRGB();

      // Sky wash
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.9);
      sky.addColorStop(0, `rgba(${ar},${ag},${ab},0.10)`);
      sky.addColorStop(0.35, `rgba(${ar},${ag},${ab},0.04)`);
      sky.addColorStop(0.7, "rgba(255, 246, 238, 0.25)");
      sky.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Cloud-like atmospheric gradient
      const cloudY = H * 0.18 + Math.sin(t * 0.05) * 14 * dpr;
      const cloud = ctx.createRadialGradient(W * 0.55, cloudY, 0, W * 0.55, cloudY, W * 0.55);
      cloud.addColorStop(0, "rgba(255,250,242,0.045)");
      cloud.addColorStop(0.6, "rgba(255,250,242,0.018)");
      cloud.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cloud;
      ctx.fillRect(0, 0, W, H * 0.6);

      // Atmospheric glows
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

      // Floating shapes
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

      // Faint dot grid wash (lower 45%)
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
  }, [variant, intensity, parallax, mouse]);

  if (variant === "cosmic") {
    return (
      <>
        <div className="space-bg" aria-hidden="true">
          <div className="space-bg__stars" />
          {isHome && (
            <img
              className="space-bg__planet space-bg__planet--rocky"
              src="/space-bg/planet-rocky.png"
              alt=""
            />
          )}
          <canvas
            ref={earthCanvasRef}
            className="space-bg__planet space-bg__planet--earth"
            width={400}
            height={400}
          />
          <img
            className="space-bg__star space-bg__star--1"
            src="/space-bg/star-sparkle-white.png"
            alt=""
          />
          <img
            className="space-bg__star space-bg__star--2"
            src="/space-bg/star-sparkle-blue.png"
            alt=""
          />
          <img
            className="space-bg__star space-bg__star--3"
            src="/space-bg/star-sparkle-warm.png"
            alt=""
          />
          <div ref={shipsLayerRef} className="space-bg__ships" />
        </div>
        <div className="hero-bg-vignette" aria-hidden="true" />
      </>
    );
  }

  return (
    <>
      <canvas ref={daylightCanvasRef} className="hero-bg-canvas" aria-hidden="true" />
      <div className="hero-bg-vignette" aria-hidden="true" />
    </>
  );
}
