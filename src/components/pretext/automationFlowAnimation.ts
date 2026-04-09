const ENTRANCE_SEQUENCE = [
  { selector: "#node-form", delay: 0, type: "node" as const },
  { selector: "#arrow-1", delay: 200, type: "arrow" as const },
  { selector: "#node-sheets", delay: 400, type: "node" as const },
  { selector: "#arrow-2", delay: 600, type: "arrow" as const },
  { selector: "#node-email", delay: 800, type: "node" as const },
  { selector: "#arrow-3a", delay: 1000, type: "arrow" as const },
  { selector: "#arrow-3b", delay: 1000, type: "arrow" as const },
  { selector: "#node-whatsapp", delay: 1200, type: "node" as const },
  { selector: "#node-telegram", delay: 1200, type: "node" as const },
];

export function runEntrance(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    let completed = 0;
    const total = ENTRANCE_SEQUENCE.length;

    for (const step of ENTRANCE_SEQUENCE) {
      const el = container.querySelector(step.selector) as SVGElement | null;
      if (!el) { completed++; continue; }

      setTimeout(() => {
        if (step.type === "node") {
          el.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
        } else {
          const path = el.querySelector(".arrow-path") as SVGPathElement | null;
          if (path) {
            const len = path.getTotalLength();
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len}`;
            path.style.transition = "stroke-dashoffset 300ms ease-out";
            path.getBoundingClientRect();
            path.style.strokeDashoffset = "0";
          }
          el.style.transition = "opacity 300ms ease-out";
          el.style.opacity = "1";
        }
        completed++;
        if (completed === total) {
          setTimeout(resolve, 400);
        }
      }, step.delay);
    }
  });
}

const ARROW_IDS = ["#arrow-1", "#arrow-2"];
const FORK_IDS = ["#arrow-3a", "#arrow-3b"];
const CYCLE_DURATION = 3000;
const PAUSE_DURATION = 1000;

export function startDotLoop(
  container: HTMLElement,
): () => void {
  const dot = container.querySelector("#dot-pulse") as SVGCircleElement | null;
  const dotB = container.querySelector("#dot-pulse-b") as SVGCircleElement | null;
  if (!dot || !dotB) return () => {};

  const arrowPaths = ARROW_IDS.map((id) => {
    const g = container.querySelector(id);
    return g?.querySelector(".arrow-path") as SVGPathElement | null;
  }).filter(Boolean) as SVGPathElement[];

  const forkPaths = FORK_IDS.map((id) => {
    const g = container.querySelector(id);
    return g?.querySelector(".arrow-path") as SVGPathElement | null;
  }).filter(Boolean) as SVGPathElement[];

  if (arrowPaths.length < 2 || forkPaths.length < 2) return () => {};

  const dotEl = dot;
  const dotBEl = dotB;

  const pathLengths = arrowPaths.map((p) => p.getTotalLength());
  const forkLengths = forkPaths.map((p) => p.getTotalLength());
  const totalLinear = pathLengths.reduce((a, b) => a + b, 0);
  const maxFork = Math.max(...forkLengths);
  const totalLength = totalLinear + maxFork;

  let raf = 0;
  let startTime = 0;
  let paused = false;

  function tick(time: number) {
    if (!startTime) startTime = time;
    const elapsed = (time - startTime) % (CYCLE_DURATION + PAUSE_DURATION);

    if (elapsed > CYCLE_DURATION) {
      dotEl.style.opacity = "0";
      dotBEl.style.opacity = "0";
      raf = requestAnimationFrame(tick);
      return;
    }

    const progress = elapsed / CYCLE_DURATION;
    const dist = progress * totalLength;

    if (dist <= totalLinear) {
      dotEl.style.opacity = "1";
      dotBEl.style.opacity = "0";
      let remaining = dist;
      for (let i = 0; i < arrowPaths.length; i++) {
        if (remaining <= pathLengths[i]!) {
          const pt = arrowPaths[i]!.getPointAtLength(remaining);
          dotEl.setAttribute("cx", `${pt.x}`);
          dotEl.setAttribute("cy", `${pt.y}`);
          break;
        }
        remaining -= pathLengths[i]!;
      }
    } else {
      const forkDist = dist - totalLinear;
      dotEl.style.opacity = `${1 - forkDist / maxFork * 0.5}`;
      dotBEl.style.opacity = `${1 - forkDist / maxFork * 0.5}`;

      const ptA = forkPaths[0]!.getPointAtLength(
        Math.min(forkDist, forkLengths[0]!)
      );
      dotEl.setAttribute("cx", `${ptA.x}`);
      dotEl.setAttribute("cy", `${ptA.y}`);

      const ptB = forkPaths[1]!.getPointAtLength(
        Math.min(forkDist, forkLengths[1]!)
      );
      dotBEl.setAttribute("cx", `${ptB.x}`);
      dotBEl.setAttribute("cy", `${ptB.y}`);
    }

    if (!paused) {
      raf = requestAnimationFrame(tick);
    }
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    paused = true;
  };
}

export function createVisibilityObserver(
  element: HTMLElement,
  onVisible: () => void,
  onHidden: () => void,
): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) onVisible();
      else onHidden();
    },
    { threshold: 0.3 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
