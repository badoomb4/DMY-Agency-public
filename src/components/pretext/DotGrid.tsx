import { useEffect, useRef, type RefObject } from "react";
import { prepareWithSegments } from "@chenglou/pretext";

const CELL = 14;
const DOT_RADIUS = 1.5;
const CROSS_ARM = 20; // longueur de chaque branche du "+" en px
const CROSS_THICK = CELL; // épaisseur d'une branche = 1 cellule
const FONT_SIZE = 10;
const FONT = `500 ${FONT_SIZE}px 'Geist Mono', 'Geist', monospace`;
const FADE_SPEED = 0.08;
const SHIMMER_SPEED = 0.008;
const COLOR_DOT = "#d4d4d4";
const COLOR_CHAR = "#fa5d19";

type Cell = {
  char: string;
  width: number;
  intensity: number;
  shimmerPhase: number;
};

const CHARSET = "01!@#$%&*+=<>?/\\|{}[]~^:.;";

function pickChar(): { char: string; width: number } {
  const char = CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  const prepared = prepareWithSegments(char, FONT);
  const width = prepared.widths.length > 0 ? prepared.widths[0]! : FONT_SIZE * 0.1;
  return { char, width };
}

interface Props {
  trackRef: RefObject<HTMLElement | null>;
}

export function DotGrid({ trackRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    cells: Cell[][] | null;
    mouse: { x: number; y: number; active: boolean };
    cols: number;
    rows: number;
  }>({ cells: null, mouse: { x: -999, y: -999, active: false }, cols: 0, rows: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const trackEl = trackRef.current;
    if (!canvas || !trackEl) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(rect.width / CELL) + 1;
      const rows = Math.ceil(rect.height / CELL) + 1;
      const s = stateRef.current;
      const oldCells = s.cells;
      const cells: Cell[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: Cell[] = [];
        for (let c = 0; c < cols; c++) {
          const old = oldCells?.[r]?.[c];
          row.push(old ?? {
            ...pickChar(),
            intensity: 0,
            shimmerPhase: Math.random() * Math.PI * 2,
          });
        }
        cells.push(row);
      }
      s.cells = cells;
      s.cols = cols;
      s.rows = rows;
    }

    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      stateRef.current.mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function onLeave() {
      stateRef.current.mouse.active = false;
    }

    trackEl.addEventListener("mousemove", onMove);
    trackEl.addEventListener("mouseleave", onLeave);

    let raf: number;
    function render(now: number) {
      const { cells, mouse, cols, rows } = stateRef.current;
      if (!cells) { raf = requestAnimationFrame(render); return; }

      const rect = canvas!.getBoundingClientRect();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[r]![c]!;
          const cx = c * CELL;
          const cy = r * CELL;
          const dx = Math.abs(mouse.x - cx);
          const dy = Math.abs(mouse.y - cy);
          // Forme en "+" : branche horizontale OU verticale
          const onHorizontal = dy <= CROSS_THICK / 2 && dx <= CROSS_ARM;
          const onVertical = dx <= CROSS_THICK / 2 && dy <= CROSS_ARM;
          const inRange = mouse.active && (onHorizontal || onVertical);

          if (inRange) {
            cell.intensity = Math.min(1, cell.intensity + FADE_SPEED);
            if (Math.random() < 0.02) Object.assign(cell, pickChar());
          } else {
            cell.intensity = Math.max(0, cell.intensity - FADE_SPEED * 0.5);
          }

          const shimmer = Math.sin(now * SHIMMER_SPEED + cell.shimmerPhase) * 0.3 + 0.7;

          if (cell.intensity > 0.01) {
            const charOpacity = cell.intensity;
            ctx.font = FONT;
            ctx.fillStyle = COLOR_CHAR;
            ctx.globalAlpha = charOpacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cell.char, cx, cy);
          }

          const dotOpacity = (1 - cell.intensity) * 0.5 * shimmer;
          if (dotOpacity > 0.01) {
            ctx.globalAlpha = dotOpacity;
            ctx.fillStyle = COLOR_DOT;
            ctx.beginPath();
            ctx.arc(cx, cy, DOT_RADIUS, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = 1;
        }
      }
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

  return (
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
  );
}
