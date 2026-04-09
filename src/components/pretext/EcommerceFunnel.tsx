import ecommerceFunnelSvg from "../../assets/ecommerce-funnel.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startFunnelLoop } from "./excalidrawFunnelLoop";

const SEQUENCE: EntranceStep[] = [
  { selector: "#funnel-left", delay: 0, type: "line" },
  { selector: "#funnel-right", delay: 0, type: "line" },
  { selector: "#level-1", delay: 200, type: "group" },
  { selector: "#separator-1", delay: 400, type: "line" },
  { selector: "#level-2", delay: 500, type: "group" },
  { selector: "#separator-2", delay: 700, type: "line" },
  { selector: "#level-3", delay: 800, type: "group" },
  { selector: "#separator-3", delay: 1000, type: "line" },
  { selector: "#level-4", delay: 1100, type: "group" },
  { selector: "#separator-4", delay: 1300, type: "line" },
  { selector: "#level-5", delay: 1400, type: "group" },
  { selector: "#funnel-fill", delay: 1400, type: "node" },
];

export function EcommerceFunnel() {
  const { containerProps } = useExcalidrawFlow(
    ecommerceFunnelSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startFunnelLoop(el),
    (el) => showAllElements(el, '[id^="funnel-"], [id^="level-"], [id^="separator-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Entonnoir de conversion : visiteurs, landing page, produit, panier, achat"
    />
  );
}
