import { useEffect, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";
import { startCanvasLoop } from "../hooks/canvasLoop";

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

/** Canvas de « pluie de code » — en boucle uniquement quand visible. */
export function useCodeCanvas(cols: number, rows: number) {
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

    function drawFrame() {
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
    }

    // Frame statique : la grille remplie, sans scintillement.
    function staticFrame() {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) opacities[r]![c] = grid[r]![c]!.targetOpacity;
      }
      frame = 1; // évite les mutations des branches %3/%10
      drawFrame();
    }

    return startCanvasLoop(canvas, { draw: drawFrame, staticFrame });
  }, [cols, rows]);

  return canvasRef;
}
