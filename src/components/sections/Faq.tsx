import { Text } from "@mantine/core";
import { MantineProvider } from "../MantineProvider";
import { ScrollReveal } from "../ScrollReveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { SectionFrame } from "../pretext/SectionFrame";
import { PretextAccordion } from "../pretext/PretextAccordion";

const faqs = [
  {
    question: "Quels types de projets réalisez-vous ?",
    answer:
      "Applications web et mobiles, APIs, automatisations, intégrations IA (chatbots, agents, pipelines NLP), audits techniques et accompagnement stratégique.",
  },
  {
    question: "Combien coûte un projet type ?",
    answer:
      "Chaque projet est unique. On établit un devis détaillé après un premier échange gratuit. Nos projets démarrent généralement à partir de 5 000€.",
  },
  {
    question: "Quels sont vos délais de livraison ?",
    answer:
      "Un MVP prend entre 4 et 8 semaines. Les projets plus complexes sont livrés par itérations de 2 semaines avec des démos régulières.",
  },
  {
    question: "Travaillez-vous avec des entreprises hors de France ?",
    answer:
      "Oui, nous travaillons avec des clients dans toute l'Europe. Nos échanges se font en français et en anglais.",
  },
  {
    question: "Proposez-vous du support après livraison ?",
    answer:
      "Chaque offre inclut une période de support. Au-delà, nous proposons des contrats de maintenance adaptés à vos besoins.",
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer:
      "React, Next.js, Astro, Node.js, Python, Supabase, PostgreSQL, et les principales APIs d'IA (OpenAI, Anthropic, etc.). On choisit la stack adaptée au projet.",
  },
];

export function Faq() {
  return (
    <MantineProvider>
    <section id="faq" style={{ background: "#f9f9f9" }}>
      <SectionFrame>
        <ScrollReveal>
          <Text fz="sm" fw={600} c="#fa5d19" ff="monospace" ta="center">
            // 04 — FAQ
          </Text>
          <div style={{ marginTop: 4, textAlign: "center" }}>
            <GlitchTitle fz={44} as="h2">Questions fréquentes.</GlitchTitle>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div style={{ marginTop: 50 }}>
            <PretextAccordion items={faqs} />
          </div>
        </ScrollReveal>
      </SectionFrame>
    </section>
    </MantineProvider>
  );
}
