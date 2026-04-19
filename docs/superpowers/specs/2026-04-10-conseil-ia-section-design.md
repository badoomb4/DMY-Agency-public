# Design — Section Conseil en Intelligence Artificielle

## Contexte

La section "Conseil en Intelligence Artificielle" dans ServiceConseil.tsx est actuellement 3 cartes texte minimalistes sans illustration ni interactivité. Elle doit passer au même niveau de qualité que la section "Solutions sur mesure" (ServiceCustomDev) : bandes alternées avec illustrations excalidraw animées, contenu enrichi, tags accessibles.

Le site s'adresse à un public non-technique (dirigeants, responsables métier). Aucun jargon technique (MCP, LLM, API) dans les titres ou descriptions visibles.

## Layout

Bandes alternées identiques à ServiceCustomDev : 50% illustration / 50% contenu, alternance gauche-droite, même composant Box avec border et min-height.

## 3 Piliers

### 1. Audit & Stratégie IA
- **Description** : On cartographie vos processus, vos données et vos points de friction. On identifie les cas d'usage IA à fort ROI et on construit une feuille de route réaliste — pas de buzzwords, que du concret avec des résultats mesurables à 3 mois.
- **Tags** : Cartographie, Diagnostic, ROI, Feuille de route
- **Illustration excalidraw** : flux `[Notion] [Trello] [Drive]` → `[Diagnostic IA]` → `[Plan d'action]`
- **Logos** : Notion, Trello, Google Drive

### 2. Agents IA connectés à vos outils
- **Titre renommé** (ex "Intégration LLM & Agents") pour parler résultat, pas techno
- **Description** : On déploie des assistants IA connectés à vos plateformes. Vos équipes gagnent du temps, vos clients obtiennent des réponses instantanées — le tout de manière sécurisée et intégrée à votre écosystème existant.
- **Tags** : Assistants IA, Automatisation, Connexion outils, Temps réel
- **Illustration excalidraw** : flux `[Demande]` → `[Assistant IA]` → `[WordPress] [Shopify] [Amazon] [Airbnb]`
- **Logos** : WordPress, Shopify, Amazon, Airbnb

### 3. Formation Équipes
- **Description** : Vos collaborateurs apprennent à tirer le meilleur de l'IA au quotidien : prompts efficaces, intégration d'outils IA dans leurs workflows, bonnes pratiques de sécurité. On forme par la pratique, sur vos cas d'usage réels.
- **Tags** : Cas pratiques, Bonnes pratiques, Autonomie, Sur mesure
- **Illustration excalidraw** : flux `[Découverte]` → `[Pratique sur vos outils]` → `[Autonomie]`
- **Logos** : Notion, Google Drive, Trello

## Fichiers

### Créer : `src/assets/conseil-audit.svg`
SVG excalidraw : 3 sources (logos Notion, Trello, Drive) convergeant vers noeud "Diagnostic" puis vers "Plan d'action"

### Créer : `src/assets/conseil-agents.svg`
SVG excalidraw : noeud "Demande" vers "Assistant IA" divergeant vers logos WordPress, Shopify, Amazon, Airbnb

### Créer : `src/assets/conseil-formation.svg`
SVG excalidraw : parcours linéaire Découverte → Pratique (avec logos) → Autonomie

### Créer : `src/components/pretext/ConseilAudit.tsx`
Wrapper useExcalidrawFlow pour conseil-audit.svg

### Créer : `src/components/pretext/ConseilAgents.tsx`
Wrapper useExcalidrawFlow pour conseil-agents.svg

### Créer : `src/components/pretext/ConseilFormation.tsx`
Wrapper useExcalidrawFlow pour conseil-formation.svg

### Modifier : `src/components/sections/ServiceConseil.tsx`
Passer du layout grille 3 cartes au layout bandes alternées avec illustrations
