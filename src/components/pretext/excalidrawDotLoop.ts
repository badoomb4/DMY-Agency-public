export type DotLoopConfig = {
  dotId?: string;
  linearPathIds: string[];
  forkPathIds: string[];
  endpointIds?: string[];
  cycleDuration?: number;
  pauseDuration?: number;
};

export function startDotLoop(
  container: HTMLElement,
  config: DotLoopConfig,
): () => void {
  const {
    dotId = "#dot-pulse",
    linearPathIds,
    forkPathIds,
    cycleDuration = 3000,
    pauseDuration = 1000,
  } = config;

  const dot = container.querySelector(dotId) as SVGCircleElement | null;
  if (!dot) return () => {};

  const linearPaths = linearPathIds
    .map((id) => {
      const el = container.querySelector(id);
      if (!el) return null;
      const path = el.classList.contains("arrow-path")
        ? (el as SVGPathElement)
        : (el.querySelector(".arrow-path") as SVGPathElement | null) || (el as SVGPathElement);
      return path?.getTotalLength ? path : null;
    })
    .filter(Boolean) as SVGPathElement[];

  const forkPaths = forkPathIds
    .map((id) => {
      const el = container.querySelector(id);
      if (!el) return null;
      const path = el.classList.contains("arrow-path")
        ? (el as SVGPathElement)
        : (el.querySelector(".arrow-path") as SVGPathElement | null) || (el as SVGPathElement);
      return path?.getTotalLength ? path : null;
    })
    .filter(Boolean) as SVGPathElement[];

  if (linearPaths.length === 0) return () => {};

  const linearLens = linearPaths.map((p) => p.getTotalLength());
  const forkLens = forkPaths.map((p) => p.getTotalLength());
  const totalLinear = linearLens.reduce((a, b) => a + b, 0);
  const maxFork = forkLens.length > 0 ? Math.max(...forkLens) : 0;
  const totalLength = totalLinear + maxFork;

  let raf = 0;
  let startTime = 0;
  let clone: SVGCircleElement | null = null;

  function tick(time: number) {
    if (!startTime) startTime = time;
    const elapsed = (time - startTime) % (cycleDuration + pauseDuration);

    if (elapsed > cycleDuration) {
      dot.style.opacity = "0";
      if (clone) clone.style.opacity = "0";
      raf = requestAnimationFrame(tick);
      return;
    }

    const progress = elapsed / cycleDuration;
    const dist = progress * totalLength;

    if (dist <= totalLinear) {
      dot.style.opacity = "1";
      if (clone) clone.style.opacity = "0";
      let remaining = dist;
      for (let i = 0; i < linearPaths.length; i++) {
        if (remaining <= linearLens[i]!) {
          const pt = linearPaths[i]!.getPointAtLength(remaining);
          dot.setAttribute("cx", `${pt.x}`);
          dot.setAttribute("cy", `${pt.y}`);
          break;
        }
        remaining -= linearLens[i]!;
      }
    } else if (forkPaths.length >= 2) {
      const forkDist = dist - totalLinear;
      const fadeOut = 1 - (forkDist / maxFork) * 0.5;
      dot.style.opacity = `${fadeOut}`;

      if (!clone) {
        clone = dot.cloneNode(true) as SVGCircleElement;
        clone.removeAttribute("id");
        dot.parentElement?.appendChild(clone);
      }
      clone.style.opacity = `${fadeOut}`;

      const ptA = forkPaths[0]!.getPointAtLength(Math.min(forkDist, forkLens[0]!));
      dot.setAttribute("cx", `${ptA.x}`);
      dot.setAttribute("cy", `${ptA.y}`);

      const ptB = forkPaths[1]!.getPointAtLength(Math.min(forkDist, forkLens[1]!));
      clone.setAttribute("cx", `${ptB.x}`);
      clone.setAttribute("cy", `${ptB.y}`);
    } else {
      dot.style.opacity = `${Math.max(0, 1 - (dist - totalLinear) / 50)}`;
    }

    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    if (clone) { clone.remove(); clone = null; }
    dot.style.opacity = "0";
  };
}
