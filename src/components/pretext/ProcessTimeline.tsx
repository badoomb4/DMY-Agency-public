import processTimelineSvg from "../../assets/process-timeline.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#timeline-line", delay: 0, type: "line" },
  { selector: "#milestone-1", delay: 200, type: "node" },
  { selector: "#step-1", delay: 300, type: "group" },
  { selector: "#milestone-2", delay: 400, type: "node" },
  { selector: "#step-2", delay: 500, type: "group" },
  { selector: "#milestone-3", delay: 600, type: "node" },
  { selector: "#step-3", delay: 700, type: "group" },
  { selector: "#milestone-4", delay: 800, type: "node" },
  { selector: "#step-4", delay: 900, type: "group" },
];

export function ProcessTimeline() {
  const { containerProps } = useExcalidrawFlow(
    processTimelineSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, {
      linearPathIds: ["#timeline-line"],
      forkPathIds: [],
      milestoneIds: ["#milestone-1", "#milestone-2", "#milestone-3", "#milestone-4"],
    }),
    (el) => showAllElements(el, '[id^="milestone-"], [id^="step-"], #timeline-line'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Process en 4 etapes : Decouverte, Strategie, Execution, Livraison"
    />
  );
}
