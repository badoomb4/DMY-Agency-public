import { useState } from "react";
import { Text } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { SectionFrame } from "../pretext/SectionFrame";
import { ProcessTimeline } from "../pretext/ProcessTimeline";
import { ProcessSelector } from "../pretext/ProcessSelector";
import { PROCESSES } from "../pretext/processData";

export function Process() {
  const [activeKey, setActiveKey] = useState(PROCESSES[0]!.key);
  const active = PROCESSES.find((p) => p.key === activeKey) ?? PROCESSES[0]!;

  return (
    <MantineProvider>
    <section id="process" style={{ background: "#f9f9f9" }}>
      <SectionFrame>
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace">
            // 02 — Process
          </Text>
          <div style={{ marginTop: 4 }}>
            <GlitchTitle fz={44} as="h2">Un process clair, sans surprise.</GlitchTitle>
          </div>
          <Text fz="md" c="#737373" mt="sm" maw={500}>
            {active.subtitle}
          </Text>
          <ProcessSelector processes={PROCESSES} activeKey={activeKey} onChange={setActiveKey} />
        </ScrollReveal>

        <div style={{ marginTop: 50 }}>
          <ProcessTimeline key={activeKey} steps={active.steps} />
        </div>
      </SectionFrame>
    </section>
    </MantineProvider>
  );
}
