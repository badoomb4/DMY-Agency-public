import conseilFormationSvg from "../../assets/conseil-formation.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop, type DotLoopConfig } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-decouverte", delay: 0, type: "node" },
  { selector: "#arrow-1", delay: 200, type: "arrow" },
  { selector: "#node-pratique", delay: 400, type: "node" },
  { selector: "#arrow-tool-1", delay: 550, type: "arrow" },
  { selector: "#arrow-tool-2", delay: 550, type: "arrow" },
  { selector: "#node-tool-1", delay: 700, type: "node" },
  { selector: "#node-tool-2", delay: 750, type: "node" },
  { selector: "#node-tool-3", delay: 800, type: "node" },
  { selector: "#arrow-2", delay: 950, type: "arrow" },
  { selector: "#node-autonomie", delay: 1150, type: "node" },
];

const DOT_CONFIG: DotLoopConfig = {
  linearPathIds: ["#arrow-1", "#arrow-2"],
  forkPathIds: [],
};

export function ConseilFormation() {
  const { containerProps } = useExcalidrawFlow(
    conseilFormationSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, DOT_CONFIG),
    (el) => showAllElements(el, '[id^="node-"], [id^="arrow-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Formation IA : découverte, pratique sur vos outils, autonomie"
    />
  );
}
