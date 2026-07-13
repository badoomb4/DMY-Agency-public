import { useEffect, useRef, useState, useCallback, type RefObject } from "react";

const COLOR_MAIN = "#fa5d19";
const COLOR_LIGHT = "#fdcfb8";
const COLOR_GRAY = "#d4d4d4";

export interface VortexConfig {
  particleCount: number;
  minRadius: number;
  maxRadius: number;
  speedMin: number;
  speedMax: number;
  sizeMin: number;
  sizeMax: number;
  opacityMin: number;
  opacityMax: number;
  stretchX: number;
  stretchY: number;
  centerY: number;
  eyeRadius: number;
  glowRadius: number;
  glowOpacity: number;
  mouseRadius: number;
  mouseForce: number;
}


const DEFAULT_CONFIG: VortexConfig = {
  particleCount: 400,
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
  eyeRadius: 0,
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

function createParticle(cfg: VortexConfig): Particle {
  const ring = Math.random();
  return {
    angle: Math.random() * Math.PI * 2,
    radius: cfg.minRadius + ring * (cfg.maxRadius - cfg.minRadius),
    speed: (cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin)) * (ring < 0.3 ? 1.6 : 1),
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    opacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin),
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
  const configRef = useRef<VortexConfig>({ ...DEFAULT_CONFIG });
  const particlesRef = useRef<Particle[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [cfg, setCfg] = useState<VortexConfig>({ ...DEFAULT_CONFIG });

  const rebuild = useCallback(() => {
    configRef.current = { ...cfg };
    const ps: Particle[] = [];
    for (let i = 0; i < cfg.particleCount; i++) ps.push(createParticle(cfg));
    particlesRef.current = ps;
  }, [cfg]);

  useEffect(() => { rebuild(); }, [rebuild]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const trackEl: HTMLElement | null =
      trackRef?.current ?? canvas.closest("section") ?? canvas.parentElement;
    if (!trackEl) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const mouse = { x: -999, y: -999, active: false };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }
    trackEl.addEventListener("mousemove", onMove);
    trackEl.addEventListener("mouseleave", onLeave);

    let raf: number;
    function render() {
      const c = configRef.current;
      const particles = particlesRef.current;
      const rect = canvas!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h * c.centerY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.angle += p.speed;
        p.radius += p.drift * 0.3;
        if (p.radius < c.minRadius) p.drift = Math.abs(p.drift);
        if (p.radius > c.maxRadius) p.drift = -Math.abs(p.drift);

        const px = cx + Math.cos(p.angle) * p.radius * c.stretchX;
        const py = cy + Math.sin(p.angle) * p.radius * c.stretchY;

        if (mouse.active) {
          const mdx = px - mouse.x;
          const mdy = py - mouse.y;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < c.mouseRadius) {
            p.angle += (c.mouseRadius - md) * c.mouseForce;
          }
        }

        const distFromCenter = Math.sqrt((px - cx) ** 2 + ((py - cy) * 2.2) ** 2);
        const fade = distFromCenter < c.eyeRadius ? distFromCenter / c.eyeRadius : 1;

        ctx.globalAlpha = p.opacity * fade;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = c.glowOpacity;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.glowRadius);
      grad.addColorStop(0, COLOR_MAIN);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - c.glowRadius, cy - c.glowRadius, c.glowRadius * 2, c.glowRadius * 2);
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      trackEl.removeEventListener("mousemove", onMove);
      trackEl.removeEventListener("mouseleave", onLeave);
    };
  }, [trackRef]);

  // Toggle with Shift+V
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "V") setShowPanel((p) => !p);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {showPanel && (
        <VortexPanel cfg={cfg} onChange={(next) => { setCfg(next); configRef.current = next; }} onRebuild={rebuild} />
      )}
    </>
  );
}

/* ---------- Debug Panel ---------- */

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
      <span style={{ width: 90, flexShrink: 0, color: "#ccc" }}>{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "#fa5d19" }}
      />
      <span style={{ width: 50, textAlign: "right", color: "#fa5d19", fontFamily: "monospace" }}>
        {step < 0.001 ? value.toFixed(5) : step < 1 ? value.toFixed(2) : value}
      </span>
    </div>
  );
}

function VortexPanel({ cfg, onChange, onRebuild }: {
  cfg: VortexConfig;
  onChange: (c: VortexConfig) => void;
  onRebuild: () => void;
}) {
  function set<K extends keyof VortexConfig>(key: K, value: VortexConfig[K]) {
    onChange({ ...cfg, [key]: value });
  }

  function logConfig() {
    const out = Object.entries(cfg).map(([k, v]) => `  ${k}: ${v},`).join("\n");
    console.log(`VortexConfig:\n{\n${out}\n}`);
  }

  return (
    <div style={{
      position: "fixed", top: 10, right: 10, zIndex: 9999,
      background: "#1a1a1a", border: "1px solid #333", borderRadius: 8,
      padding: "12px 16px", width: 340, maxHeight: "90vh", overflowY: "auto",
      fontFamily: "'Geist', sans-serif", color: "#fff",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fa5d19" }}>Vortex Config</span>
        <span style={{ fontSize: 9, color: "#666" }}>Shift+V pour fermer</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Slider label="Particules" value={cfg.particleCount} min={20} max={400} step={10} onChange={(v) => set("particleCount", v)} />
        <Slider label="Rayon min" value={cfg.minRadius} min={10} max={200} step={5} onChange={(v) => set("minRadius", v)} />
        <Slider label="Rayon max" value={cfg.maxRadius} min={100} max={800} step={10} onChange={(v) => set("maxRadius", v)} />
        <Slider label="Vitesse min" value={cfg.speedMin} min={0.0001} max={0.005} step={0.0001} onChange={(v) => set("speedMin", v)} />
        <Slider label="Vitesse max" value={cfg.speedMax} min={0.0002} max={0.01} step={0.0001} onChange={(v) => set("speedMax", v)} />
        <Slider label="Taille min" value={cfg.sizeMin} min={0.5} max={5} step={0.5} onChange={(v) => set("sizeMin", v)} />
        <Slider label="Taille max" value={cfg.sizeMax} min={1} max={10} step={0.5} onChange={(v) => set("sizeMax", v)} />
        <Slider label="Opacité min" value={cfg.opacityMin} min={0.01} max={0.5} step={0.01} onChange={(v) => set("opacityMin", v)} />
        <Slider label="Opacité max" value={cfg.opacityMax} min={0.05} max={1} step={0.01} onChange={(v) => set("opacityMax", v)} />
        <Slider label="Étirement X" value={cfg.stretchX} min={0.5} max={3} step={0.1} onChange={(v) => set("stretchX", v)} />
        <Slider label="Étirement Y" value={cfg.stretchY} min={0.1} max={2} step={0.05} onChange={(v) => set("stretchY", v)} />
        <Slider label="Centre Y" value={cfg.centerY} min={0.1} max={0.9} step={0.01} onChange={(v) => set("centerY", v)} />
        <Slider label="Oeil (rayon)" value={cfg.eyeRadius} min={0} max={400} step={10} onChange={(v) => set("eyeRadius", v)} />
        <Slider label="Glow rayon" value={cfg.glowRadius} min={50} max={500} step={10} onChange={(v) => set("glowRadius", v)} />
        <Slider label="Glow opacité" value={cfg.glowOpacity} min={0} max={0.2} step={0.005} onChange={(v) => set("glowOpacity", v)} />
        <Slider label="Mouse rayon" value={cfg.mouseRadius} min={20} max={300} step={10} onChange={(v) => set("mouseRadius", v)} />
        <Slider label="Mouse force" value={cfg.mouseForce} min={0.00001} max={0.0005} step={0.00001} onChange={(v) => set("mouseForce", v)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={onRebuild} style={{
          flex: 1, padding: "6px 0", background: "#fa5d19", color: "#fff",
          border: "none", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>Appliquer</button>
        <button onClick={logConfig} style={{
          flex: 1, padding: "6px 0", background: "#333", color: "#ccc",
          border: "1px solid #555", borderRadius: 4, fontSize: 11, cursor: "pointer",
        }}>Log config</button>
      </div>
    </div>
  );
}
