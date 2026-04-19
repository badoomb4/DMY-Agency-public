import { Title, Text, SimpleGrid, Box, Stack, Button, List, ListItem } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { SectionFrame } from "../pretext/SectionFrame";

const plans = [
  {
    name: "Starter",
    price: "Sur devis",
    description: "Pour les projets ciblés et les MVPs.",
    features: [
      "Application web ou mobile",
      "Architecture sur mesure",
      "3 mois de support inclus",
      "Livraison itérative",
    ],
    cta: "Demander un devis",
    highlighted: false,
  },
  {
    name: "Business",
    price: "Sur devis",
    description: "Pour les entreprises avec des enjeux complexes.",
    features: [
      "Tout Starter +",
      "Intégration IA / LLM",
      "Conseil stratégique inclus",
      "6 mois de support inclus",
      "Interlocuteur dédié",
    ],
    cta: "Discuter du projet",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    description: "Pour les grands comptes et les DSI.",
    features: [
      "Tout Business +",
      "Audit complet existant",
      "Équipe dédiée",
      "SLA garanti",
      "Formation équipes",
      "Support illimité",
    ],
    cta: "Nous contacter",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <MantineProvider>
    <section id="pricing" style={{ background: "#ffffff" }}>
      <SectionFrame>
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace">
            // 03 — Tarifs
          </Text>
          <div style={{ marginTop: 4 }}>
            <GlitchTitle fz={44} as="h2">Une offre adaptée à chaque ambition.</GlitchTitle>
          </div>
        </ScrollReveal>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt={50}>
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 150} direction="up">
              <Box
                p="xl"
                style={{
                  background: plan.highlighted ? "#262626" : "#f9f9f9",
                  border: plan.highlighted ? "1px solid #404040" : "1px solid #ededed",
                  borderRadius: 12,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column" as const,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Text fz="sm" fw={600} c={plan.highlighted ? "#fa5d19" : "#a3a3a3"} ff="monospace">
                    {plan.name}
                  </Text>
                  <Title
                    order={3}
                    fz={28}
                    c={plan.highlighted ? "#f5f5f5" : "#262626"}
                    mt="xs"
                    style={{ letterSpacing: "-1px" }}
                  >
                    {plan.price}
                  </Title>
                  <Text fz="sm" c={plan.highlighted ? "#a3a3a3" : "#737373"} mt={4}>
                    {plan.description}
                  </Text>
                  <List spacing="sm" mt="lg" listStyleType="none">
                    {plan.features.map((f) => (
                      <ListItem key={f}>
                        <Text fz="sm" c={plan.highlighted ? "#d4d4d4" : "#525252"}>
                          ✓ {f}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </div>
                <Button
                  component="a"
                  href="#contact"
                  fullWidth
                  mt="xl"
                  size="md"
                  radius="md"
                  fw={500}
                  color={plan.highlighted ? "#fa5d19" : "#262626"}
                >
                  {plan.cta}
                </Button>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>
      </SectionFrame>
    </section>
    </MantineProvider>
  );
}
