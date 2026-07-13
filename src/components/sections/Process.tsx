import { useState } from "react";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { ProcessTimeline } from "../pretext/ProcessTimeline";
import { ProcessSelector } from "../pretext/ProcessSelector";
import { PROCESSES } from "../pretext/processData";

export function Process() {
  const [activeKey, setActiveKey] = useState(PROCESSES[0]!.key);
  const active = PROCESSES.find((p) => p.key === activeKey) ?? PROCESSES[0]!;

  return (
    <section id="process" style={{ background: "var(--bg)" }}>
      <div className="frame">
        <div data-reveal>
          <p className="eyebrow">{"// 02 — Process"}</p>
          <GlitchTitle fz="var(--fs-4xl)" as="h2">
            Un process clair, sans surprise.
          </GlitchTitle>
          <p className="process-sub">{active.subtitle}</p>
          <ProcessSelector processes={PROCESSES} activeKey={activeKey} onChange={setActiveKey} />
        </div>

        <ProcessTimeline key={activeKey} activeKey={activeKey} steps={active.steps} />
      </div>
    </section>
  );
}
