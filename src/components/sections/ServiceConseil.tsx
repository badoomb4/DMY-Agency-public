import { Text, Box, Stack, Group, Badge } from "@mantine/core";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { ConseilAudit } from "../pretext/ConseilAudit";
import { ConseilAgents } from "../pretext/ConseilAgents";
import { ConseilFormation } from "../pretext/ConseilFormation";
import { TopCrosses, BottomCrosses } from "../pretext/GridCross";
import type { ReactNode } from "react";

interface Pillar {
  title: string;
  description: string;
  tags: string[];
  illustration: ReactNode;
}

const pillars: Pillar[] = [
  {
    title: "Audit & Stratégie IA",
    description:
      "On cartographie vos processus, vos données et vos points de friction. On identifie les cas d'usage IA à fort ROI et on construit une feuille de route réaliste — pas de buzzwords, que du concret avec des résultats mesurables à 3 mois.",
    tags: ["Cartographie", "Diagnostic", "ROI", "Feuille de route"],
    illustration: <ConseilAudit />,
  },
  {
    title: "Agents IA connectés à vos outils",
    description:
      "On déploie des assistants IA connectés à vos plateformes. Vos équipes gagnent du temps, vos clients obtiennent des réponses instantanées — le tout de manière sécurisée et intégrée à votre écosystème existant.",
    tags: ["Assistants IA", "Automatisation", "Connexion outils", "Temps réel"],
    illustration: <ConseilAgents />,
  },
  {
    title: "Formation Équipes",
    description:
      "Vos collaborateurs apprennent à tirer le meilleur de l'IA au quotidien : prompts efficaces, intégration d'outils IA dans leurs workflows, bonnes pratiques de sécurité. On forme par la pratique, sur vos cas d'usage réels.",
    tags: ["Cas pratiques", "Bonnes pratiques", "Autonomie", "Sur mesure"],
    illustration: <ConseilFormation />,
  },
];

export function ServiceConseil() {
  return (
    <div style={{ marginTop: 30, paddingBottom: 30 }}>
      <ScrollReveal>
        <Group gap="sm" align="center">
          <Text fz={28}>🧠</Text>
          <GlitchTitle fz={28} as="h2">Conseil en Intelligence Artificielle</GlitchTitle>
        </Group>
        <Text fz="sm" c="#737373" mt="xs" maw={520}>
          L'IA n'est pas une fin en soi — c'est un levier. On vous aide à l'intégrer
          là où elle crée de la valeur, pas là où elle fait joli.
        </Text>
      </ScrollReveal>

      <Stack gap={0} mt={32} style={{ position: "relative", border: "1px solid #ededed", borderBottom: "none" }}>
        <TopCrosses />
        {pillars.map((item, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <ScrollReveal key={item.title} delay={i * 60} direction="up">
              <Box
                style={{
                  position: "relative" as const,
                  display: "flex",
                  flexDirection: imageLeft ? "row" as const : "row-reverse" as const,
                  borderBottom: "1px solid #ededed",
                  minHeight: 380,
                }}
              >
                <div
                  style={{
                    width: "50%",
                    flexShrink: 0,
                    background: "#ffffff",
                    borderRight: imageLeft ? "1px solid #ededed" : "none",
                    borderLeft: imageLeft ? "none" : "1px solid #ededed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                    overflow: "hidden",
                  }}
                >
                  {item.illustration}
                </div>
                <Stack gap="sm" p="xl" justify="center" style={{ width: "50%", flexShrink: 0, background: "#f9f9f9" }}>
                  <Text fz="xs" fw={600} c="#fa5d19" ff="monospace">
                    0{i + 1}
                  </Text>
                  <GlitchTitle fz={26} as="h3">{item.title}</GlitchTitle>
                  <Text fz="sm" c="#737373" lh={1.6}>
                    {item.description}
                  </Text>
                  <Group gap={6} mt={4}>
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        color="#d4d4d4"
                        c="#737373"
                        size="sm"
                        radius={0}
                        fw={400}
                        style={{ border: "1px solid #ededed" }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
                <BottomCrosses />
              </Box>
            </ScrollReveal>
          );
        })}
      </Stack>
    </div>
  );
}
