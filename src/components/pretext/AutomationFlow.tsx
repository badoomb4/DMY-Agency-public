import { useCallback, useEffect, useRef, useState } from "react";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";
import { createVisibilityObserver } from "./excalidrawObserver";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SLIDES, type AutomationSlide } from "./automationSlides";

const AUTO_ROTATE_MS = 6000;

function SlideView({ slide }: { slide: AutomationSlide }) {
  const { containerProps } = useExcalidrawFlow(
    slide.svg,
    (el) => runEntrance(el, slide.sequence),
    (el) => startDotLoop(el, slide.dotConfig),
    (el) => showAllElements(el, slide.showSelector),
  );

  return <div {...containerProps} role="img" aria-label={`Exemple d'automatisation : ${slide.label}`} />;
}

const btnStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-md)",
  width: 36,
  height: 36,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-3)",
  fontSize: 16,
};

export function AutomationFlow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [navCount, setNavCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return createVisibilityObserver(el, () => setInView(true), () => setInView(false));
  }, []);

  // Auto-rotation : seulement visible, non survolé, sans reduced-motion.
  const autoOn = inView && !paused && !reduced;
  useEffect(() => {
    if (!autoOn) return;
    const timer = setInterval(() => setActive((prev) => (prev + 1) % SLIDES.length), AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [autoOn, navCount]);

  const go = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length);
    setNavCount((c) => c + 1); // repart de zéro après une navigation manuelle
  }, []);

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "var(--brand-ink)" }}>
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginLeft: 8 }}>
          {SLIDES[active]!.label}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <SlideView key={active} slide={SLIDES[active]!} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 8, paddingBottom: 4 }}>
        <button onClick={() => go(active - 1)} aria-label="Exemple précédent" style={btnStyle}>
          ‹
        </button>

        <div style={{ display: "flex", alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => go(i)}
              aria-label={s.label}
              aria-current={i === active || undefined}
              style={{ padding: 9, background: "transparent", border: "none", cursor: "pointer", display: "flex" }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === active ? "var(--brand)" : "var(--border-strong)",
                  transition: "all var(--t-med) var(--ease)",
                }}
              />
            </button>
          ))}
        </div>

        <button onClick={() => go(active + 1)} aria-label="Exemple suivant" style={btnStyle}>
          ›
        </button>
      </div>
    </div>
  );
}
