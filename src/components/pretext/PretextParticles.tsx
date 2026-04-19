import { useEffect, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";
import {
  COLS, ROWS, FIELD_COLS, FIELD_ROWS,
  createParticles, simulate,
} from "./particleEngine";

const MONO_RAMP = " .`-_:,;^=+/|)\\!?0oOQ#%@";
const FONT_SIZE = 13;
const LINE_HEIGHT = 16;
const PROP_FAMILY = "Georgia, 'Times New Roman', serif";

function buildPalette() {
  const weights = [300, 500, 800] as const;
  const chars = " .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyz0123456789";
  const entries: { char: string; cls: string; width: number; brightness: number }[] = [];

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 20;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  for (const w of weights) {
    const font = `${w} ${FONT_SIZE}px ${PROP_FAMILY}`;
    for (const ch of chars) {
      if (ch === " ") continue;
      const prepared = prepareWithSegments(ch, font);
      const width = prepared.widths.length > 0 ? prepared.widths[0]! : 0;
      if (width <= 0) continue;
      ctx.clearRect(0, 0, 20, 20);
      ctx.font = font;
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 1, 10);
      const data = ctx.getImageData(0, 0, 20, 20).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) sum += data[i]!;
      entries.push({ char: ch, cls: `w${w}`, width, brightness: sum / (255 * 400) });
    }
  }

  const max = Math.max(...entries.map((e) => e.brightness));
  if (max > 0) entries.forEach((e) => (e.brightness /= max));
  entries.sort((a, b) => a.brightness - b.brightness);
  return entries;
}

function esc(ch: string) {
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  if (ch === "&") return "&amp;";
  return ch;
}

export function PretextParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette = buildPalette();
    const targetW = container.clientWidth / COLS;

    const lookup: { mono: string; prop: string }[] = [];
    for (let b = 0; b < 256; b++) {
      const br = b / 255;
      const mono = MONO_RAMP[Math.min(MONO_RAMP.length - 1, (br * MONO_RAMP.length) | 0)]!;
      if (br < 0.03) { lookup.push({ mono, prop: " " }); continue; }
      let best = palette[0]!;
      let bestScore = Infinity;
      for (const e of palette) {
        const score = Math.abs(e.brightness - br) * 2.5 + Math.abs(e.width - targetW) / targetW;
        if (score < bestScore) { bestScore = score; best = e; }
      }
      const a = Math.max(1, Math.min(10, Math.round(br * 10)));
      lookup.push({ mono, prop: `<span class="${best.cls}" style="opacity:${a / 10}">${esc(best.char)}</span>` });
    }

    const rows: HTMLDivElement[] = [];
    container.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
      const row = document.createElement("div");
      row.style.height = row.style.lineHeight = `${LINE_HEIGHT}px`;
      row.style.whiteSpace = "nowrap";
      row.style.overflow = "hidden";
      row.style.fontFamily = PROP_FAMILY;
      row.style.fontSize = `${FONT_SIZE}px`;
      row.style.color = "#fa5d19";
      container.appendChild(row);
      rows.push(row);
    }

    const particles = createParticles();
    const field = new Float32Array(FIELD_COLS * FIELD_ROWS);
    let raf: number;
    const oversample = 2;

    function render(now: number) {
      simulate(particles, field, now);
      for (let r = 0; r < ROWS; r++) {
        let html = "";
        const frs = r * oversample * FIELD_COLS;
        for (let c = 0; c < COLS; c++) {
          const fcs = c * oversample;
          let br = 0;
          for (let sy = 0; sy < oversample; sy++) {
            const off = frs + sy * FIELD_COLS + fcs;
            for (let sx = 0; sx < oversample; sx++) br += field[off + sx]!;
          }
          html += lookup[Math.min(255, ((br / (oversample * oversample)) * 255) | 0)]!.prop;
        }
        rows[r]!.innerHTML = html;
      }
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: ROWS * LINE_HEIGHT,
        overflow: "hidden",
        userSelect: "none",
        opacity: 0.6,
      }}
    />
  );
}
