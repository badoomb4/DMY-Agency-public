const SEPARATOR_IDS = ["#separator-1", "#separator-2", "#separator-3", "#separator-4"];
const ELIMINATION_RATES = [0.4, 0.4, 0.5, 0.5];
const DOT_COUNT = 5;
const DOT_SPEED = 1.2;
const SVG_NS = "http://www.w3.org/2000/svg";

type FunnelDot = {
  el: SVGCircleElement;
  x: number;
  y: number;
  alive: boolean;
  eliminated: boolean;
  exitDirection: number;
};

export function startFunnelLoop(container: HTMLElement): () => void {
  const svgRoot = container.querySelector("svg") as SVGSVGElement | null;
  if (!svgRoot) return () => {};

  const leftPath = container.querySelector("#funnel-left") as SVGPathElement | null;
  const rightPath = container.querySelector("#funnel-right") as SVGPathElement | null;
  if (!leftPath || !rightPath) return () => {};

  const separatorYs = SEPARATOR_IDS.map((id) => {
    const sep = container.querySelector(id) as SVGElement | null;
    if (!sep) return 0;
    const bbox = (sep as unknown as SVGGraphicsElement).getBBox?.();
    return bbox ? bbox.y + bbox.height / 2 : 0;
  });

  const leftBBox = leftPath.getBBox();
  const rightBBox = rightPath.getBBox();
  const topY = Math.min(leftBBox.y, rightBBox.y);
  const bottomY = Math.max(leftBBox.y + leftBBox.height, rightBBox.y + rightBBox.height);

  function getFunnelWidth(y: number): { left: number; right: number } {
    const t = Math.max(0, Math.min(1, (y - topY) / (bottomY - topY)));
    const leftX = leftBBox.x + t * leftBBox.width * 0.4;
    const rightX = rightBBox.x + rightBBox.width - t * rightBBox.width * 0.4;
    return { left: leftX, right: rightX };
  }

  let raf = 0;
  let dots: FunnelDot[] = [];
  let paused = false;

  function createDots(): FunnelDot[] {
    const newDots: FunnelDot[] = [];
    const { left, right } = getFunnelWidth(topY);
    const spacing = (right - left) / (DOT_COUNT + 1);
    for (let i = 0; i < DOT_COUNT; i++) {
      const el = document.createElementNS(SVG_NS, "circle");
      el.setAttribute("r", "3");
      el.setAttribute("fill", "#fa5d19");
      const x = left + spacing * (i + 1);
      el.setAttribute("cx", `${x}`);
      el.setAttribute("cy", `${topY}`);
      svgRoot.appendChild(el);
      newDots.push({
        el, x, y: topY, alive: true, eliminated: false,
        exitDirection: i < DOT_COUNT / 2 ? -1 : 1,
      });
    }
    return newDots;
  }

  function cleanupDots() {
    dots.forEach((d) => d.el.remove());
    dots = [];
  }

  function runCycle() {
    if (paused) return;
    dots = createDots();
    let nextSep = 0;

    function tick() {
      if (paused) { return; }

      let allDone = true;
      for (const d of dots) {
        if (!d.alive) continue;
        allDone = false;

        if (d.eliminated) {
          d.x += d.exitDirection * 2;
          d.el.setAttribute("cx", `${d.x}`);
          const opacity = parseFloat(d.el.getAttribute("opacity") || "1");
          const newOpacity = Math.max(0, opacity - 0.03);
          d.el.setAttribute("opacity", `${newOpacity}`);
          if (newOpacity <= 0) d.alive = false;
          continue;
        }

        d.y += DOT_SPEED;
        const { left, right } = getFunnelWidth(d.y);
        const center = (left + right) / 2;
        d.x += (center - d.x) * 0.02;
        d.x = Math.max(left + 3, Math.min(right - 3, d.x));
        d.el.setAttribute("cx", `${d.x}`);
        d.el.setAttribute("cy", `${d.y}`);

        if (nextSep < separatorYs.length && d.y >= separatorYs[nextSep]!) {
          const aliveDots = dots.filter((dd) => dd.alive && !dd.eliminated);
          if (aliveDots.length > 1 && Math.random() < ELIMINATION_RATES[nextSep]!) {
            d.eliminated = true;
          }
        }

        if (d.y >= bottomY) {
          d.el.setAttribute("r", "5");
          d.el.setAttribute("opacity", "1");
          setTimeout(() => {
            d.el.setAttribute("r", "3");
            d.el.setAttribute("opacity", "0");
            d.alive = false;
          }, 400);
          d.y = bottomY + 1;
        }
      }

      const aliveDots = dots.filter((dd) => dd.alive && !dd.eliminated);
      if (nextSep < separatorYs.length && aliveDots.every((dd) => dd.y > separatorYs[nextSep]!)) {
        nextSep++;
      }

      if (allDone) {
        cleanupDots();
        setTimeout(() => { if (!paused) runCycle(); }, 1500);
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
  }

  runCycle();

  return () => {
    paused = true;
    cancelAnimationFrame(raf);
    cleanupDots();
  };
}
