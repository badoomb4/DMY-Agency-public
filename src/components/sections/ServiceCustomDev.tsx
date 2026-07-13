import type { ReactNode } from "react";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { TopCrosses } from "../pretext/GridCross";
import { MonitorPretext } from "../pretext/MonitorPretext";
import { BotChat } from "../pretext/BotChat";
import { AutomationFlow } from "../pretext/AutomationFlow";
import { MobileTree } from "../pretext/MobileTree";
import { EcommerceFunnel } from "../pretext/EcommerceFunnel";
import { ServiceSplitRow } from "./ServiceSplitRow";

interface Offering {
  title: string;
  description: string;
  tags: string[];
  media: ReactNode;
}

const offerings: Offering[] = [
  {
    title: "Applications Web",
    description:
      "On conçoit des applications web taillées pour votre métier : SaaS, dashboards analytics, portails clients, back-offices. Architecture moderne, interfaces réactives, déploiement continu — vos utilisateurs accèdent à un produit fiable depuis n'importe quel navigateur.",
    tags: ["React", "Next.js", "Astro", "Supabase"],
    media: <MonitorPretext />,
  },
  {
    title: "Applications Mobile",
    description:
      "Une seule codebase, deux plateformes. On développe des applications iOS et Android cross-platform avec une expérience native : notifications push, mode hors-ligne, performances fluides. De l'idée au store en quelques semaines.",
    tags: ["React Native", "Expo", "Flutter", "Firebase"],
    media: <MobileTree />,
  },
  {
    title: "Bots Telegram & WhatsApp",
    description:
      "Transformez vos canaux de messagerie en véritables outils métier. Nos bots gèrent les commandes, envoient des notifications, pilotent votre CRM et répondent à vos clients 24h/24 — avec ou sans intelligence artificielle embarquée.",
    tags: ["Telegram", "WhatsApp", "LLM", "Agents", "Webhooks"],
    media: <BotChat />,
  },
  {
    title: "Automatisation",
    description:
      "On identifie les tâches répétitives qui freinent vos équipes et on les automatise : synchronisation de données, génération de documents, alertes intelligentes, pipelines ETL. Moins de travail manuel, plus de fiabilité.",
    tags: ["n8n", "Zapier", "Custom", "Cron", "Webhooks"],
    media: <AutomationFlow />,
  },
  {
    title: "Sites Vitrines & E-commerce",
    description:
      "Des sites rapides, accessibles et optimisés pour le référencement. Vitrine corporate, landing pages de conversion ou boutique en ligne complète — on choisit la stack adaptée à votre budget et vos objectifs de croissance.",
    tags: ["Astro", "Shopify", "Stripe", "SEO", "CMS"],
    media: <EcommerceFunnel />,
  },
];

export function ServiceCustomDev() {
  return (
    <div className="service-group">
      <div data-reveal>
        <div className="split-head">
          <span className="split-emoji" aria-hidden="true">
            ⚡
          </span>
          <GlitchTitle fz="var(--fs-2xl)" as="h2">
            Solutions sur mesure
          </GlitchTitle>
        </div>
        <p className="split-sub">
          On crée toutes sortes d'applications, bots et systèmes adaptés à votre métier et vos
          contraintes.
        </p>
      </div>

      <div className="split-block">
        <TopCrosses />
        {offerings.map((item, i) => (
          <ServiceSplitRow key={item.title} index={i} {...item} />
        ))}
      </div>
    </div>
  );
}
