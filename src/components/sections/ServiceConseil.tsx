import type { ReactNode } from "react";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { TopCrosses } from "../pretext/GridCross";
import { ConseilAudit } from "../pretext/ConseilAudit";
import { ConseilAgents } from "../pretext/ConseilAgents";
import { ConseilFormation } from "../pretext/ConseilFormation";
import { ServiceSplitRow } from "./ServiceSplitRow";

interface Pillar {
  title: string;
  description: string;
  tags: string[];
  media: ReactNode;
}

const pillars: Pillar[] = [
  {
    title: "Audit & Stratégie IA",
    description:
      "On cartographie vos processus, vos données et vos points de friction. On identifie les cas d'usage IA à fort ROI et on construit une feuille de route réaliste — pas de buzzwords, que du concret avec des résultats mesurables à 3 mois.",
    tags: ["Cartographie", "Diagnostic", "ROI", "Feuille de route"],
    media: <ConseilAudit />,
  },
  {
    title: "Agents IA connectés à vos outils",
    description:
      "On déploie des assistants IA connectés à vos plateformes. Vos équipes gagnent du temps, vos clients obtiennent des réponses instantanées — le tout de manière sécurisée et intégrée à votre écosystème existant.",
    tags: ["Assistants IA", "Automatisation", "Connexion outils", "Temps réel"],
    media: <ConseilAgents />,
  },
  {
    title: "Formation Équipes",
    description:
      "Vos collaborateurs apprennent à tirer le meilleur de l'IA au quotidien : prompts efficaces, intégration d'outils IA dans leurs workflows, bonnes pratiques de sécurité. On forme par la pratique, sur vos cas d'usage réels.",
    tags: ["Cas pratiques", "Bonnes pratiques", "Autonomie", "Sur mesure"],
    media: <ConseilFormation />,
  },
];

export function ServiceConseil() {
  return (
    <div className="service-group service-group--conseil">
      <div data-reveal>
        <div className="split-head">
          <span className="split-emoji" aria-hidden="true">
            🧠
          </span>
          <GlitchTitle fz="var(--fs-2xl)" as="h2">
            Conseil en Intelligence Artificielle
          </GlitchTitle>
        </div>
        <p className="split-sub">
          L'IA n'est pas une fin en soi — c'est un levier. On vous aide à l'intégrer là où elle
          crée de la valeur, pas là où elle fait joli.
        </p>
      </div>

      <div className="split-block">
        <TopCrosses />
        {pillars.map((item, i) => (
          <ServiceSplitRow key={item.title} index={i} {...item} />
        ))}
      </div>
    </div>
  );
}
