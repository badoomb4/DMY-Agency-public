import { useEffect, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";

const FONT_SIZE = 4;
const FONT = `700 ${FONT_SIZE}px 'Geist Mono', monospace`;
const CHARS = "01!@#$%&*+=<>?{}[]~^αβγδπΣΩ∞∂∫λ";
const GRID = 50;
const CELL = FONT_SIZE * 1;
const LOGO_SIZE = GRID * CELL;
const GAP = 100;
const SPEED = 0.5;
const SAMPLE = 100;

type CellData = { char: string; opacity: number };
type LogoEntry = { src: string; color: string };
type LogoData = { grid: CellData[][]; color: string };

let measured = false;
function ensure() {
  if (!measured) { CHARS.split("").forEach((c) => prepareWithSegments(c, FONT)); measured = true; }
}
function pick() { return CHARS[Math.floor(Math.random() * CHARS.length)]!; }

function rasterize(img: HTMLImageElement): CellData[][] {
  const hi = document.createElement("canvas");
  hi.width = SAMPLE; hi.height = SAMPLE;
  const hc = hi.getContext("2d")!;
  hc.drawImage(img, 0, 0, SAMPLE, SAMPLE);
  const d = hc.getImageData(0, 0, SAMPLE, SAMPLE).data;

  const hi2 = document.createElement("canvas");
  hi2.width = SAMPLE; hi2.height = SAMPLE;
  const hc2 = hi2.getContext("2d")!;
  hc2.fillStyle = "#ffffff";
  hc2.fillRect(0, 0, SAMPLE, SAMPLE);
  hc2.drawImage(img, 0, 0, SAMPLE, SAMPLE);
  const d2 = hc2.getImageData(0, 0, SAMPLE, SAMPLE).data;

  const cW = SAMPLE / GRID, cH = SAMPLE / GRID;
  const grid: CellData[][] = [];
  for (let r = 0; r < GRID; r++) {
    const row: CellData[] = [];
    for (let col = 0; col < GRID; col++) {
      const x0 = Math.floor(col * cW), y0 = Math.floor(r * cH);
      const x1 = Math.floor((col + 1) * cW), y1 = Math.floor((r + 1) * cH);
      let darkSum = 0, cnt = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * SAMPLE + x) * 4;
          if (d[i + 3]! < 10) continue;
          const lum = (d2[i]! * 0.299 + d2[i + 1]! * 0.587 + d2[i + 2]! * 0.114) / 255;
          darkSum += 1 - lum;
          cnt++;
        }
      }
      const darkness = cnt > 0 ? darkSum / cnt : 0;
      row.push({ char: pick(), opacity: darkness > 0.1 ? Math.min(1, darkness * 2.5) : 0 });
    }
    grid.push(row);
  }
  return grid;
}

interface Props {
  logos: LogoEntry[];
}

export function ScrollingLogos({ logos }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ensure();
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    let loaded = 0;
    const logoData: LogoData[] = [];
    logos.forEach((logo) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        logoData.push({ grid: rasterize(img), color: logo.color });
        loaded++;
      };
      img.src = logo.src;
    });

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    let raf: number, frame = 0, offsetX = 0;
    const totalW = logos.length * LOGO_SIZE + (logos.length - 1) * GAP + GAP;

    function render() {
      frame++;
      if (loaded < logos.length) { raf = requestAnimationFrame(render); return; }

      const rect = canvas!.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      offsetX -= SPEED;
      if (Math.abs(offsetX) >= totalW) offsetX += totalW;

      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const yOff = (h - LOGO_SIZE) / 2;
      const shimmerBase = frame * 0.025;
      const copies = Math.ceil(w / totalW) + 2;

      for (let copy = 0; copy < copies; copy++) {
        for (let li = 0; li < logoData.length; li++) {
          const ld = logoData[li]!;
          const baseX = offsetX + copy * totalW + li * (LOGO_SIZE + GAP);

          for (let r = 0; r < GRID; r++) {
            for (let c = 0; c < GRID; c++) {
              const cell = ld.grid[r]![c]!;
              if (cell.opacity === 0) continue;
              if (Math.random() < 0.005) cell.char = pick();
              const shimmer = Math.sin(shimmerBase + r * 0.4 + c * 0.4) * 0.15 + 0.85;
              ctx.globalAlpha = cell.opacity * shimmer;
              ctx.fillStyle = ld.color;
              ctx.fillText(cell.char, baseX + c * CELL + CELL / 2, yOff + r * CELL + CELL / 2);
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [logos]);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",
    }} />
  );
}
