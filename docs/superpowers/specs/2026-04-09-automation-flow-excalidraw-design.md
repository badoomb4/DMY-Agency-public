# Design : Illustration Excalidraw animee — Section Automatisation

## Contexte

La vitrine DMY est un site Astro + React (Mantine UI) presentant les services de l'agence. La section "Automatisation" dans `ServiceCustomDev.tsx` utilise actuellement une image SVG statique (`automation.svg`). D'autres sections (Applications Web, Bots) ont deja des composants interactifs (MonitorPretext, BotChat).

L'objectif est de remplacer l'illustration statique par un schema Excalidraw anime montrant un workflow d'automatisation concret.

## Decision

**Approche B** — Export SVG depuis Excalidraw + animation CSS/JS maison.

Alternatives ecartees :
- **Approche A** (`@excalidraw/excalidraw` embarque) : ~500kb+ de bundle pour une seule illustration. Disproportionne.
- **Approche C** (`@excalidraw/utils` + canvas) : complexite hybride SVG+canvas sans gain reel.

## Schema

### Flux represente

Formulaire web -> Google Sheets -> Email -> WhatsApp / Telegram

La derniere fleche se separe en Y (fork) vers WhatsApp et Telegram.

### Noeuds

Chaque noeud est un groupe SVG compose de :
- Rectangle Excalidraw (trait hand-drawn, fill hachures legeres)
- Logo SVG de l'app (24x24px) centre a l'interieur
- Label en dessous en police Excalidraw (Virgil, chargee via `@font-face`)

5 noeuds : `#node-form`, `#node-sheets`, `#node-email`, `#node-whatsapp`, `#node-telegram`

### Fleches

Arrows Excalidraw avec pointe, trait tremble :
- `#arrow-1` : form -> sheets
- `#arrow-2` : sheets -> email
- `#arrow-3a` : email -> whatsapp
- `#arrow-3b` : email -> telegram

### Logos

Source : `gilbarbara/logos` (CC0)
- `google-sheets-icon.svg`
- `google-gmail-icon.svg`
- `whatsapp-icon.svg`
- `telegram-icon.svg`
- Formulaire web : icone dessinee dans Excalidraw directement

Stockes dans `public/illustrations/logos/`.

## Architecture

### Fichiers

```
src/
  components/pretext/
    AutomationFlow.tsx          — Composant React (~180 lignes max)
    automationFlowAnimation.ts  — Logique d'animation (~150 lignes max)
  assets/
    automation-flow.svg          — SVG exporte depuis Excalidraw (import ?raw via Vite)

public/
  fonts/
    Virgil.woff2                 — Police Excalidraw hand-drawn
  illustrations/logos/
    google-sheets.svg
    gmail.svg
    whatsapp.svg
    telegram.svg
```

Note : le projet a deja `whatsapp-svgrepo-com.svg` et `telegram-svgrepo-com.svg` dans `public/illustrations/`. On peut les reutiliser si le style convient, sinon on utilise les versions gilbarbara dans `logos/`.

### Integration

Dans `ServiceCustomDev.tsx`, meme pattern que MonitorPretext et BotChat :

```tsx
item.illustration === "automation" ? (
  <AutomationFlow />
) : ...
```

Remplacement direct du `<img>` statique, pas de changement de structure.

### Chargement du SVG

Le SVG est place dans `src/assets/automation-flow.svg` (pas `public/`) pour permettre l'import via Vite :

```tsx
import automationFlowSvg from "../assets/automation-flow.svg?raw";
```

Le composant injecte le string SVG via `dangerouslySetInnerHTML` dans un conteneur `<div>`, puis accede aux groupes internes via `ref.querySelector()` pour appliquer les animations. Pas d'utilisation de `<img>` — necessaire pour cibler les elements internes.

## Animations

### Phase 1 — Apparition au scroll

Declenchee par IntersectionObserver (threshold: 0.3). Sequence :

| Delai | Element | Animation |
|-------|---------|-----------|
| 0ms | `#node-form` | fade-in + scale(0.8 -> 1), 300ms ease-out |
| 200ms | `#arrow-1` | stroke-dashoffset (dessin progressif), 300ms |
| 400ms | `#node-sheets` | fade-in + scale |
| 600ms | `#arrow-2` | stroke-dashoffset |
| 800ms | `#node-email` | fade-in + scale |
| 1000ms | `#arrow-3a` + `#arrow-3b` | stroke-dashoffset (parallele) |
| 1200ms | `#node-whatsapp` + `#node-telegram` | fade-in + scale (parallele) |

Duree totale : ~1.5s. Implementation : classes CSS ajoutees par JS au scroll.

### Phase 2 — Flux en boucle

Un dot orange (#fa5d19, 6px, legere ombre) parcourt les fleches :

1. Depart depuis #node-form
2. Suit #arrow-1 -> Sheets
3. Suit #arrow-2 -> Email
4. Duplication : un dot suit #arrow-3a (WhatsApp), l'autre #arrow-3b (Telegram)
5. Fade-out aux noeuds finaux
6. Pause 1s, recommence

Implementation : `getPointAtLength()` sur les `<path>` SVG + `requestAnimationFrame`.
Les fleches Excalidraw exportees sont toujours des `<path>` — verifier lors du cleanup SVG et convertir si necessaire.
Duree d'un cycle : ~3s.

## Workflow de creation du SVG

1. Creer le schema dans app.excalidraw.com
2. Placer noeuds, fleches, labels (sans logos)
3. Exporter en SVG
4. Editer le SVG : ajouter les `id` sur les groupes, inserer `<image>` pour les logos, nettoyer
5. Sauvegarder dans `src/assets/automation-flow.svg`

## Responsive

- **Desktop (>768px)** : schema horizontal complet avec fork
- **Mobile** : le SVG a un `viewBox` fixe et se scale via `width: 100%` + `preserveAspectRatio`. Limitation connue : le layout 50/50 de `ServiceCustomDev` ne s'adapte pas au mobile (pas de breakpoint). Le schema sera petit mais lisible. C'est une limitation existante du site, pas specifique a ce composant.

## Police Virgil

Excalidraw utilise la police "Virgil" pour le rendu hand-drawn. Elle doit etre chargee explicitement :

- Fichier : `public/fonts/Virgil.woff2` (telecharge depuis le repo Excalidraw)
- Declaration `@font-face` dans les styles globaux (`index.astro`) :

```css
@font-face {
  font-family: 'Virgil';
  src: url('/fonts/Virgil.woff2') format('woff2');
  font-display: swap;
}
```

- Fallback : `'Virgil', 'Segoe Print', cursive`
- Utilisee uniquement pour les labels dans le SVG d'automatisation

## Performance

- SVG inline via `?raw` import : bundle, pas de requete reseau supplementaire
- Phase 1 : CSS pur (classes ajoutees au scroll), pas de JS runtime
- Phase 2 : `requestAnimationFrame` pour le dot uniquement
- IntersectionObserver : `disconnect()` apres phase 1. Un second observer pause/reprend la boucle rAF quand le composant sort du viewport (evite le gaspillage CPU)
- Cleanup au unmount : `cancelAnimationFrame()` + observer disconnect dans le `useEffect` cleanup
- Pas de dependance npm supplementaire

## Accessibilite

- `role="img"` + `aria-label="Schema d'un workflow d'automatisation : formulaire web vers Google Sheets, email et notifications WhatsApp/Telegram"`
- `prefers-reduced-motion: reduce` -> schema complet affiche sans animation
