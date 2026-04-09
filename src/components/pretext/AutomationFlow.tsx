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
