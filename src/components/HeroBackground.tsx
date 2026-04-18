"use client";

import { useEffect, useRef, useState } from "react";

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

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function HeroBackground({
  intensity = 60,
  parallax = true,
  mouse = true,
}: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [variant, setVariant] = useState<Variant>("daylight");

  // Theme → variant routing (re-runs on data-theme mutations)
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

    // --- Cosmic-only state ---
    const stars: Star[] =
      variant === "cosmic"
        ? Array.from({ length: 180 }, () => ({
            x: Math.random(),
            y: Math.random() * 0.62,
            size: Math.random() * 1.4 + 0.3,
            twinkleSpeed: Math.random() * 2 + 0.5,
            twinkleOffset: Math.random() * Math.PI * 2,
            depth: Math.random() * 0.8 + 0.2,
          }))
        : [];
    let shooter: Shooter | null = null;
    let nextShooter = 3 + Math.random() * 5;
    const planets = [
      { x: 0.82, y: 0.18, r: 48, hue: 1, ring: true, drift: 0.02, spin: 0.35, bands: 3 },
      { x: 0.12, y: 0.32, r: 28, hue: 0.6, ring: false, drift: 0.03, spin: 0.5, bands: 2 },
    ];

    const t0 = performance.now();
    let rafId: number | null = null;

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

      // Nebula blobs
      const nebY = H * 0.25 + Math.sin(t * 0.1) * 20 * dpr;
      const neb1 = ctx.createRadialGradient(W * 0.7, nebY, 0, W * 0.7, nebY, W * 0.35);
      neb1.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
      neb1.addColorStop(0.5, `rgba(${r},${g},${b},0.02)`);
      neb1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, W, H * 0.7);

      const neb2 = ctx.createRadialGradient(W * 0.2, H * 0.15, 0, W * 0.2, H * 0.15, W * 0.3);
      neb2.addColorStop(0, "rgba(167,139,250,0.05)");
      neb2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, W, H * 0.7);

      // Stars
      for (const s of stars) {
        const px = s.x * W + mx * 40 * dpr * s.depth - sy * 0.05 * dpr * s.depth;
        const py = s.y * H + my * 20 * dpr * s.depth - sy * 0.12 * dpr * s.depth;
        if (py > H * 0.65) continue;
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * speed + s.twinkleOffset);
        const alpha = 0.3 + twinkle * 0.6 * s.depth;
        ctx.beginPath();
        ctx.arc(px, py, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        if (s.size > 1.2 && twinkle > 0.8) {
          ctx.beginPath();
          ctx.arc(px, py, s.size * 3 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.15 * twinkle})`;
          ctx.fill();
        }
      }

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

      // Planets
      for (const p of planets) {
        const px = p.x * W + Math.cos(t * p.drift) * 8 * dpr + mx * 15 * dpr;
        const py =
          p.y * H + Math.sin(t * p.drift) * 4 * dpr + my * 10 * dpr - sy * 0.2 * dpr;
        const pr = p.r * dpr;

        const pg = ctx.createRadialGradient(px - pr * 0.4, py - pr * 0.4, 0, px, py, pr);
        if (p.hue > 0.8) {
          pg.addColorStop(0, `rgba(${r},${g},${b},0.7)`);
          pg.addColorStop(
            0.6,
            `rgba(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},${Math.floor(b * 0.7)},0.5)`
          );
          pg.addColorStop(1, "rgba(15,23,42,0.2)");
        } else {
          pg.addColorStop(0, "rgba(167,139,250,0.5)");
          pg.addColorStop(0.6, "rgba(90,60,180,0.35)");
          pg.addColorStop(1, "rgba(15,23,42,0.15)");
        }
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.clip();
        const rot = t * p.spin * speed;
        for (let bi = 0; bi < p.bands; bi++) {
          const phase = rot + (bi * Math.PI * 2) / p.bands;
          const bandOffset = Math.sin(phase) * pr * 0.9;
          const bandY = py + (bi - (p.bands - 1) / 2) * pr * 0.45;
          const bandH = pr * 0.18;
          const bandAlpha = 0.18 + 0.12 * Math.cos(phase);
          ctx.beginPath();
          ctx.ellipse(px + bandOffset * 0.3, bandY, pr * 1.05, bandH, 0, 0, Math.PI * 2);
          ctx.fillStyle =
            p.hue > 0.8
              ? `rgba(${Math.floor(r * 0.7)},${Math.floor(g * 0.7)},${Math.floor(b * 0.9)},${bandAlpha})`
              : `rgba(140,100,220,${bandAlpha})`;
          ctx.fill();
        }
        const termX = Math.cos(rot) * pr * 1.2;
        const shadow = ctx.createLinearGradient(px + termX - pr, py, px + termX + pr, py);
        shadow.addColorStop(0, "rgba(5,10,20,0)");
        shadow.addColorStop(0.5, "rgba(5,10,20,0.35)");
        shadow.addColorStop(1, "rgba(5,10,20,0.6)");
        ctx.fillStyle = shadow;
        ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();

        if (p.ring) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.35 + my * 0.1);
          ctx.scale(1, 0.25);
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
          ctx.lineWidth = 2 * dpr;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, pr * 1.85, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},0.18)`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Wireframe grid
      const cx = W / 2 + mx * 60 * dpr;
      const horizon = H * 0.62 + sy * 0.15 * dpr;

      const hg = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, H * 0.5);
      hg.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
      hg.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(0, horizon - H * 0.2, W, H - (horizon - H * 0.2));

      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W, horizon);
      ctx.stroke();

      const rows = 20;
      const cols = 22;
      const scroll = (t * 40 * speed) % (H * 0.05);
      for (let i = 0; i <= rows; i++) {
        const p = i / rows;
        const y = horizon + Math.pow(p, 1.3) * (H - horizon) + scroll * Math.pow(p, 1.2);
        if (y > H) continue;
        const alpha = 0.35 * (1 - p * 0.7);
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
        ctx.strokeStyle = `rgba(${r},${g},${b},0.3)`;
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
  }, [variant, intensity, parallax, mouse]);

  return (
    <>
      <canvas ref={canvasRef} className="hero-bg-canvas" aria-hidden="true" />
      <div className="hero-bg-vignette" aria-hidden="true" />
    </>
  );
}
