"use client";

import { useEffect, useRef } from "react";

export type MascotKind =
  | "headset"
  | "controller"
  | "cube"
  | "building"
  | "glasses"
  | "globe";

interface CategoryMascotProps {
  kind: MascotKind;
  category: string;
  className?: string;
}

type Vec3 = [number, number, number];
type Edge = [number, number];
interface Mesh {
  v: Vec3[];
  e: Edge[];
}

function project(v: Vec3, cx: number, cy: number, scale: number, persp: number): Vec3 {
  const z = v[2];
  const f = 1 / (1 + z * persp);
  return [cx + v[0] * scale * f, cy + v[1] * scale * f, z];
}

function rotate(v: Vec3, ax: number, ay: number, az: number): Vec3 {
  let [x, y, z] = v;
  let c = Math.cos(ax), s = Math.sin(ax);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ay); s = Math.sin(ay);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(az); s = Math.sin(az);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

function meshHeadset(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const ring = (cx: number, cy: number, cz: number, rx: number, ry: number, segs: number) => {
    const s = v.length;
    for (let i = 0; i < segs; i++) {
      const t = (i / segs) * Math.PI * 2;
      v.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t), cz]);
    }
    for (let i = 0; i < segs; i++) e.push([s + i, s + ((i + 1) % segs)]);
  };
  ring(-0.48, 0, 0.55, 0.42, 0.32, 24);
  ring(0.48, 0, 0.55, 0.42, 0.32, 24);
  ring(-0.48, 0, 0.47, 0.32, 0.24, 20);
  ring(0.48, 0, 0.47, 0.32, 0.24, 20);
  const rrVerts = (w: number, h: number, r: number, z: number): Vec3[] => {
    const pts: Vec3[] = [];
    const corners = [
      { cx: w - r, cy: h - r, start: 0 },
      { cx: -(w - r), cy: h - r, start: Math.PI / 2 },
      { cx: -(w - r), cy: -(h - r), start: Math.PI },
      { cx: w - r, cy: -(h - r), start: Math.PI * 1.5 },
    ];
    for (const c of corners) for (let i = 0; i <= 6; i++) {
      const t = c.start + (i / 6) * (Math.PI / 2);
      pts.push([c.cx + r * Math.cos(t), c.cy + r * Math.sin(t), z]);
    }
    return pts;
  };
  const front = rrVerts(1.15, 0.48, 0.18, 0.45);
  const fs = v.length; front.forEach((p) => v.push(p));
  for (let i = 0; i < front.length; i++) e.push([fs + i, fs + ((i + 1) % front.length)]);
  const back = rrVerts(1.10, 0.46, 0.16, -0.10);
  const bs = v.length; back.forEach((p) => v.push(p));
  for (let i = 0; i < back.length; i++) e.push([bs + i, bs + ((i + 1) % back.length)]);
  for (let i = 0; i < front.length; i += 3) e.push([fs + i, bs + i]);
  const ss = v.length;
  for (let i = 0; i <= 20; i++) {
    const t = (i / 20) * Math.PI;
    v.push([Math.cos(t) * 1.02, 0.05 + Math.sin(t) * 0.15, -0.50 - Math.sin(t) * 0.4]);
  }
  for (let i = 0; i < 20; i++) e.push([ss + i, ss + i + 1]);
  return { v, e };
}

function meshController(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const ringS = v.length;
  for (let i = 0; i < 28; i++) {
    const t = (i / 28) * Math.PI * 2;
    v.push([Math.cos(t) * 0.55, 0.65, Math.sin(t) * 0.55]);
  }
  for (let i = 0; i < 28; i++) e.push([ringS + i, ringS + ((i + 1) % 28)]);
  const gripTop = v.length;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    v.push([Math.cos(t) * 0.18, 0.28, Math.sin(t) * 0.18]);
  }
  const gripMid = v.length;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    v.push([Math.cos(t) * 0.20, 0.0, Math.sin(t) * 0.20]);
  }
  const gripBot = v.length;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    v.push([Math.cos(t) * 0.14, -0.60, Math.sin(t) * 0.14]);
  }
  for (let i = 0; i < 12; i++) e.push([gripTop + i, gripTop + ((i + 1) % 12)]);
  for (let i = 0; i < 12; i++) e.push([gripMid + i, gripMid + ((i + 1) % 12)]);
  for (let i = 0; i < 12; i++) e.push([gripBot + i, gripBot + ((i + 1) % 12)]);
  for (let i = 0; i < 12; i++) e.push([gripTop + i, gripMid + i]);
  for (let i = 0; i < 12; i++) e.push([gripMid + i, gripBot + i]);
  for (let k = 0; k < 4; k++) {
    const angle = (k / 4) * Math.PI * 2;
    const rp = v.length;
    v.push([Math.cos(angle) * 0.55, 0.65, Math.sin(angle) * 0.55]);
    const gp = v.length;
    v.push([Math.cos(angle) * 0.18, 0.32, Math.sin(angle) * 0.18]);
    e.push([rp, gp]);
  }
  const tsT = v.length; v.push([0, 0.32, 0]);
  const tsB = v.length; v.push([0, 0.42, 0]);
  e.push([tsT, tsB]);
  return { v, e };
}

function meshCube(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const cube = (s: number) => {
    const start = v.length;
    v.push([-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]);
    const edges: Edge[] = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    edges.forEach(([a, b]) => e.push([start + a, start + b]));
  };
  cube(0.7);
  cube(0.42);
  for (let i = 0; i < 8; i++) e.push([i, 8 + i]);
  return { v, e };
}

function meshBuilding(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const tower = (cx: number, floors: number, widthTop: number, widthBot: number, height: number) => {
    const start = v.length;
    for (let i = 0; i <= floors; i++) {
      const p = i / floors;
      const w = widthBot + (widthTop - widthBot) * p;
      const y = -height / 2 + p * height;
      v.push([cx - w, y, -w], [cx + w, y, -w], [cx + w, y, w], [cx - w, y, w]);
    }
    for (let i = 0; i <= floors; i++) {
      const s = start + i * 4;
      e.push([s, s + 1], [s + 1, s + 2], [s + 2, s + 3], [s + 3, s]);
    }
    for (let i = 0; i < floors; i++) {
      const a = start + i * 4;
      const b = a + 4;
      for (let c = 0; c < 4; c++) e.push([a + c, b + c]);
    }
  };
  tower(-0.42, 6, 0.16, 0.22, 1.2);
  tower(0.42, 8, 0.12, 0.18, 1.4);
  return { v, e };
}

function meshGlasses(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const lens = (cx: number) => {
    const s = v.length;
    for (let i = 0; i < 20; i++) {
      const t = (i / 20) * Math.PI * 2;
      v.push([cx + Math.cos(t) * 0.32, Math.sin(t) * 0.22, 0]);
    }
    for (let i = 0; i < 20; i++) e.push([s + i, s + ((i + 1) % 20)]);
  };
  lens(-0.42);
  lens(0.42);
  const bL = v.length; v.push([-0.10, 0, 0]);
  const bR = v.length; v.push([0.10, 0, 0]);
  e.push([bL, bR]);
  const tlS = v.length;
  for (let i = 0; i <= 12; i++) {
    const p = i / 12;
    v.push([-0.74 - p * 0.45, 0 + p * 0.05, 0.05 + p * 0.35]);
  }
  for (let i = 0; i < 12; i++) e.push([tlS + i, tlS + i + 1]);
  const trS = v.length;
  for (let i = 0; i <= 12; i++) {
    const p = i / 12;
    v.push([0.74 + p * 0.45, 0 + p * 0.05, 0.05 + p * 0.35]);
  }
  for (let i = 0; i < 12; i++) e.push([trS + i, trS + i + 1]);
  const d1 = v.length;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    v.push([-0.42 + Math.cos(t) * 0.14, Math.sin(t) * 0.10, 0.02]);
  }
  for (let i = 0; i < 12; i++) e.push([d1 + i, d1 + ((i + 1) % 12)]);
  const d2 = v.length;
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    v.push([0.42 + Math.cos(t) * 0.14, Math.sin(t) * 0.10, 0.02]);
  }
  for (let i = 0; i < 12; i++) e.push([d2 + i, d2 + ((i + 1) % 12)]);
  return { v, e };
}

function meshGlobe(): Mesh {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  const lats = 8;
  const lons = 16;
  for (let i = 1; i < lats; i++) {
    const phi = (i / lats) * Math.PI - Math.PI / 2;
    const y = Math.sin(phi);
    const r = Math.cos(phi);
    const s = v.length;
    for (let j = 0; j < lons; j++) {
      const theta = (j / lons) * Math.PI * 2;
      v.push([Math.cos(theta) * r * 0.7, y * 0.7, Math.sin(theta) * r * 0.7]);
    }
    for (let j = 0; j < lons; j++) e.push([s + j, s + ((j + 1) % lons)]);
  }
  const segs = 16;
  for (let k = 0; k < lons; k += 2) {
    const theta = (k / lons) * Math.PI * 2;
    const s = v.length;
    for (let i = 0; i <= segs; i++) {
      const phi = -Math.PI / 2 + (i / segs) * Math.PI;
      v.push([Math.cos(theta) * Math.cos(phi) * 0.7, Math.sin(phi) * 0.7, Math.sin(theta) * Math.cos(phi) * 0.7]);
    }
    for (let i = 0; i < segs; i++) e.push([s + i, s + i + 1]);
  }
  const orbR = 0.92;
  for (let o = 0; o < 2; o++) {
    const tilt = o === 0 ? 0.35 : -0.45;
    const s = v.length;
    for (let i = 0; i < 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      v.push([Math.cos(t) * orbR, Math.sin(t) * orbR * Math.sin(tilt), Math.sin(t) * orbR * Math.cos(tilt)]);
    }
    for (let i = 0; i < 32; i++) e.push([s + i, s + ((i + 1) % 32)]);
  }
  return { v, e };
}

interface MeshSpec {
  build: () => Mesh;
  scale: number;
  persp: number;
  spinY: number;
  spinX: number;
}

const MESHES: Record<MascotKind, MeshSpec> = {
  headset: { build: meshHeadset, scale: 0.36, persp: 0.35, spinY: 0.4, spinX: 0.15 },
  controller: { build: meshController, scale: 0.48, persp: 0.40, spinY: 0.6, spinX: 0.10 },
  cube: { build: meshCube, scale: 0.50, persp: 0.40, spinY: 0.5, spinX: 0.35 },
  building: { build: meshBuilding, scale: 0.45, persp: 0.38, spinY: 0.3, spinX: 0.05 },
  glasses: { build: meshGlasses, scale: 0.44, persp: 0.40, spinY: 0.45, spinX: 0.12 },
  globe: { build: meshGlobe, scale: 0.52, persp: 0.35, spinY: 0.25, spinX: 0.05 },
};

function readAccentRgb(el: HTMLElement, category: string): { r: number; g: number; b: number } {
  const raw = getComputedStyle(el).getPropertyValue(`--cat-${category}-rgb`).trim();
  if (!raw) return { r: 0, g: 212, b: 255 };
  const [r, g, b] = raw.split(",").map((s) => parseInt(s.trim(), 10));
  return { r: r || 0, g: g || 212, b: b || 255 };
}

export function CategoryMascot({ kind, category, className }: CategoryMascotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const spec = MESHES[kind];
    const mesh = spec.build();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = Math.floor(rect.width * dpr);
      H = canvas.height = Math.floor(rect.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    let raf = 0;

    const frame = () => {
      if (W === 0 || H === 0) {
        resize();
        if (W === 0 || H === 0) {
          raf = requestAnimationFrame(frame);
          return;
        }
      }
      const t = (performance.now() - t0) / 1000;
      const { r, g, b } = readAccentRgb(canvas, category);
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) * spec.scale;

      const ay = reduced ? 0.6 : t * spec.spinY;
      const ax = reduced ? -0.15 : Math.sin(t * spec.spinX) * 0.3 - 0.12;
      const az = reduced ? 0 : Math.sin(t * 0.2) * 0.05;

      const pts = mesh.v.map((vt) => {
        const rv = rotate(vt, ax, ay, az);
        return project(rv, cx, cy, scale, spec.persp);
      });

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2);
      halo.addColorStop(0, `rgba(${r},${g},${b},0.14)`);
      halo.addColorStop(0.6, `rgba(${r},${g},${b},0.03)`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - scale * 2.2, cy - scale * 2.2, scale * 4.4, scale * 4.4);

      ctx.lineWidth = 1.2 * dpr;
      for (const [i, j] of mesh.e) {
        const p1 = pts[i];
        const p2 = pts[j];
        if (!p1 || !p2) continue;
        const zAvg = (p1[2] + p2[2]) / 2;
        const alpha = 0.35 + zAvg * 0.35;
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }
      for (const p of pts) {
        if (p[2] < 0.2) continue;
        const a = 0.4 + p[2] * 0.5;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      if (reduced) return;
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [kind, category]);

  const feather =
    "radial-gradient(ellipse 78% 82% at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0) 100%)";
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        WebkitMaskImage: feather,
        maskImage: feather,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

export const CATEGORY_MASCOT_KIND: Record<string, MascotKind> = {
  hardware: "headset",
  gaming: "controller",
  software: "cube",
  enterprise: "building",
  ar: "glasses",
  xr: "globe",
};
