import { useEffect, useRef } from "react";
import automationFlowSvg from "../../assets/automation-flow.svg?raw";
import {
  runEntrance,
  startDotLoop,
  createVisibilityObserver,
} from "./automationFlowAnimation";

type FlowState = "idle" | "entering" | "looping" | "paused";

export function AutomationFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const state = useRef<FlowState>("idle");
  const stopLoop = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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

    const disconnect = createVisibilityObserver(
      el,
      () => {
        if (state.current === "idle") {
          state.current = "entering";
          runEntrance(el).then(() => {
            if (state.current === "entering") {
              state.current = "looping";
              stopLoop.current = startDotLoop(el);
            }
          });
        } else if (state.current === "paused") {
          state.current = "looping";
          stopLoop.current = startDotLoop(el);
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
