# Automation Flow Excalidraw — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static automation SVG illustration with an animated Excalidraw-style workflow diagram showing Form → Google Sheets → Email → WhatsApp/Telegram.

**Architecture:** SVG exported from Excalidraw, inlined via Vite `?raw` import. Phase 1 entrance animation via CSS classes toggled by IntersectionObserver. Phase 2 looping dot animation via requestAnimationFrame on SVG paths. Two files: React component + animation logic module.

**Tech Stack:** React, SVG, CSS animations, IntersectionObserver, requestAnimationFrame. No new npm dependencies.

**Spec:** `docs/superpowers/specs/2026-04-09-automation-flow-excalidraw-design.md`

---

## File Structure

```
src/
  assets/
    automation-flow.svg              — Excalidraw SVG with grouped elements and IDs
  components/pretext/
    AutomationFlow.tsx               — React component: loads SVG, wires observers, renders
    automationFlowAnimation.ts       — Animation logic: entrance sequencing + dot loop

public/
  fonts/
    Virgil.woff2                     — Excalidraw hand-drawn font
  illustrations/logos/
    google-sheets.svg                — From gilbarbara/logos
    gmail.svg                        — From gilbarbara/logos
    whatsapp.svg                     — From gilbarbara/logos (or reuse existing)
    telegram.svg                     — From gilbarbara/logos (or reuse existing)
```

**Modified:**
- `src/pages/index.astro` — Add Virgil @font-face
- `src/components/sections/ServiceCustomDev.tsx` — Add AutomationFlow conditional render

---

### Task 1: Download assets (font + logos)

**Files:**
- Create: `public/fonts/Virgil.woff2`
- Create: `public/illustrations/logos/google-sheets.svg`
- Create: `public/illustrations/logos/gmail.svg`
- Create: `public/illustrations/logos/whatsapp.svg`
- Create: `public/illustrations/logos/telegram.svg`

- [ ] **Step 1: Download Virgil font**

```bash
mkdir -p public/fonts
curl -L -o public/fonts/Virgil.woff2 "https://unpkg.com/@excalidraw/excalidraw@0.18.0/dist/prod/Virgil-Regular.woff2"
```

If the URL is unavailable, download from the Excalidraw GitHub repo releases.

- [ ] **Step 2: Download logos from gilbarbara/logos**

```bash
mkdir -p public/illustrations/logos
curl -L -o public/illustrations/logos/google-sheets.svg "https://raw.githubusercontent.com/gilbarbara/logos/main/logos/google-sheets.svg"
curl -L -o public/illustrations/logos/gmail.svg "https://raw.githubusercontent.com/gilbarbara/logos/main/logos/google-gmail.svg"
curl -L -o public/illustrations/logos/whatsapp.svg "https://raw.githubusercontent.com/gilbarbara/logos/main/logos/whatsapp-icon.svg"
curl -L -o public/illustrations/logos/telegram.svg "https://raw.githubusercontent.com/gilbarbara/logos/main/logos/telegram.svg"
```

- [ ] **Step 3: Verify files exist and are valid**

```bash
ls -la public/fonts/Virgil.woff2
ls -la public/illustrations/logos/
```

All 5 files should exist with non-zero size.

- [ ] **Step 4: Commit**

```bash
git add public/fonts/Virgil.woff2 public/illustrations/logos/
git commit -m "feat: add Virgil font and app logos for automation flow"
```

---

### Task 2: Add Virgil @font-face to global styles

**Files:**
- Modify: `src/pages/index.astro:17-31` (global style block)

- [ ] **Step 1: Add @font-face declaration**

In `src/pages/index.astro`, inside the `<style is:global>` block, add after the existing rules:

```css
@font-face {
  font-family: 'Virgil';
  src: url('/fonts/Virgil.woff2') format('woff2');
  font-display: swap;
}
```

- [ ] **Step 2: Run dev server and verify font loads**

```bash
npm run dev
```

Open browser devtools Network tab, navigate to the page. The Virgil font should NOT load yet (nothing references it). Verify no build errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add Virgil font-face declaration for Excalidraw style"
```

---

### Task 3: Create the Excalidraw SVG

**Files:**
- Create: `src/assets/automation-flow.svg`

This is the core visual artifact. The SVG must be created in Excalidraw and then structured with proper IDs.

- [ ] **Step 1: Create the schema in Excalidraw**

Open https://excalidraw.com and create:

1. **5 rectangles** (hand-drawn style, light hachure fill):
   - "Formulaire" (leftmost)
   - "Google Sheets" 
   - "Email"
   - "WhatsApp" (top-right, fork destination)
   - "Telegram" (bottom-right, fork destination)

2. **4 arrows** (hand-drawn style, with arrowhead):
   - Formulaire → Google Sheets
   - Google Sheets → Email
   - Email → WhatsApp (diagonal up-right)
   - Email → Telegram (diagonal down-right)

3. **Labels** in Virgil font under/inside each rectangle

4. Use the Excalidraw default colors or white fill with dark stroke.

- [ ] **Step 2: Export as SVG**

In Excalidraw: Menu → Export → SVG. Enable "Embed scene" OFF. Download the file.

- [ ] **Step 3: Edit SVG to add IDs and structure**

Open the exported SVG in a text editor. Excalidraw exports each element as a `<g>` group. Add `id` attributes:

- Each rectangle group: `id="node-form"`, `id="node-sheets"`, `id="node-email"`, `id="node-whatsapp"`, `id="node-telegram"`
- Each arrow group: `id="arrow-1"`, `id="arrow-2"`, `id="arrow-3a"`, `id="arrow-3b"`
- Inside each arrow `<g>`, the main `<path>` element should have class `arrow-path` (needed for `getPointAtLength()`)

Add a `<circle>` element for the animated dot (hidden by default):

```svg
<circle id="dot-pulse" r="4" fill="#fa5d19" opacity="0" filter="url(#dot-glow)"/>
<circle id="dot-pulse-b" r="4" fill="#fa5d19" opacity="0" filter="url(#dot-glow)"/>
<defs>
  <filter id="dot-glow">
    <feGaussianBlur stdDeviation="2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
```

- [ ] **Step 4: Insert logo references**

Inside each node group, add an `<image>` element for the logo:

```svg
<!-- Inside #node-sheets -->
<image href="/illustrations/logos/google-sheets.svg" x="..." y="..." width="24" height="24"/>
```

Adjust x/y coordinates to center the logo within each rectangle. The form node gets no external logo (use the Excalidraw-drawn form icon).

- [ ] **Step 5: Add initial hidden state**

All node groups and arrow groups should start hidden. Add to each:

```svg
<g id="node-form" opacity="0" transform="scale(0.8)" style="transform-box: fill-box; transform-origin: center;">
```

**Important:** `transform-box: fill-box` is requis pour que `transform-origin: center` fonctionne sur les elements SVG `<g>`. Sans cela, le scale se fait depuis l'origine (0,0) du SVG. Appliquer `transform-box: fill-box; transform-origin: center;` sur CHAQUE groupe node.

Pour la font des labels, s'assurer que les elements `<text>` dans le SVG utilisent :
```
font-family="Virgil, Segoe Print, cursive"
```

The arrows should have `stroke-dasharray` and `stroke-dashoffset` set to their total length (will be calculated at runtime, but set a high default like `1000`):

```svg
<path class="arrow-path" stroke-dasharray="1000" stroke-dashoffset="1000" .../>
```

- [ ] **Step 6: Save to src/assets/**

```bash
mkdir -p src/assets
# Copy the edited SVG to:
# src/assets/automation-flow.svg
```

- [ ] **Step 7: Verify SVG imports correctly**

Create a temporary test — in any component, add:

```tsx
import svgString from "../assets/automation-flow.svg?raw";
console.log(svgString.substring(0, 100));
```

Run `npm run dev`, check console output shows SVG markup. Remove the test code after.

- [ ] **Step 8: Commit**

```bash
git add src/assets/automation-flow.svg
git commit -m "feat: add Excalidraw automation flow SVG with animation IDs"
```

---

### Task 4: Create automationFlowAnimation.ts

**Files:**
- Create: `src/components/pretext/automationFlowAnimation.ts`

This module exports pure functions for both animation phases. No React dependency.

- [ ] **Step 1: Create the entrance animation module**

Create `src/components/pretext/automationFlowAnimation.ts`:

```typescript
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
            // Force reflow
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
      dot.style.opacity = "0";
      dotB.style.opacity = "0";
      raf = requestAnimationFrame(tick);
      return;
    }

    const progress = elapsed / CYCLE_DURATION;
    const dist = progress * totalLength;

    if (dist <= totalLinear) {
      // Traveling along linear arrows
      dot.style.opacity = "1";
      dotB.style.opacity = "0";
      let remaining = dist;
      for (let i = 0; i < arrowPaths.length; i++) {
        if (remaining <= pathLengths[i]!) {
          const pt = arrowPaths[i]!.getPointAtLength(remaining);
          dot.setAttribute("cx", `${pt.x}`);
          dot.setAttribute("cy", `${pt.y}`);
          break;
        }
        remaining -= pathLengths[i]!;
      }
    } else {
      // Fork phase — two dots
      const forkDist = dist - totalLinear;
      dot.style.opacity = `${1 - forkDist / maxFork * 0.5}`;
      dotB.style.opacity = `${1 - forkDist / maxFork * 0.5}`;

      const ptA = forkPaths[0]!.getPointAtLength(
        Math.min(forkDist, forkLengths[0]!)
      );
      dot.setAttribute("cx", `${ptA.x}`);
      dot.setAttribute("cy", `${ptA.y}`);

      const ptB = forkPaths[1]!.getPointAtLength(
        Math.min(forkDist, forkLengths[1]!)
      );
      dotB.setAttribute("cx", `${ptB.x}`);
      dotB.setAttribute("cy", `${ptB.y}`);
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: no errors related to automationFlowAnimation.ts.

- [ ] **Step 3: Commit**

```bash
git add src/components/pretext/automationFlowAnimation.ts
git commit -m "feat: add automation flow animation logic (entrance + dot loop)"
```

---

### Task 5: Create AutomationFlow.tsx component

**Files:**
- Create: `src/components/pretext/AutomationFlow.tsx`

- [ ] **Step 1: Create the React component**

Create `src/components/pretext/AutomationFlow.tsx`:

```tsx
import { useEffect, useRef } from "react";
import automationFlowSvg from "../../assets/automation-flow.svg?raw";
import {
  runEntrance,
  startDotLoop,
  createVisibilityObserver,
} from "./automationFlowAnimation";

// State machine: idle -> entering -> looping -> paused -> looping -> ...
type FlowState = "idle" | "entering" | "looping" | "paused";

export function AutomationFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const state = useRef<FlowState>("idle");
  const stopLoop = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      const allElements = el.querySelectorAll(
        '[id^="node-"], [id^="arrow-"]'
      );
      allElements.forEach((node) => {
        (node as SVGElement).style.opacity = "1";
        (node as SVGElement).style.transform = "scale(1)";
        const path = node.querySelector(".arrow-path") as SVGPathElement | null;
        if (path) path.style.strokeDashoffset = "0";
      });
      return;
    }

    // Single observer handles all state transitions
    const disconnect = createVisibilityObserver(
      el,
      () => {
        // Visible
        if (state.current === "idle") {
          state.current = "entering";
          runEntrance(el).then(() => {
            // Only start loop if still visible (not scrolled away during entrance)
            if (state.current === "entering") {
              state.current = "looping";
              stopLoop.current = startDotLoop(el);
            }
          });
        } else if (state.current === "paused") {
          state.current = "looping";
          stopLoop.current = startDotLoop(el);
        }
        // "entering" or "looping" — do nothing
      },
      () => {
        // Hidden
        if (state.current === "looping") {
          stopLoop.current?.();
          stopLoop.current = null;
          state.current = "paused";
        } else if (state.current === "entering") {
          // Will transition to paused when entrance resolves
          state.current = "paused";
        }
        // "idle" or "paused" — do nothing
      },
    );

    return () => {
      disconnect();
      stopLoop.current?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Schema d'un workflow d'automatisation : formulaire web vers Google Sheets, email et notifications WhatsApp/Telegram"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      dangerouslySetInnerHTML={{ __html: automationFlowSvg }}
    />
  );
}
```

- [ ] **Step 2: Create type declaration for ?raw imports**

Create `src/svg-raw.d.ts`:

```typescript
declare module "*.svg?raw" {
  const content: string;
  export default content;
}
```

This is mandatory — Astro's strict tsconfig does not include `?raw` import types.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/pretext/AutomationFlow.tsx src/svg-raw.d.ts
git commit -m "feat: add AutomationFlow React component with SVG raw type declaration"
```

---

### Task 6: Integrate into ServiceCustomDev

**Files:**
- Modify: `src/components/sections/ServiceCustomDev.tsx:1-4` (imports) and `:96-106` (render)

- [ ] **Step 1: Add import**

At the top of `ServiceCustomDev.tsx`, add:

```tsx
import { AutomationFlow } from "../pretext/AutomationFlow";
```

- [ ] **Step 2: Add conditional render**

In the illustration render block (around line 96-106), change:

```tsx
{item.illustration === "app-web" ? (
  <MonitorPretext />
) : item.illustration === "bot-platforms" ? (
  <BotChat />
) : (
  <img
    src={`/illustrations/${item.illustration}.svg`}
    alt={item.title}
    style={{ width: "100%", maxHeight: 280, objectFit: "contain" }}
  />
)}
```

To:

```tsx
{item.illustration === "app-web" ? (
  <MonitorPretext />
) : item.illustration === "bot-platforms" ? (
  <BotChat />
) : item.illustration === "automation" ? (
  <AutomationFlow />
) : (
  <img
    src={`/illustrations/${item.illustration}.svg`}
    alt={item.title}
    style={{ width: "100%", maxHeight: 280, objectFit: "contain" }}
  />
)}
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Navigate to the Services section. The Automatisation card (item 05) should show the animated Excalidraw workflow instead of the static SVG. Verify:
- Nodes appear sequentially on scroll
- Arrows draw progressively
- Orange dot loops after entrance completes
- Scrolling away and back pauses/resumes the dot

- [ ] **Step 4: Test reduced motion**

In browser devtools, enable "Prefers reduced motion" (Rendering tab). Reload. All elements should appear instantly with no animation.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: clean build, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ServiceCustomDev.tsx
git commit -m "feat: integrate AutomationFlow into Automatisation service card"
```

---

### Task 7: Final polish and cleanup

- [ ] **Step 1: Remove old automation.svg if no longer referenced**

Check if `public/illustrations/automation.svg` is still used anywhere else:

```bash
grep -r "automation.svg" src/
```

If only referenced as the default `<img>` fallback (now bypassed by the conditional), it's no longer needed but can stay for safety.

- [ ] **Step 2: Verify all files respect the 200-line limit**

```bash
wc -l src/components/pretext/AutomationFlow.tsx
wc -l src/components/pretext/automationFlowAnimation.ts
```

Both should be under 200 lines.

- [ ] **Step 3: Full build + preview**

```bash
npm run build && npm run preview
```

Open the preview URL. Test the complete flow end-to-end in the built production version.

- [ ] **Step 4: Final commit if any cleanup was needed**

```bash
git add -A
git commit -m "chore: cleanup after automation flow integration"
```
