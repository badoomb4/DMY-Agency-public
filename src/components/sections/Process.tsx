import { Container, Text } from "@mantine/core";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { ProcessTimeline } from "../pretext/ProcessTimeline";

export function Process() {
  return (
    <section id="process" style={{ background: "#f9f9f9", padding: "100px 0", borderTop: "1px solid #ededed" }}>
      <Container size="xl">
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace">
            // 02 — Process
          </Text>
          <div style={{ marginTop: 4 }}>
            <GlitchTitle fz={44}>Un process clair, sans surprise.</GlitchTitle>
          </div>
        </ScrollReveal>

        <div style={{ marginTop: 50 }}>
          <ProcessTimeline />
        </div>
      </Container>
    </section>
  );
}
