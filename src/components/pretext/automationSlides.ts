import flow1Svg from "../../assets/automation-flow.svg?raw";
import flow2Svg from "../../assets/automation-flow-2.svg?raw";
import flow3Svg from "../../assets/automation-flow-3.svg?raw";
import type { EntranceStep } from "./excalidrawEntrance";
import type { DotLoopConfig } from "./excalidrawDotLoop";

export type AutomationSlide = {
  svg: string;
  label: string;
  sequence: EntranceStep[];
  dotConfig: DotLoopConfig;
  showSelector: string;
};

export const SLIDES: AutomationSlide[] = [
  {
    svg: flow1Svg,
    label: "Collecte multi-sources",
    sequence: [
      { selector: "#node-source-1", delay: 0, type: "node" },
      { selector: "#node-source-2", delay: 100, type: "node" },
      { selector: "#node-source-3", delay: 200, type: "node" },
      { selector: "#arrow-source-top", delay: 300, type: "arrow" },
      { selector: "#arrow-source-mid", delay: 300, type: "arrow" },
      { selector: "#arrow-source-bot", delay: 300, type: "arrow" },
      { selector: "#arrow-1", delay: 500, type: "arrow" },
      { selector: "#node-sheets", delay: 700, type: "node" },
      { selector: "#arrow-2", delay: 900, type: "arrow" },
      { selector: "#node-email", delay: 1100, type: "node" },
      { selector: "#arrow-3a", delay: 1300, type: "arrow" },
      { selector: "#arrow-3b", delay: 1300, type: "arrow" },
      { selector: "#node-whatsapp", delay: 1500, type: "node" },
      { selector: "#node-telegram", delay: 1500, type: "node" },
    ],
    dotConfig: {
      linearPathIds: ["#arrow-1", "#arrow-2"],
      forkPathIds: ["#arrow-3a", "#arrow-3b"],
    },
    showSelector: '[id^="node-"], [id^="arrow-"]',
  },
  {
    svg: flow2Svg,
    label: "Pipeline e-commerce",
    sequence: [
      { selector: "#node-1", delay: 0, type: "node" },
      { selector: "#arrow-1", delay: 200, type: "arrow" },
      { selector: "#node-2", delay: 400, type: "node" },
      { selector: "#arrow-2", delay: 600, type: "arrow" },
      { selector: "#node-3", delay: 800, type: "node" },
      { selector: "#arrow-3", delay: 1000, type: "arrow" },
      { selector: "#node-4", delay: 1200, type: "node" },
    ],
    dotConfig: {
      linearPathIds: ["#arrow-1", "#arrow-2", "#arrow-3"],
      forkPathIds: [],
    },
    showSelector: '[id^="node-"], [id^="arrow-"]',
  },
  {
    svg: flow3Svg,
    label: "Bot navigateur automatisé",
    sequence: [
      { selector: "#node-1", delay: 0, type: "node" },
      { selector: "#arrow-1", delay: 200, type: "arrow" },
      { selector: "#node-2", delay: 400, type: "node" },
      { selector: "#arrow-2", delay: 600, type: "arrow" },
      { selector: "#node-3", delay: 800, type: "node" },
      { selector: "#arrow-3", delay: 1000, type: "arrow" },
      { selector: "#node-4", delay: 1200, type: "node" },
    ],
    dotConfig: {
      linearPathIds: ["#arrow-1", "#arrow-2", "#arrow-3"],
      forkPathIds: [],
    },
    showSelector: '[id^="node-"], [id^="arrow-"]',
  },
];
