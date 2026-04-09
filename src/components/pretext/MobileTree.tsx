import mobileTreeSvg from "../../assets/mobile-tree.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#node-idea", delay: 0, type: "node" },
  { selector: "#trunk-1", delay: 150, type: "line" },
  { selector: "#node-design", delay: 300, type: "node" },
  { selector: "#trunk-2", delay: 450, type: "line" },
  { selector: "#node-codebase", delay: 600, type: "node" },
  { selector: "#branch-ios", delay: 800, type: "line" },
  { selector: "#branch-android", delay: 800, type: "line" },
  { selector: "#node-ios", delay: 1000, type: "node" },
  { selector: "#node-android", delay: 1000, type: "node" },
  { selector: "#leaf-ios-1", delay: 1200, type: "node" },
  { selector: "#leaf-ios-2", delay: 1200, type: "node" },
  { selector: "#leaf-ios-3", delay: 1200, type: "node" },
  { selector: "#leaf-android-1", delay: 1200, type: "node" },
  { selector: "#leaf-android-2", delay: 1200, type: "node" },
  { selector: "#leaf-android-3", delay: 1200, type: "node" },
];

export function MobileTree() {
  const { containerProps } = useExcalidrawFlow(
    mobileTreeSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, {
      linearPathIds: ["#trunk-1", "#trunk-2"],
      forkPathIds: ["#branch-ios", "#branch-android"],
    }),
    (el) => showAllElements(el, '[id^="node-"], [id^="trunk-"], [id^="branch-"], [id^="leaf-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Schema en arbre : Idee, Design, Codebase unique se divisant en iOS et Android avec features partagees"
    />
  );
}
