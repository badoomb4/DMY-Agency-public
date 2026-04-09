import { Text, Box, Stack, Group, Badge } from "@mantine/core";
import { ScrollReveal } from "../ScrollReveal";
import { MonitorPretext } from "../pretext/MonitorPretext";
import { BotChat } from "../pretext/BotChat";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { AutomationFlow } from "../pretext/AutomationFlow";
import { MobileTree } from "../pretext/MobileTree";
import { EcommerceFunnel } from "../pretext/EcommerceFunnel";

const offerings = [
  {
    title: "Applications Web",
    description:
      "On conçoit des applications web taillées pour votre métier : SaaS, dashboards analytics, portails clients, back-offices. Architecture moderne, interfaces réactives, déploiement continu — vos utilisateurs accèdent à un produit fiable depuis n'importe quel navigateur.",
    tags: ["React", "Next.js", "Astro", "Supabase"],
    illustration: "app-web",
  },
  {
    title: "Applications Mobile",
    description:
      "Une seule codebase, deux plateformes. On développe des applications iOS et Android cross-platform avec une expérience native : notifications push, mode hors-ligne, performances fluides. De l'idée au store en quelques semaines.",
    tags: ["React Native", "Expo", "Flutter", "Firebase"],
    illustration: "app-mobile",
  },
  {
    title: "Bots Telegram & WhatsApp",
    description:
      "Transformez vos canaux de messagerie en véritables outils métier. Nos bots gèrent les commandes, envoient des notifications, pilotent votre CRM et répondent à vos clients 24h/24 — avec ou sans intelligence artificielle embarquée.",
    tags: ["Telegram", "WhatsApp", "LLM", "Agents", "Webhooks"],
    illustration: "bot-platforms",
  },
  {
    title: "APIs & Microservices",
    description:
      "On structure vos données et vos traitements dans des APIs documentées, versionnées et sécurisées. Architecture microservices quand la complexité l'exige, monolithe pragmatique quand ça suffit. Toujours scalable, toujours testée.",
    tags: ["Node.js", "Python", "GraphQL", "REST", "Docker"],
    illustration: "api",
  },
  {
    title: "Automatisation",
    description:
      "On identifie les tâches répétitives qui freinent vos équipes et on les automatise : synchronisation de données, génération de documents, alertes intelligentes, pipelines ETL. Moins de travail manuel, plus de fiabilité.",
    tags: ["n8n", "Zapier", "Custom", "Cron", "Webhooks"],
    illustration: "automation",
  },
  {
    title: "Sites Vitrines & E-commerce",
    description:
      "Des sites rapides, accessibles et optimisés pour le référencement. Vitrine corporate, landing pages de conversion ou boutique en ligne complète — on choisit la stack adaptée à votre budget et vos objectifs de croissance.",
    tags: ["Astro", "Shopify", "Stripe", "SEO", "CMS"],
    illustration: "ecommerce",
  },
];

export function ServiceCustomDev() {
  return (
    <div style={{ marginTop: 60 }}>
      <ScrollReveal>
        <Group gap="sm" align="center">
          <Text fz={28}>⚡</Text>
          <GlitchTitle fz={28}>Solutions sur mesure</GlitchTitle>
        </Group>
        <Text fz="sm" c="#737373" mt="xs" maw={480}>
          On crée toutes sortes d'applications, bots et systèmes adaptés
          à votre métier et vos contraintes.
        </Text>
      </ScrollReveal>

      <Stack gap={0} mt={32} style={{ border: "1px solid #ededed", borderBottom: "none" }}>
        {offerings.map((item, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <ScrollReveal key={item.title} delay={i * 60} direction="up">
              <Box
                style={{
                  display: "flex",
                  flexDirection: imageLeft ? "row" as const : "row-reverse" as const,
                  borderBottom: "1px solid #ededed",
                  minHeight: 440,
                }}
              >
                {/* Illustration */}
                <div
                  data-illustration={item.illustration}
                  style={{
                    width: "50%",
                    flexShrink: 0,
                    background: "#ffffff",
                    borderRight: imageLeft ? "1px solid #ededed" : "none",
                    borderLeft: imageLeft ? "none" : "1px solid #ededed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 20,
                    paddingBottom: 20,
                    position: "relative" as const,
                    overflow: "hidden",
                  }}
                >
                  {item.illustration === "app-web" ? (
                    <MonitorPretext />
                  ) : item.illustration === "bot-platforms" ? (
                    <BotChat />
                  ) : item.illustration === "automation" ? (
                    <AutomationFlow />
                  ) : item.illustration === "app-mobile" ? (
                    <MobileTree />
                  ) : item.illustration === "ecommerce" ? (
                    <EcommerceFunnel />
                  ) : (
                    <img
                      src={`/illustrations/${item.illustration}.svg`}
                      alt={item.title}
                      style={{ width: "100%", maxHeight: 280, objectFit: "contain" }}
                    />
                  )}
                </div>

                {/* Content */}
                <Stack gap="sm" p="xl" justify="center" style={{ width: "50%", flexShrink: 0, background: "#f9f9f9" }}>
                  <Text fz="xs" fw={600} c="#fa5d19" ff="monospace">
                    0{i + 1}
                  </Text>
                  <GlitchTitle fz={26}>{item.title}</GlitchTitle>
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
              </Box>
            </ScrollReveal>
          );
        })}
      </Stack>
    </div>
  );
}
