export type EntranceStep = {
  selector: string;
  delay: number;
  type: "node" | "arrow" | "line" | "group";
};

export function runEntrance(
  container: HTMLElement,
  sequence: EntranceStep[],
): Promise<void> {
  return new Promise((resolve) => {
    let completed = 0;
    const total = sequence.length;

    if (total === 0) { resolve(); return; }

    for (const step of sequence) {
      const el = container.querySelector(step.selector) as SVGElement | null;
      if (!el) {
        completed++;
        if (completed === total) setTimeout(resolve, 400);
        continue;
      }

      setTimeout(() => {
        switch (step.type) {
          case "node":
            el.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
            break;

          case "arrow": {
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
            break;
          }

          case "line": {
            const pathEl = el as unknown as SVGPathElement;
            if (pathEl.getTotalLength) {
              const len = pathEl.getTotalLength();
              pathEl.style.strokeDasharray = `${len}`;
              pathEl.style.strokeDashoffset = `${len}`;
              pathEl.style.transition = "stroke-dashoffset 300ms ease-out";
              pathEl.getBoundingClientRect();
              pathEl.style.strokeDashoffset = "0";
            }
            el.style.transition = "opacity 300ms ease-out";
            el.style.opacity = "1";
            break;
          }

          case "group":
            el.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            break;
        }

        completed++;
        if (completed === total) setTimeout(resolve, 400);
      }, step.delay);
    }
  });
}

export function showAllElements(container: HTMLElement, selector: string): void {
  const elements = container.querySelectorAll(selector);
  elements.forEach((node) => {
    const el = node as SVGElement;
    el.style.opacity = "1";
    el.style.transform = "none";
    const path = el.querySelector(".arrow-path") as SVGPathElement | null;
    if (path) path.style.strokeDashoffset = "0";
    if ((el as unknown as SVGPathElement).getTotalLength) {
      el.style.strokeDashoffset = "0";
    }
  });
}
