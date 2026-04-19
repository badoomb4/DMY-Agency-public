import { Text } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { SectionFrame } from "../pretext/SectionFrame";

export function CtaFinal() {
  return (
    <MantineProvider>
    <section id="contact" style={{ background: "#ffffff" }}>
      <SectionFrame>
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace" ta="center">
            // 05 — Contact
          </Text>
          <div style={{ marginTop: 4, textAlign: "center" }}>
            <GlitchTitle fz={44} as="h2">Prêt à passer à l'action ?</GlitchTitle>
          </div>
          <Text fz="md" c="#737373" ta="center" mt="sm" maw={420} mx="auto">
            Appelez-nous, on en discute.
          </Text>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
            <a
              href="tel:+33674305067"
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#262626",
                letterSpacing: "-1px",
                textDecoration: "none",
                fontFamily: "'Geist', system-ui, sans-serif",
              }}
            >
              +33 6 74 30 50 67
            </a>
          </div>
        </ScrollReveal>
      </SectionFrame>
    </section>
    </MantineProvider>
  );
}
