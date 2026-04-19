import conseilAuditSvg from "../../assets/conseil-audit.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop, type DotLoopConfig } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-source-1", delay: 0, type: "node" },
  { selector: "#node-source-2", delay: 80, type: "node" },
  { selector: "#node-source-3", delay: 160, type: "node" },
  { selector: "#node-source-4", delay: 240, type: "node" },
  { selector: "#node-source-5", delay: 320, type: "node" },
  { selector: "#arrow-source-1", delay: 450, type: "arrow" },
  { selector: "#arrow-source-2", delay: 450, type: "arrow" },
  { selector: "#arrow-source-3", delay: 450, type: "arrow" },
  { selector: "#arrow-source-4", delay: 450, type: "arrow" },
  { selector: "#arrow-source-5", delay: 450, type: "arrow" },
  { selector: "#node-diagnostic", delay: 650, type: "node" },
  { selector: "#arrow-1", delay: 850, type: "arrow" },
  { selector: "#node-plan", delay: 1050, type: "node" },
  { selector: "#arrow-2", delay: 1200, type: "arrow" },
  { selector: "#node-roadmap", delay: 1400, type: "node" },
];

const DOT_CONFIG: DotLoopConfig = {
  linearPathIds: ["#arrow-1", "#arrow-2"],
  forkPathIds: [],
};

export function ConseilAudit() {
  const { containerProps } = useExcalidrawFlow(
    conseilAuditSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, DOT_CONFIG),
    (el) => showAllElements(el, '[id^="node-"], [id^="arrow-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Audit IA : vos outils, documents locaux et systèmes internes analysés pour un diagnostic et plan d'action"
    />
  );
}
