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
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } as const,
      dangerouslySetInnerHTML: { __html: svgString },
    },
  };
}
