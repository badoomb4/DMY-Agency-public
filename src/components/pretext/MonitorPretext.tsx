import { useEffect, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";

const FONT_SIZE = 9;
const FONT = `500 ${FONT_SIZE}px 'Geist Mono', monospace`;
const LINE_H = 13;
const CHARSET = "{}[]()<>=+-*/|&!?;:_.#@$%^~01αβγδλπΣΩ∞∂∫";
const COLORS = ["#fa5d19", "#3b82f6", "#22c55e", "#a855f7", "#737373"];

type CharCell = { char: string; color: string; width: number; targetOpacity: number };

function randomChar() {
  const char = CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  const prepared = prepareWithSegments(char, FONT);
  const width = prepared.widths.length > 0 ? prepared.widths[0]! : FONT_SIZE * 0.6;
  return { char, width };
}

function initGrid(cols: number, rows: number): CharCell[][] {
  const grid: CharCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CharCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        ...randomChar(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        targetOpacity: Math.random() < 0.3 ? 0 : Math.random() * 0.6 + 0.2,
      });
    }
    grid.push(row);
  }
  return grid;
}

function useCodeCanvas(cols: number, rows: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const cw = cols * FONT_SIZE * 0.7;
    const ch = rows * LINE_H;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.scale(dpr, dpr);

    const grid = initGrid(cols, rows);
    const opacities = grid.map((row) => row.map(() => 0));
    let frame = 0;
    let raf: number;

    function render() {
      frame++;
      ctx.clearRect(0, 0, cw, ch);

      if (frame % 3 === 0) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const cell = grid[r]![c]!;
        Object.assign(cell, randomChar());
        cell.color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
        cell.targetOpacity = Math.random() < 0.2 ? 0 : Math.random() * 0.7 + 0.2;
      }
      if (frame % 10 === 0) {
        const r = Math.floor(Math.random() * rows);
        for (let c = 0; c < cols; c++) {
          const cell = grid[r]![c]!;
          Object.assign(cell, randomChar());
          cell.targetOpacity = Math.random() * 0.5 + 0.3;
        }
      }

      ctx.font = FONT;
      ctx.textBaseline = "top";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r]![c]!;
          const cur = opacities[r]![c]!;
          opacities[r]![c] = cur + (cell.targetOpacity - cur) * 0.08;
          if (opacities[r]![c]! < 0.02) continue;
          ctx.globalAlpha = opacities[r]![c]!;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, c * FONT_SIZE * 0.7, r * LINE_H);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [cols, rows]);

  return canvasRef;
}

function BrowserWindow({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div style={{ background: "#ffffff", borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      {/* Title bar */}
      <div style={{ background: "#f5f5f5", borderBottom: "1px solid #e0e0e0", padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        {/* URL bar */}
        <div style={{ flex: 1, background: "#ffffff", borderRadius: 4, border: "1px solid #e0e0e0", padding: "2px 8px", fontSize: 9, color: "#a3a3a3", fontFamily: "'Geist', sans-serif" }}>
          {url}
        </div>
      </div>
      {/* Toolbar */}
      <div style={{ background: "#fafafa", borderBottom: "1px solid #ededed", padding: "4px 10px", display: "flex", gap: 12 }}>
        <div style={{ width: 30, height: 3, borderRadius: 2, background: "#d4d4d4" }} />
        <div style={{ width: 40, height: 3, borderRadius: 2, background: "#d4d4d4" }} />
        <div style={{ width: 25, height: 3, borderRadius: 2, background: "#d4d4d4" }} />
        <div style={{ width: 35, height: 3, borderRadius: 2, background: "#fa5d19", marginLeft: "auto" }} />
      </div>
      {/* Content */}
      <div style={{ background: "#ffffff", padding: 8 }}>
        {children}
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "8px 4px", border: "2px solid #333", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
      {/* Notch */}
      <div style={{ width: 40, height: 4, background: "#333", borderRadius: 4, margin: "0 auto 4px" }} />
      {/* Screen */}
      <div style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", padding: 6 }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px 4px", fontSize: 7, color: "#a3a3a3", fontFamily: "'Geist', sans-serif" }}>
          <span>9:41</span>
          <span>●●● ▐█▌</span>
        </div>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{ width: 32, height: 3, background: "#555", borderRadius: 3, margin: "6px auto 2px" }} />
    </div>
  );
}

export function MonitorPretext() {
  const browserCanvas = useCodeCanvas(44, 16);
  const phoneCanvas = useCodeCanvas(18, 14);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, width: "100%", height: "100%", padding: "20px 16px" }}>
      {/* Desktop browser */}
      <div style={{ flex: 1, maxWidth: 340 }}>
        <BrowserWindow url="https://app.votreprojet.com">
          <canvas ref={browserCanvas} style={{ display: "block", width: "100%" }} />
        </BrowserWindow>
      </div>

      {/* Smartphone */}
      <div style={{ flexShrink: 0 }}>
        <PhoneFrame>
          <canvas ref={phoneCanvas} style={{ display: "block" }} />
        </PhoneFrame>
      </div>
    </div>
  );
}
