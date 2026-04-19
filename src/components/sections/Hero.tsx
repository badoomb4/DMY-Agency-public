import { useRef } from "react";
import { Container, Title, Text, Button, Group, Stack, Badge } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { Vortex } from "../pretext/Vortex";

const stats = [
  { value: "50+", label: "Projets livrés" },
  { value: "98%", label: "Satisfaction" },
  { value: "24h", label: "Réponse" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <MantineProvider>
    <section
      ref={sectionRef}
      id="hero"
      style={{
        background: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Interactive dot grid — shimmer + Pretext chars on hover */}
      <Vortex trackRef={sectionRef} />

      <Container size="lg" py={120} style={{ position: "relative", zIndex: 1 }}>
        <Stack align="center" gap="lg">
          <ScrollReveal direction="none">
            <Badge
              variant="outline"
              color="#d4d4d4"
              c="#737373"
              size="lg"
              radius="xl"
              fw={500}
              style={{ border: "1px solid #ededed", background: "#ffffff" }}
            >
              🚀 Services informatiques vitaminés à l'IA
            </Badge>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <Title
              order={1}
              fz={{ base: 40, sm: 52, md: 64 }}
              lh={1.05}
              c="#262626"
              ta="center"
              style={{ letterSpacing: "-2.5px" }}
            >
              On transforme vos idées en produits qui{" "}
              <span style={{ color: "#fa5d19" }}>marchent</span>.
            </Title>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <Text fz={{ base: "md", md: "lg" }} c="#737373" ta="center" maw={520} lh={1.6}>
              Développement sur mesure et conseil en intelligence artificielle
              pour les entreprises qui veulent une longueur d'avance.
            </Text>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <Group gap="md" mt="sm">
              <Button
                component="a"
                href="#contact"
                color="#262626"
                size="lg"
                radius="md"
                fw={500}
              >
                Démarrer un projet →
              </Button>
              <Button
                component="a"
                href="#services"
                variant="outline"
                color="#d4d4d4"
                c="#262626"
                size="lg"
                radius="md"
                fw={500}
                style={{ border: "1px solid #ededed" }}
              >
                Voir nos services
              </Button>
            </Group>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <Group gap={48} mt={60}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <Text fw={700} fz={28} c="#262626" style={{ letterSpacing: "-1px" }}>
                    {stat.value}
                  </Text>
                  <Text fz="xs" c="#a3a3a3" mt={2}>{stat.label}</Text>
                </div>
              ))}
            </Group>
          </ScrollReveal>
        </Stack>
      </Container>
    </section>
    </MantineProvider>
  );
}
