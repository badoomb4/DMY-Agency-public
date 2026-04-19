import { useEffect, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";

const FONT_SIZE = 4;
const FONT = `700 ${FONT_SIZE}px 'Geist Mono', monospace`;
const LOGO_CHARS = "01!@#$%&*+=<>?{}[]~^αβγδπΣΩ∞∂∫λ";
const GLITCH_CHARS = "●○◉◎⬡⬢▪▫◆◇★☆<>/\\|{}[]~^";
const GRID = 60;
const CELL = FONT_SIZE * 1.1;
const SIZE = GRID * CELL;
const SAMPLE = 500;
const CROSS_ARM = 2;

type CellData = {
  logoChar: string;
  displayChar: string;
  baseOpacity: number;
  glitchTimer: number;
};

let charsMeasured = false;
function ensureMeasured() {
  if (!charsMeasured) {
    LOGO_CHARS.split("").forEach((ch) => prepareWithSegments(ch, FONT));
    charsMeasured = true;
  }
}

function pickLogoChar() {
  return LOGO_CHARS[Math.floor(Math.random() * LOGO_CHARS.length)]!;
}
function pickGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
}

function rasterizeSvg(img: HTMLImageElement): CellData[][] {
  const hi = document.createElement("canvas");
  hi.width = SAMPLE; hi.height = SAMPLE;
  const hc = hi.getContext("2d")!;
  hc.drawImage(img, 0, 0, SAMPLE, SAMPLE);
  const d = hc.getImageData(0, 0, SAMPLE, SAMPLE).data;
  const cW = SAMPLE / GRID, cH = SAMPLE / GRID;
  const grid: CellData[][] = [];
  for (let r = 0; r < GRID; r++) {
    const row: CellData[] = [];
    for (let col = 0; col < GRID; col++) {
      const x0 = Math.floor(col * cW), y0 = Math.floor(r * cH);
      const x1 = Math.floor((col + 1) * cW), y1 = Math.floor((r + 1) * cH);
      let sum = 0, cnt = 0;
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) { sum += d[(y * SAMPLE + x) * 4 + 3]!; cnt++; }
      const a = cnt > 0 ? sum / (cnt * 255) : 0;
      const ch = pickLogoChar();
      row.push({ logoChar: ch, displayChar: ch, baseOpacity: a > 0.15 ? a : 0, glitchTimer: 0 });
    }
    grid.push(row);
  }
  return grid;
}

interface LogoProps {
  src: string; color: string; glitchColor: string; label: string;
}

function LogoCanvas({ src, color, glitchColor, label }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ col: -99, row: -99 });
  const stateRef = useRef<{ grid: CellData[][] | null; opacities: number[][] | null }>(
    { grid: null, opacities: null },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ensureMeasured();
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr; canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      stateRef.current.grid = rasterizeSvg(img);
      stateRef.current.opacities = stateRef.current.grid.map(
        (row) => row.map(() => 0),
      );
    };
    img.src = src;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        col: Math.floor((e.clientX - rect.left) / CELL),
        row: Math.floor((e.clientY - rect.top) / CELL),
      };
    };
    const onLeave = () => { mouseRef.current = { col: -99, row: -99 }; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let raf: number, frame = 0;

    function render() {
      frame++;
      const { grid, opacities } = stateRef.current;
      if (!grid || !opacities) { raf = requestAnimationFrame(render); return; }
      const { col: mc, row: mr } = mouseRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.font = FONT; ctx.textAlign = "center"; ctx.textBaseline = "middle";

      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const cell = grid[r]![c]!;
          if (cell.baseOpacity === 0) continue;
          opacities[r]![c] += (cell.baseOpacity - opacities[r]![c]!) * 0.06;
          if (opacities[r]![c]! < 0.02) continue;
          if (Math.random() < 0.008) cell.displayChar = pickLogoChar();

          const dr = Math.abs(r - mr), dc = Math.abs(c - mc);
          const onCross = (dr === 0 && dc <= CROSS_ARM) || (dc === 0 && dr <= CROSS_ARM);

          if (onCross) {
            if (cell.glitchTimer <= 0) cell.glitchTimer = 4 + Math.floor(Math.random() * 6);
            if (Math.random() < 0.5) cell.displayChar = pickGlitchChar();
          } else if (cell.glitchTimer > 0) {
            cell.glitchTimer--;
            if (Math.random() < 0.3) cell.displayChar = pickGlitchChar();
            if (cell.glitchTimer === 0) cell.displayChar = pickLogoChar();
          }

          const shimmer = Math.sin(frame * 0.03 + r * 0.5 + c * 0.5) * 0.15 + 0.85;
          ctx.globalAlpha = opacities[r]![c]! * shimmer;
          ctx.fillStyle = cell.glitchTimer > 0 ? glitchColor : color;
          ctx.fillText(cell.displayChar, c * CELL + CELL / 2, r * CELL + CELL / 2);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [src, color, glitchColor]);

  return (
    <div style={{ textAlign: "center", cursor: "pointer" }}>
      <canvas ref={canvasRef}
        style={{ width: SIZE, height: SIZE, display: "block", margin: "0 auto" }} />
      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600,
        color, fontFamily: "'Geist', sans-serif" }}>{label}</div>
    </div>
  );
}

export function BotLogos() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      gap: 48, width: "100%", height: "100%", padding: 24 }}>
      <LogoCanvas src="/illustrations/telegram.svg"
        color="#26A5E4" glitchColor="#fa5d19" label="Telegram" />
      <LogoCanvas src="/illustrations/whatsapp.svg"
        color="#25D366" glitchColor="#fa5d19" label="WhatsApp" />
    </div>
  );
}
