import { SimpleGrid, Box, Text, Title } from "@mantine/core";
import { ScrollReveal } from "../ScrollReveal";
import { ProcessStepDetail } from "./ProcessStepDetail";
import type { Step } from "./processData";

interface Props {
  steps: Step[];
}

export function ProcessTimeline({ steps }: Props) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: steps.length }} spacing="lg">
      {steps.map((step, i) => (
        <ScrollReveal key={step.number} delay={i * 150} direction="up">
          <Box
            p="xl"
            style={{
              background: "#ffffff",
              border: "1px solid #ededed",
              borderRadius: 12,
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Large background step number */}
            <Text
              ff="monospace" fw={800}
              style={{
                position: "absolute", top: -8, right: 12,
                fontSize: 72, lineHeight: 1,
                color: "rgba(250, 93, 25, 0.06)",
                userSelect: "none", pointerEvents: "none",
              }}
            >
              {step.number}
            </Text>

            {/* Icon badge */}
            <Box style={{
              width: 48, height: 48, borderRadius: 10,
              background: "rgba(250, 93, 25, 0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fa5d19", marginBottom: 16,
            }}>
              {step.icon}
            </Box>

            <Title order={4} fz={20} c="#262626" style={{ letterSpacing: "-0.5px" }}>
              {step.title}
            </Title>
            <Text fz="sm" c="#737373" mt={8} lh={1.6}>
              {step.description}
            </Text>

            <ProcessStepDetail actions={step.actions} livrables={step.livrables} />
          </Box>
        </ScrollReveal>
      ))}
    </SimpleGrid>
  );
}
