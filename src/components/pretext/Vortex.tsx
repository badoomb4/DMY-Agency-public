import { useEffect, useRef, type RefObject } from "react";
import { startCanvasLoop } from "../hooks/canvasLoop";

// Constantes canvas : l'API 2D exige des couleurs résolues (= tokens de marque).
const COLOR_MAIN = "#fa5d19"; // --brand
const COLOR_LIGHT = "#fdcfb8"; // --brand-tint
const COLOR_GRAY = "#d4d4d4"; // --border-strong

const CFG = {
  particleCount: 400,
  particleCountMobile: 160,
  minRadius: 130,
  maxRadius: 310,
  speedMin: 0.0015,
  speedMax: 0.0071,
  sizeMin: 1.5,
  sizeMax: 8.5,
  opacityMin: 0.27,
  opacityMax: 0.76,
  stretchX: 3,
  stretchY: 1.1,
  centerY: 0.44,
  glowRadius: 500,
  glowOpacity: 0.04,
  mouseRadius: 110,
  mouseForce: 0.00041,
};

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  drift: number;
  color: string;
}

function createParticle(): Particle {
  const ring = Math.random();
  return {
    angle: Math.random() * Math.PI * 2,
    radius: CFG.minRadius + ring * (CFG.maxRadius - CFG.minRadius),
    speed: (CFG.speedMin + Math.random() * (CFG.speedMax - CFG.speedMin)) * (ring < 0.3 ? 1.6 : 1),
    size: CFG.sizeMin + Math.random() * (CFG.sizeMax - CFG.sizeMin),
    opacity: CFG.opacityMin + Math.random() * (CFG.opacityMax - CFG.opacityMin),
    drift: (Math.random() - 0.5) * 0.15,
    color: ring < 0.25 ? COLOR_MAIN : ring < 0.5 ? COLOR_LIGHT : COLOR_GRAY,
  };
}

interface Props {
  /** Élément qui suit la souris ; à défaut, la <section> parente du canvas. */
  trackRef?: RefObject<HTMLElement | null>;
}

export function Vortex({ trackRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const trackEl: HTMLElement | null =
      trackRef?.current ?? canvas.closest("section") ?? canvas.parentElement;
    if (!trackEl) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const mouse = { x: -999, y: -999, active: false };

    const count = window.innerWidth < 640 ? CFG.particleCountMobile : CFG.particleCount;
    const particles = Array.from({ length: count }, createParticle);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }
    trackEl.addEventListener("mousemove", onMove);
    trackEl.addEventListener("mouseleave", onLeave);

    function drawFrame() {
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h * CFG.centerY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.angle += p.speed;
        p.radius += p.drift * 0.3;
        if (p.radius < CFG.minRadius) p.drift = Math.abs(p.drift);
        if (p.radius > CFG.maxRadius) p.drift = -Math.abs(p.drift);

        const px = cx + Math.cos(p.angle) * p.radius * CFG.stretchX;
        const py = cy + Math.sin(p.angle) * p.radius * CFG.stretchY;

        if (mouse.active) {
          const mdx = px - mouse.x;
          const mdy = py - mouse.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < CFG.mouseRadius) p.angle += (CFG.mouseRadius - md) * CFG.mouseForce;
        }

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = CFG.glowOpacity;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CFG.glowRadius);
      grad.addColorStop(0, COLOR_MAIN);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - CFG.glowRadius, cy - CFG.glowRadius, CFG.glowRadius * 2, CFG.glowRadius * 2);
      ctx.globalAlpha = 1;
    }

    const stopLoop = startCanvasLoop(canvas, { draw: drawFrame });

    return () => {
      stopLoop();
      window.removeEventListener("resize", resize);
      trackEl.removeEventListener("mousemove", onMove);
      trackEl.removeEventListener("mouseleave", onLeave);
    };
  }, [trackRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
