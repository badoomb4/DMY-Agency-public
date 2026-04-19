import { Text } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { SectionFrame } from "../pretext/SectionFrame";
import { ServiceCustomDev } from "./ServiceCustomDev";
import { ServiceConseil } from "./ServiceConseil";

export function Services() {
  return (
    <MantineProvider>
    <section id="services" style={{ background: "#ffffff" }}>
      <SectionFrame>
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace" style={{ paddingTop: 30 }}>
            // 01 — Services
          </Text>
        </ScrollReveal>

        <ServiceCustomDev />
        <ServiceConseil />
      </SectionFrame>
    </section>
    </MantineProvider>
  );
}
