import conseilAgentsSvg from "../../assets/conseil-agents.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop, type DotLoopConfig } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-demande", delay: 0, type: "node" },
  { selector: "#arrow-1", delay: 200, type: "arrow" },
  { selector: "#node-assistant", delay: 400, type: "node" },
  { selector: "#arrow-out-1", delay: 650, type: "arrow" },
  { selector: "#arrow-out-2", delay: 700, type: "arrow" },
  { selector: "#arrow-out-3", delay: 750, type: "arrow" },
  { selector: "#arrow-out-4", delay: 800, type: "arrow" },
  { selector: "#arrow-out-5", delay: 850, type: "arrow" },
  { selector: "#node-dest-1", delay: 950, type: "node" },
  { selector: "#node-dest-2", delay: 1000, type: "node" },
  { selector: "#node-dest-3", delay: 1050, type: "node" },
  { selector: "#node-dest-4", delay: 1100, type: "node" },
  { selector: "#node-dest-5", delay: 1150, type: "node" },
  // Interconnections between tools
  { selector: "#link-1-2", delay: 1300, type: "line" },
  { selector: "#link-2-3", delay: 1350, type: "line" },
  { selector: "#link-3-4", delay: 1400, type: "line" },
  { selector: "#link-4-5", delay: 1450, type: "line" },
];

const DOT_CONFIG: DotLoopConfig = {
  linearPathIds: ["#arrow-1"],
  forkPathIds: ["#arrow-out-1", "#arrow-out-3"],
};

export function ConseilAgents() {
  const { containerProps } = useExcalidrawFlow(
    conseilAgentsSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, DOT_CONFIG),
    (el) => showAllElements(el, '[id^="node-"], [id^="arrow-"], [id^="link-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Agents IA connectés à WordPress, Shopify, Amazon, Airbnb et votre système interne, avec interconnexions entre outils"
    />
  );
}
