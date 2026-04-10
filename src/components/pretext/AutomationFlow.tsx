import { useState, useCallback, useEffect, useRef } from "react";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";
import { SLIDES, type AutomationSlide } from "./automationSlides";

const AUTO_ROTATE_MS = 6000;

function SlideView({ slide }: { slide: AutomationSlide }) {
  const { containerProps } = useExcalidrawFlow(
    slide.svg,
    (el) => runEntrance(el, slide.sequence),
    (el) => startDotLoop(el, slide.dotConfig),
    (el) => showAllElements(el, slide.showSelector),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label={`Exemple d'automatisation : ${slide.label}`}
    />
  );
}

export function AutomationFlow() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const go = useCallback(
    (index: number) => {
      setActive(index);
      resetTimer();
    },
    [resetTimer],
  );

  const prev = () => go((active - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((active + 1) % SLIDES.length);

  const btnStyle: React.CSSProperties = {
    background: "white",
    border: "1px solid #ededed",
    borderRadius: 6,
    width: 28,
    height: 28,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#737373",
    fontSize: 14,
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Slide */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <SlideView key={active} slide={SLIDES[active]!} />
      </div>

      {/* Navigation bar: prev + dots + next */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <button onClick={prev} aria-label="Exemple précédent" style={btnStyle}>‹</button>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => go(i)}
              aria-label={s.label}
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                background: i === active ? "#fa5d19" : "#d4d4d4",
                cursor: "pointer",
                padding: 0,
                transition: "all 300ms ease",
              }}
            />
          ))}
        </div>

        <button onClick={next} aria-label="Exemple suivant" style={btnStyle}>›</button>
      </div>
    </div>
  );
}
