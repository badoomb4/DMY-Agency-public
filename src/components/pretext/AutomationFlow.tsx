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

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <SlideView key={active} slide={SLIDES[active]!} />

      <button
        onClick={prev}
        aria-label="Exemple précédent"
        style={{
          position: "absolute",
          left: 4,
          top: "50%",
          transform: "translateY(-50%)",
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
        }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Exemple suivant"
        style={{
          position: "absolute",
          right: 4,
          top: "50%",
          transform: "translateY(-50%)",
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
        }}
      >
        ›
      </button>

      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
        }}
      >
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
    </div>
  );
}
