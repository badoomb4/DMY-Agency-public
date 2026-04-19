# Excalidraw Sections (Process, Mobile, E-commerce) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 animated Excalidraw illustrations (timeline, tree, funnel) to the Process, Mobile, and E-commerce sections, and refactor the existing animation code into reusable modules.

**Architecture:** Extract shared hook (`useExcalidrawFlow`) and split animation logic into 4 focused modules. Migrate existing AutomationFlow. Create 3 new SVGs + components. Each component delegates animation via callbacks to the hook.

**Tech Stack:** React, SVG, CSS animations, IntersectionObserver, requestAnimationFrame. No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-04-09-excalidraw-sections-design.md`

---

## File Structure

```
CREATED:
  src/components/pretext/excalidrawObserver.ts      — createVisibilityObserver (~15 lines)
  src/components/pretext/excalidrawEntrance.ts       — runEntrance, showAllElements, EntranceStep type (~80 lines)
  src/components/pretext/excalidrawDotLoop.ts        — startDotLoop, DotLoopConfig type (~100 lines)
  src/components/pretext/excalidrawFunnelLoop.ts     — startFunnelLoop (~100 lines)
  src/components/pretext/useExcalidrawFlow.ts        — shared React hook (~40 lines)
  src/assets/process-timeline.svg                    — Timeline SVG
  src/assets/mobile-tree.svg                         — Tree SVG
  src/assets/ecommerce-funnel.svg                    — Funnel SVG
  src/components/pretext/ProcessTimeline.tsx          — Process component (~30 lines)
  src/components/pretext/MobileTree.tsx               — Mobile component (~30 lines)
  src/components/pretext/EcommerceFunnel.tsx          — E-commerce component (~30 lines)

MODIFIED:
  src/components/pretext/AutomationFlow.tsx           — migrated to hook + new modules (~25 lines)
  src/components/sections/ServiceCustomDev.tsx        — add MobileTree + EcommerceFunnel conditionals
  src/components/sections/Process.tsx                 — replace SimpleGrid with ProcessTimeline

DELETED:
  src/components/pretext/automationFlowAnimation.ts   — replaced by 4 split modules
```

---

### Task 1: Download Apple logo

**Files:**
- Create: `public/illustrations/logos/apple.svg`

- [ ] **Step 1: Download Apple logo**

```bash
curl -L -o public/illustrations/logos/apple.svg "https://raw.githubusercontent.com/gilbarbara/logos/main/logos/apple.svg"
```

- [ ] **Step 2: Verify**

```bash
ls -la public/illustrations/logos/apple.svg
```

Should be non-zero size SVG.

- [ ] **Step 3: Commit**

```bash
git add public/illustrations/logos/apple.svg
git commit -m "feat: add Apple logo for mobile tree illustration"
```

---

### Task 2: Create excalidrawObserver.ts

**Files:**
- Create: `src/components/pretext/excalidrawObserver.ts`

- [ ] **Step 1: Create the module**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pretext/excalidrawObserver.ts
git commit -m "feat: extract excalidrawObserver module from animation code"
```

---

### Task 3: Create excalidrawEntrance.ts

**Files:**
- Create: `src/components/pretext/excalidrawEntrance.ts`

- [ ] **Step 1: Create the module**

```typescript
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
      if (!el) { completed++; if (completed === total) setTimeout(resolve, 400); continue; }

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
    el.style.transform = "scale(1)";
    const path = el.querySelector(".arrow-path") as SVGPathElement | null;
    if (path) path.style.strokeDashoffset = "0";
    // For line type elements
    if ((el as unknown as SVGPathElement).getTotalLength) {
      el.style.strokeDashoffset = "0";
    }
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pretext/excalidrawEntrance.ts
git commit -m "feat: add excalidrawEntrance module with parameterized runEntrance"
```

---

### Task 4: Create excalidrawDotLoop.ts

**Files:**
- Create: `src/components/pretext/excalidrawDotLoop.ts`

- [ ] **Step 1: Create the module**

```typescript
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
    endpointIds = [],
    cycleDuration = 3000,
    pauseDuration = 1000,
  } = config;

  const dot = container.querySelector(dotId) as SVGCircleElement | null;
  if (!dot) return () => {};

  const linearPaths = linearPathIds
    .map((id) => {
      const el = container.querySelector(id);
      const path = el?.classList.contains("arrow-path")
        ? (el as SVGPathElement)
        : (el?.querySelector(".arrow-path") as SVGPathElement | null) || (el as SVGPathElement | null);
      return path;
    })
    .filter(Boolean) as SVGPathElement[];

  const forkPaths = forkPathIds
    .map((id) => {
      const el = container.querySelector(id);
      const path = el?.classList.contains("arrow-path")
        ? (el as SVGPathElement)
        : (el?.querySelector(".arrow-path") as SVGPathElement | null) || (el as SVGPathElement | null);
      return path;
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
      if (clone) { clone.style.opacity = "0"; }
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
      // Single path, no fork — just fade out at end
      dot.style.opacity = `${1 - (dist - totalLinear) / 50}`;
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pretext/excalidrawDotLoop.ts
git commit -m "feat: add excalidrawDotLoop module with configurable dot animation"
```

---

### Task 5: Create excalidrawFunnelLoop.ts

**Files:**
- Create: `src/components/pretext/excalidrawFunnelLoop.ts`

- [ ] **Step 1: Create the module**

```typescript
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
  exitDirection: number; // -1 left, 1 right
};

export function startFunnelLoop(container: HTMLElement): () => void {
  const svgRoot = container.querySelector("svg") as SVGSVGElement | null;
  if (!svgRoot) return () => {};

  const leftPath = container.querySelector("#funnel-left") as SVGPathElement | null;
  const rightPath = container.querySelector("#funnel-right") as SVGPathElement | null;
  if (!leftPath || !rightPath) return () => {};

  const separatorYs = SEPARATOR_IDS.map((id) => {
    const sep = container.querySelector(id) as SVGPathElement | null;
    if (!sep) return 0;
    const bbox = sep.getBBox();
    return bbox.y + bbox.height / 2;
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
  let cycleActive = false;
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
      newDots.push({ el, x, y: topY, alive: true, eliminated: false, exitDirection: i < DOT_COUNT / 2 ? -1 : 1 });
    }
    return newDots;
  }

  function cleanupDots() {
    dots.forEach((d) => d.el.remove());
    dots = [];
  }

  function runCycle() {
    if (paused) return;
    cycleActive = true;
    dots = createDots();
    let nextSep = 0;

    function tick() {
      if (paused) { cycleActive = false; return; }

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
          // Check elimination for all alive non-eliminated dots
          const aliveDots = dots.filter((dd) => dd.alive && !dd.eliminated);
          if (aliveDots.length > 1 && Math.random() < ELIMINATION_RATES[nextSep]!) {
            d.eliminated = true;
          }
        }

        if (d.y >= bottomY) {
          // Arrived at bottom — pulse
          d.el.setAttribute("r", "5");
          d.el.setAttribute("opacity", "1");
          setTimeout(() => {
            d.el.setAttribute("r", "3");
            d.el.setAttribute("opacity", "0");
            d.alive = false;
          }, 400);
          d.y = bottomY + 1; // prevent re-triggering
        }
      }

      // Advance separator check
      const aliveDots = dots.filter((dd) => dd.alive && !dd.eliminated);
      if (nextSep < separatorYs.length && aliveDots.every((dd) => dd.y > separatorYs[nextSep]!)) {
        nextSep++;
      }

      if (allDone) {
        cycleActive = false;
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pretext/excalidrawFunnelLoop.ts
git commit -m "feat: add excalidrawFunnelLoop module for funnel dot animation"
```

---

### Task 6: Create useExcalidrawFlow.ts hook

**Files:**
- Create: `src/components/pretext/useExcalidrawFlow.ts`

- [ ] **Step 1: Create the hook**

```typescript
import { useEffect, useRef } from "react";
import { createVisibilityObserver } from "./excalidrawObserver";

type FlowState = "idle" | "entering" | "looping" | "paused";

export function useExcalidrawFlow(
  svgString: string,
  onEntrance: (container: HTMLElement) => Promise<void>,
  onStartLoop: (container: HTMLElement) => () => void,
  onReducedMotion: (container: HTMLElement) => void,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const state = useRef<FlowState>("idle");
  const stopLoop = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReducedMotion(el);
      return;
    }

    const disconnect = createVisibilityObserver(
      el,
      () => {
        if (state.current === "idle") {
          state.current = "entering";
          onEntrance(el).then(() => {
            if (state.current === "entering") {
              state.current = "looping";
              stopLoop.current = onStartLoop(el);
            }
          });
        } else if (state.current === "paused") {
          state.current = "looping";
          stopLoop.current = onStartLoop(el);
        }
      },
      () => {
        if (state.current === "looping") {
          stopLoop.current?.();
          stopLoop.current = null;
          state.current = "paused";
        } else if (state.current === "entering") {
          state.current = "paused";
        }
      },
    );

    return () => { disconnect(); stopLoop.current?.(); };
  }, []);

  return {
    containerRef,
    containerProps: {
      ref: containerRef,
      style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
      dangerouslySetInnerHTML: { __html: svgString },
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pretext/useExcalidrawFlow.ts
git commit -m "feat: add useExcalidrawFlow shared React hook"
```

---

### Task 7: Migrate AutomationFlow.tsx + delete old module

**Files:**
- Modify: `src/components/pretext/AutomationFlow.tsx`
- Delete: `src/components/pretext/automationFlowAnimation.ts`

- [ ] **Step 1: Rewrite AutomationFlow.tsx**

Replace entire content of `src/components/pretext/AutomationFlow.tsx`:

```tsx
import automationFlowSvg from "../../assets/automation-flow.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop, type DotLoopConfig } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-form", delay: 0, type: "node" },
  { selector: "#arrow-1", delay: 200, type: "arrow" },
  { selector: "#node-sheets", delay: 400, type: "node" },
  { selector: "#arrow-2", delay: 600, type: "arrow" },
  { selector: "#node-email", delay: 800, type: "node" },
  { selector: "#arrow-3a", delay: 1000, type: "arrow" },
  { selector: "#arrow-3b", delay: 1000, type: "arrow" },
  { selector: "#node-whatsapp", delay: 1200, type: "node" },
  { selector: "#node-telegram", delay: 1200, type: "node" },
];

const DOT_CONFIG: DotLoopConfig = {
  linearPathIds: ["#arrow-1", "#arrow-2"],
  forkPathIds: ["#arrow-3a", "#arrow-3b"],
};

export function AutomationFlow() {
  const { containerProps } = useExcalidrawFlow(
    automationFlowSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, DOT_CONFIG),
    (el) => showAllElements(el, '[id^="node-"], [id^="arrow-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Schema d'un workflow d'automatisation : formulaire web vers Google Sheets, email et notifications WhatsApp/Telegram"
    />
  );
}
```

- [ ] **Step 2: Delete old animation module**

```bash
rm src/components/pretext/automationFlowAnimation.ts
```

- [ ] **Step 3: Build to verify migration**

```bash
npm run build
```

Expected: clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/pretext/AutomationFlow.tsx
git rm src/components/pretext/automationFlowAnimation.ts
git commit -m "refactor: migrate AutomationFlow to shared hook + split animation modules"
```

---

### Task 8: Create Process Timeline SVG

**Files:**
- Create: `src/assets/process-timeline.svg`

- [ ] **Step 1: Create the SVG**

Create `src/assets/process-timeline.svg` — Excalidraw-style horizontal timeline with:
- ViewBox: `0 0 900 280`
- A hand-drawn horizontal line path (`#timeline-line`) from x=50 to x=850, y=100, with slight wave
- 4 milestones (`#milestone-1` to `#milestone-4`) as circles r=10, fill=#fa5d19, at x positions ~250px apart
- Above each milestone: sketch icon (loupe, equerre, eclair, fusee) drawn with hand-drawn paths
- Below each milestone: `#step-1` to `#step-4` groups containing title (Virgil 16px) + description (Virgil 11px)
- All milestones and steps start with `opacity="0"`, milestones with `style="transform-box: fill-box; transform-origin: center; transform: scale(0.8);"`
- Steps start with `opacity="0"` and `style="transform: translateY(8px);"`
- Timeline line starts with `stroke-dasharray="1000" stroke-dashoffset="1000"`
- One `<circle id="dot-pulse" r="4" fill="#fa5d19" opacity="0" filter="url(#dot-glow)"/>`
- Dot glow filter in `<defs>`
- `font-family="Virgil, Segoe Print, cursive"` on all text

Milestone content:
1. Decouverte — "On analyse votre contexte, vos contraintes et vos objectifs."
2. Strategie — "On definit l'architecture, les technologies et le planning."
3. Execution — "Developpement iteratif avec demos regulieres."
4. Livraison — "Deploiement, formation et support continu."

- [ ] **Step 2: Commit**

```bash
git add src/assets/process-timeline.svg
git commit -m "feat: add Excalidraw process timeline SVG"
```

---

### Task 9: Create ProcessTimeline.tsx + integrate into Process.tsx

**Files:**
- Create: `src/components/pretext/ProcessTimeline.tsx`
- Modify: `src/components/sections/Process.tsx`

- [ ] **Step 1: Create ProcessTimeline.tsx**

```tsx
import processTimelineSvg from "../../assets/process-timeline.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#timeline-line", delay: 0, type: "line" },
  { selector: "#milestone-1", delay: 200, type: "node" },
  { selector: "#step-1", delay: 300, type: "group" },
  { selector: "#milestone-2", delay: 400, type: "node" },
  { selector: "#step-2", delay: 500, type: "group" },
  { selector: "#milestone-3", delay: 600, type: "node" },
  { selector: "#step-3", delay: 700, type: "group" },
  { selector: "#milestone-4", delay: 800, type: "node" },
  { selector: "#step-4", delay: 900, type: "group" },
];

export function ProcessTimeline() {
  const { containerProps } = useExcalidrawFlow(
    processTimelineSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, { linearPathIds: ["#timeline-line"], forkPathIds: [] }),
    (el) => showAllElements(el, '[id^="milestone-"], [id^="step-"], #timeline-line'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Process en 4 etapes : Decouverte, Strategie, Execution, Livraison"
    />
  );
}
```

- [ ] **Step 2: Modify Process.tsx**

Replace the `SimpleGrid` block (lines 41-73) with `<ProcessTimeline />`. Keep the header.

New Process.tsx:

```tsx
import { Container, Text } from "@mantine/core";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { ProcessTimeline } from "../pretext/ProcessTimeline";

export function Process() {
  return (
    <section id="process" style={{ background: "#f9f9f9", padding: "100px 0", borderTop: "1px solid #ededed" }}>
      <Container size="xl">
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace">
            // 02 — Process
          </Text>
          <div style={{ marginTop: 4 }}>
            <GlitchTitle fz={44}>Un process clair, sans surprise.</GlitchTitle>
          </div>
        </ScrollReveal>

        <div style={{ marginTop: 50 }}>
          <ProcessTimeline />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pretext/ProcessTimeline.tsx src/components/sections/Process.tsx
git commit -m "feat: replace Process cards with animated Excalidraw timeline"
```

---

### Task 10: Create Mobile Tree SVG

**Files:**
- Create: `src/assets/mobile-tree.svg`

- [ ] **Step 1: Create the SVG**

Create `src/assets/mobile-tree.svg` — Excalidraw-style tree diagram with:
- ViewBox: `0 0 400 400`
- Vertical trunk: 3 nodes (Idee, Design, Codebase) connected by hand-drawn vertical paths
  - `#node-idea` at top (x=200, y=40), `#node-design` (x=200, y=130), `#node-codebase` (x=200, y=220)
  - `#trunk-1` path from idea to design, `#trunk-2` path from design to codebase
- Fork: two diagonal branches from codebase
  - `#branch-ios` path to (x=100, y=310), `#branch-android` path to (x=300, y=310)
  - `#node-ios` and `#node-android` at branch ends
- Leaves: 3 per branch
  - `#leaf-ios-1` to `#leaf-ios-3` (small circles/icons below iOS)
  - `#leaf-android-1` to `#leaf-android-3` (small circles/icons below Android)
- Codebase node larger, stroke #fa5d19
- Logos: `<image href="/illustrations/logos/apple.svg">` in iOS node, `<image href="/illustrations/android-svgrepo-com.svg">` in Android node
- All nodes `opacity="0"` with `transform-box: fill-box; transform-origin: center; transform: scale(0.8);`
- Trunks/branches: `stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0"`
- Leaves: `opacity="0" style="transform-box: fill-box; transform-origin: center; transform: scale(0.8);"`
- `<circle id="dot-pulse" r="4" fill="#fa5d19" opacity="0" filter="url(#dot-glow)"/>`
- Dot glow filter in defs
- `font-family="Virgil, Segoe Print, cursive"` on all text
- Labels in Virgil: "Idee", "Design", "Codebase", "iOS", "Android"
- Leaf labels: small text "Push", "Offline", "Perf" under each leaf set

- [ ] **Step 2: Commit**

```bash
git add src/assets/mobile-tree.svg
git commit -m "feat: add Excalidraw mobile tree SVG"
```

---

### Task 11: Create MobileTree.tsx + integrate into ServiceCustomDev

**Files:**
- Create: `src/components/pretext/MobileTree.tsx`
- Modify: `src/components/sections/ServiceCustomDev.tsx`

- [ ] **Step 1: Create MobileTree.tsx**

```tsx
import mobileTreeSvg from "../../assets/mobile-tree.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-idea", delay: 0, type: "node" },
  { selector: "#trunk-1", delay: 150, type: "line" },
  { selector: "#node-design", delay: 300, type: "node" },
  { selector: "#trunk-2", delay: 450, type: "line" },
  { selector: "#node-codebase", delay: 600, type: "node" },
  { selector: "#branch-ios", delay: 800, type: "line" },
  { selector: "#branch-android", delay: 800, type: "line" },
  { selector: "#node-ios", delay: 1000, type: "node" },
  { selector: "#node-android", delay: 1000, type: "node" },
  { selector: "#leaf-ios-1", delay: 1200, type: "node" },
  { selector: "#leaf-ios-2", delay: 1200, type: "node" },
  { selector: "#leaf-ios-3", delay: 1200, type: "node" },
  { selector: "#leaf-android-1", delay: 1200, type: "node" },
  { selector: "#leaf-android-2", delay: 1200, type: "node" },
  { selector: "#leaf-android-3", delay: 1200, type: "node" },
];

export function MobileTree() {
  const { containerProps } = useExcalidrawFlow(
    mobileTreeSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, {
      linearPathIds: ["#trunk-1", "#trunk-2"],
      forkPathIds: ["#branch-ios", "#branch-android"],
    }),
    (el) => showAllElements(el, '[id^="node-"], [id^="trunk-"], [id^="branch-"], [id^="leaf-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Schema en arbre : Idee, Design, Codebase unique se divisant en iOS et Android avec features partagees"
    />
  );
}
```

- [ ] **Step 2: Add import + conditional in ServiceCustomDev.tsx**

Add import at top:
```tsx
import { MobileTree } from "../pretext/MobileTree";
```

Add conditional after BotChat (around line 100-103):
```tsx
) : item.illustration === "app-mobile" ? (
  <MobileTree />
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pretext/MobileTree.tsx src/components/sections/ServiceCustomDev.tsx
git commit -m "feat: add animated Excalidraw tree for Mobile section"
```

---

### Task 12: Create E-commerce Funnel SVG

**Files:**
- Create: `src/assets/ecommerce-funnel.svg`

- [ ] **Step 1: Create the SVG**

Create `src/assets/ecommerce-funnel.svg` — Excalidraw-style funnel with:
- ViewBox: `0 0 400 400`
- `id="funnel-svg-root"` on the `<svg>` element
- Two converging hand-drawn paths for funnel sides:
  - `#funnel-left` from (50, 30) to (150, 370)
  - `#funnel-right` from (350, 30) to (250, 370)
- 4 horizontal separators: `#separator-1` to `#separator-4` at y ~100, 170, 240, 310
- 5 level groups `#level-1` to `#level-5`, each with:
  - Sketch icon on the left
  - Label on the right in Virgil
  - Small percentage annotation further right
- Level content: Visiteurs (100%), Landing (60%), Produit (35%), Panier (20%), Achat (8%)
- `#funnel-fill` — a small rectangle/path at the bottom with light hachure fill #fa5d19
- All funnel sides: `stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0"`
- All separators: `stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0"`
- All levels: `opacity="0"`
- Funnel fill: `opacity="0"`
- Dot glow filter in `<defs>`
- `font-family="Virgil, Segoe Print, cursive"` on all text

- [ ] **Step 2: Commit**

```bash
git add src/assets/ecommerce-funnel.svg
git commit -m "feat: add Excalidraw e-commerce funnel SVG"
```

---

### Task 13: Create EcommerceFunnel.tsx + integrate into ServiceCustomDev

**Files:**
- Create: `src/components/pretext/EcommerceFunnel.tsx`
- Modify: `src/components/sections/ServiceCustomDev.tsx`

- [ ] **Step 1: Create EcommerceFunnel.tsx**

```tsx
import ecommerceFunnelSvg from "../../assets/ecommerce-funnel.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startFunnelLoop } from "./excalidrawFunnelLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#funnel-left", delay: 0, type: "line" },
  { selector: "#funnel-right", delay: 0, type: "line" },
  { selector: "#level-1", delay: 200, type: "group" },
  { selector: "#separator-1", delay: 400, type: "line" },
  { selector: "#level-2", delay: 500, type: "group" },
  { selector: "#separator-2", delay: 700, type: "line" },
  { selector: "#level-3", delay: 800, type: "group" },
  { selector: "#separator-3", delay: 1000, type: "line" },
  { selector: "#level-4", delay: 1100, type: "group" },
  { selector: "#separator-4", delay: 1300, type: "line" },
  { selector: "#level-5", delay: 1400, type: "group" },
  { selector: "#funnel-fill", delay: 1400, type: "node" },
];

export function EcommerceFunnel() {
  const { containerProps } = useExcalidrawFlow(
    ecommerceFunnelSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startFunnelLoop(el),
    (el) => showAllElements(el, '[id^="funnel-"], [id^="level-"], [id^="separator-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Entonnoir de conversion : visiteurs, landing page, produit, panier, achat"
    />
  );
}
```

- [ ] **Step 2: Add import + conditional in ServiceCustomDev.tsx**

Add import:
```tsx
import { EcommerceFunnel } from "../pretext/EcommerceFunnel";
```

Add conditional after MobileTree:
```tsx
) : item.illustration === "ecommerce" ? (
  <EcommerceFunnel />
```

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pretext/EcommerceFunnel.tsx src/components/sections/ServiceCustomDev.tsx
git commit -m "feat: add animated Excalidraw funnel for E-commerce section"
```

---

### Task 14: Final verification and cleanup

- [ ] **Step 1: Verify line counts**

```bash
wc -l src/components/pretext/excalidrawObserver.ts src/components/pretext/excalidrawEntrance.ts src/components/pretext/excalidrawDotLoop.ts src/components/pretext/excalidrawFunnelLoop.ts src/components/pretext/useExcalidrawFlow.ts src/components/pretext/AutomationFlow.tsx src/components/pretext/ProcessTimeline.tsx src/components/pretext/MobileTree.tsx src/components/pretext/EcommerceFunnel.tsx
```

All should be under 200 lines.

- [ ] **Step 2: Full build + preview**

```bash
npm run build && npm run preview
```

Test all 4 animated sections work: Automatisation, Process, Mobile, E-commerce.

- [ ] **Step 3: Check for dead SVG assets**

```bash
grep -r "automation.svg\|app-mobile.svg\|ecommerce.svg" src/
```

If no references found, these static SVGs are now dead. Leave them for now (non-breaking).

- [ ] **Step 4: Commit if any cleanup**

```bash
git add -A
git commit -m "chore: final cleanup after Excalidraw sections implementation"
```
