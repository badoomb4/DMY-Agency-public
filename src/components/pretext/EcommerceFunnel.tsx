import ecommerceSvg from "../../assets/ecommerce-funnel.svg?raw";
import { useExcalidrawFlow } from "./useExcalidrawFlow";
import { runEntrance, showAllElements, type EntranceStep } from "./excalidrawEntrance";
import { startDotLoop } from "./excalidrawDotLoop";

const SEQUENCE: EntranceStep[] = [
  // Center node first
  { selector: "#node-center", delay: 0, type: "node" },
  // Spokes radiate outward
  { selector: "#spoke-1", delay: 200, type: "line" },
  { selector: "#spoke-2", delay: 300, type: "line" },
  { selector: "#spoke-3", delay: 400, type: "line" },
  { selector: "#spoke-4", delay: 500, type: "line" },
  { selector: "#spoke-5", delay: 600, type: "line" },
  // Satellites appear
  { selector: "#node-seo", delay: 400, type: "node" },
  { selector: "#node-cms", delay: 500, type: "node" },
  { selector: "#node-mailing", delay: 600, type: "node" },
  { selector: "#node-custom", delay: 700, type: "node" },
  { selector: "#node-stripe", delay: 800, type: "node" },
];

export function EcommerceFunnel() {
  const { containerProps } = useExcalidrawFlow(
    ecommerceSvg,
    (el) => runEntrance(el, SEQUENCE),
    (el) => startDotLoop(el, {
      linearPathIds: ["#spoke-1"],
      forkPathIds: [],
      cycleDuration: 2000,
      pauseDuration: 500,
    }),
    (el) => showAllElements(el, '[id^="node-"], [id^="spoke-"]'),
  );

  return (
    <div
      {...containerProps}
      role="img"
      aria-label="Mind map des services Sites Vitrines : CMS, SEO, Mailing, Sur mesure, Paiement Stripe"
    />
  );
}
