import automationFlowSvg from "../../assets/automation-flow.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop, type DotLoopConfig } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  // 3 sources appear
  { selector: "#node-source-1", delay: 0, type: "node" },
  { selector: "#node-source-2", delay: 100, type: "node" },
  { selector: "#node-source-3", delay: 200, type: "node" },
  // Convergence lines
  { selector: "#arrow-source-top", delay: 300, type: "arrow" },
  { selector: "#arrow-source-mid", delay: 300, type: "arrow" },
  { selector: "#arrow-source-bot", delay: 300, type: "arrow" },
  // Main flow
  { selector: "#arrow-1", delay: 500, type: "arrow" },
  { selector: "#node-sheets", delay: 700, type: "node" },
  { selector: "#arrow-2", delay: 900, type: "arrow" },
  { selector: "#node-email", delay: 1100, type: "node" },
  { selector: "#arrow-3a", delay: 1300, type: "arrow" },
  { selector: "#arrow-3b", delay: 1300, type: "arrow" },
  { selector: "#node-whatsapp", delay: 1500, type: "node" },
  { selector: "#node-telegram", delay: 1500, type: "node" },
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
      aria-label="Schema d'un workflow d'automatisation : sources multiples vers Google Sheets, email et notifications WhatsApp/Telegram"
    />
  );
}
