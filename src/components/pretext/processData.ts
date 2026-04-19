import type { ReactNode } from "react";
import {
  IconSearch, IconGrid, IconBolt, IconCheck, IconWrench,
  IconMap, IconWorkflow, IconPlug, IconChart,
  IconTarget, IconPen, IconCode, IconRocket,
} from "./processIcons";

export interface Step {
  number: string;
  duration: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions: string[];
  livrables: string[];
}

export interface ProcessDefinition {
  key: string;
  label: string;
  subtitle: string;
  steps: Step[];
}

export const PROCESSES: ProcessDefinition[] = [
  {
    key: "apps",
    label: "Applications",
    subtitle: "5 étapes pour passer de l'idée à la mise en production.",
    steps: [
      {
        number: "01", duration: "2j", title: "Découverte",
        description: "Analyse de votre contexte, contraintes, objectifs et utilisateurs cibles.",
        icon: IconSearch(),
        actions: ["Audit existant", "Interviews", "Analyse marché", "Cadrage objectifs"],
        livrables: ["Brief projet", "Personas", "User stories"],
      },
      {
        number: "02", duration: "2j", title: "Stratégie",
        description: "Architecture technique, choix technologiques et planning de livraison.",
        icon: IconGrid(),
        actions: ["Choix architecture", "Définition stack", "Wireframes UX", "Planning sprints"],
        livrables: ["Cahier des charges", "Maquettes", "Roadmap"],
      },
      {
        number: "03", duration: "5j", title: "Exécution",
        description: "Développement itératif avec demos régulières et ajustements continus.",
        icon: IconBolt(),
        actions: ["Setup infra", "Dev itératif", "Tests auto", "Code review"],
        livrables: ["Repo Git", "App fonctionnelle", "Suite de tests"],
      },
      {
        number: "04", duration: "1j", title: "Livraison",
        description: "Déploiement en production, formation des équipes et transfert de compétences.",
        icon: IconCheck(),
        actions: ["Mise en prod", "Config DNS / SSL", "Formation équipe"],
        livrables: ["App live", "Documentation", "Accès admin"],
      },
      {
        number: "05", duration: "12j", title: "Maintenance",
        description: "Suivi continu, corrections et évolutions. 1 jour par mois sur 12 mois.",
        icon: IconWrench(),
        actions: ["Monitoring", "Fix bugs", "Mises à jour sécu", "Évolutions"],
        livrables: ["Rapports mensuels", "Patches", "Changelog"],
      },
    ],
  },
  {
    key: "automation",
    label: "Automatisation",
    subtitle: "4 étapes pour automatiser vos workflows et déployer vos bots.",
    steps: [
      {
        number: "01", duration: "1j", title: "Audit workflow",
        description: "Cartographie de vos processus et identification des tâches automatisables.",
        icon: IconMap(),
        actions: ["Mapping processus", "Tâches répétitives", "Analyse outils existants"],
        livrables: ["Cartographie workflows", "Liste opportunités"],
      },
      {
        number: "02", duration: "2j", title: "Conception",
        description: "Design des scénarios, choix des outils et arbre conversationnel pour les bots.",
        icon: IconWorkflow(),
        actions: ["Design scénarios", "Choix outils", "Arbre conversationnel", "Specs techniques"],
        livrables: ["Specs techniques", "Schéma d'automatisation"],
      },
      {
        number: "03", duration: "3j", title: "Implémentation",
        description: "Configuration des workflows, intégrations API et tests end-to-end.",
        icon: IconPlug(),
        actions: ["Config workflows", "Intégrations API", "Tests end-to-end", "Gestion erreurs"],
        livrables: ["Workflows actifs", "Bot déployé", "Logs monitoring"],
      },
      {
        number: "04", duration: "6j", title: "Optimisation",
        description: "Monitoring des performances, ajustements et évolutions des scénarios.",
        icon: IconChart(),
        actions: ["Monitoring perfs", "Ajustements règles", "Évolutions scénarios"],
        livrables: ["Rapports mensuels", "KPIs automatisation"],
      },
    ],
  },
  {
    key: "sites",
    label: "Sites web",
    subtitle: "4 étapes pour un site rapide, beau et bien référencé.",
    steps: [
      {
        number: "01", duration: "1j", title: "Cadrage",
        description: "Brief créatif, benchmark concurrence et choix de la stack adaptée.",
        icon: IconTarget(),
        actions: ["Brief créatif", "Benchmark concurrence", "Arborescence", "Choix CMS"],
        livrables: ["Brief validé", "Sitemap", "Choix stack"],
      },
      {
        number: "02", duration: "2j", title: "Design",
        description: "Maquettes desktop et mobile, charte graphique et contenus SEO.",
        icon: IconPen(),
        actions: ["Maquettes desktop/mobile", "Charte graphique", "Contenus SEO"],
        livrables: ["Maquettes Figma", "Guidelines visuelles"],
      },
      {
        number: "03", duration: "3j", title: "Développement",
        description: "Intégration responsive, optimisation des performances et configuration CMS.",
        icon: IconCode(),
        actions: ["Intégration", "Responsive", "Optim perf", "Config CMS / Stripe"],
        livrables: ["Site fonctionnel", "Back-office", "Tests cross-browser"],
      },
      {
        number: "04", duration: "1j", title: "Lancement",
        description: "Mise en ligne, référencement Google et configuration analytics.",
        icon: IconRocket(),
        actions: ["Mise en ligne", "Config DNS / SSL", "Soumission Google", "Analytics"],
        livrables: ["Site live", "Search Console", "Accès admin"],
      },
    ],
  },
];
