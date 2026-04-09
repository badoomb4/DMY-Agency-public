# Design : Illustrations Excalidraw animees — Process, Mobile, E-commerce

## Contexte

Suite a l'implementation reussie de l'illustration Excalidraw animee pour la section Automatisation (AutomationFlow), on etend le concept a 3 autres sections avec des representations visuelles variees pour eviter la repetition.

Sections concernees :
- **Process** — remplace la grille de 4 cards par une timeline horizontale
- **Applications Mobile** — remplace le SVG statique par un schema en arbre
- **Sites Vitrines & E-commerce** — remplace le SVG statique par un funnel

## Decision

Approche B — un composant par section, avec un hook partage (`useExcalidrawFlow`) et un module d'animation refactore (`excalidrawAnimation.ts`).

Le module d'animation existant (`automationFlowAnimation.ts`) est refactore pour etre paramétrable et renomme. AutomationFlow est migre.

## Schemas

### 1. Process — Timeline horizontale a milestones

**Remplace :** `SimpleGrid` de 4 cards dans `Process.tsx`
**Layout :** Pleine largeur dans la section Process

Structure :
- Une ligne horizontale hand-drawn (legerement ondulee)
- 4 cercles/milestones sur la ligne, remplis #fa5d19
- Au-dessus de chaque point : icone sketch (loupe, equerre, eclair, fusee)
- En dessous : titre en Virgil + description en petit

Pas de rectangles/boites — juste la ligne, les points et le texte.

**Animation phase 1 :**
- La ligne se dessine de gauche a droite (stroke-dashoffset)
- Quand la ligne atteint chaque point : le milestone apparait (scale 0->1)
- +100ms apres : icone + titre + description en fade-in depuis le bas

**Animation phase 2 :**
Un dot orange parcourt la ligne, pulse legerement sur chaque milestone (scale bounce), fade-out a droite. Pause, recommence.

**IDs SVG :**
- `#timeline-line` — le path horizontal
- `#milestone-1` a `#milestone-4`
- `#step-1` a `#step-4` — groupes icone + titre + description
- `#dot-pulse` (un seul dot, pas de fork)

**Timing table phase 1 :**

| Delai | Element | Type | Animation |
|-------|---------|------|-----------|
| 0ms | `#timeline-line` | line | stroke-dashoffset (dessine gauche->droite), 800ms |
| 200ms | `#milestone-1` | node | scale(0->1), 200ms |
| 300ms | `#step-1` | group | fade-in + translateY, 300ms |
| 400ms | `#milestone-2` | node | scale(0->1) |
| 500ms | `#step-2` | group | fade-in + translateY |
| 600ms | `#milestone-3` | node | scale(0->1) |
| 700ms | `#step-3` | group | fade-in + translateY |
| 800ms | `#milestone-4` | node | scale(0->1) |
| 900ms | `#step-4` | group | fade-in + translateY |

Duree totale : ~1.2s.

### 2. Applications Mobile — Arbre/branches

**Remplace :** SVG statique `app-mobile.svg` dans ServiceCustomDev
**Layout :** Panneau illustration 50/50

Structure :
- Tronc vertical en haut : Idee -> Design -> Codebase (3 noeuds empiles)
- A partir de Codebase : deux branches diagonales vers iOS (gauche-bas) et Android (droite-bas)
- Chaque branche a des feuilles : petites icones sketch (push, offline, perf)
- Logos Apple + Android sur les noeuds iOS/Android
- Noeud Codebase mis en avant (plus gros, stroke #fa5d19)

**Animation phase 1 :**

| Delai | Element | Animation |
|-------|---------|-----------|
| 0ms | #node-idea | fade-in + scale |
| 150ms | Trait Idee->Design | stroke-dashoffset |
| 300ms | #node-design | fade-in + scale |
| 450ms | Trait Design->Codebase | stroke-dashoffset |
| 600ms | #node-codebase | fade-in + scale + bounce |
| 800ms | Branches diagonales (parallele) | stroke-dashoffset |
| 1000ms | #node-ios + #node-android | fade-in + scale |
| 1200ms | Feuilles features (toutes) | fade-in petit scale |

**Animation phase 2 :**
Dot descend le tronc, se duplique au fork, les deux dots descendent les branches et pulsent sur les feuilles.

**IDs SVG :**
- `#node-idea`, `#node-design`, `#node-codebase`, `#node-ios`, `#node-android`
- `#trunk-1`, `#trunk-2`
- `#branch-ios`, `#branch-android`
- `#leaf-ios-1` a `#leaf-ios-3`, `#leaf-android-1` a `#leaf-android-3`
- `#dot-pulse`, `#dot-pulse-b`

### 3. Sites Vitrines & E-commerce — Funnel

**Remplace :** SVG statique `ecommerce.svg` dans ServiceCustomDev
**Layout :** Panneau illustration 50/50

Structure :
- Entonnoir : 5 niveaux de trapèzes empiles, de plus en plus etroits
- Bords = lignes convergentes hand-drawn (pas des rectangles fermes)
- Chaque niveau : icone sketch a gauche + label a droite en Virgil
- Niveaux : Visiteurs -> Landing page -> Produit -> Panier -> Achat
- Annotations manuscrites a droite : pourcentages decroissants (100% -> 60% -> 35% -> 20% -> 8%)
- Dernier niveau (Achat) : fill hachures #fa5d19

**Animation phase 1 :**

| Delai | Element | Animation |
|-------|---------|-----------|
| 0ms | Bords gauche + droit | stroke-dashoffset (haut en bas) |
| 200ms | Niveau 1 : Visiteurs | fade-in |
| 400ms | Separateur 1 | stroke-dashoffset |
| 500ms | Niveau 2 : Landing | fade-in |
| 700ms | Separateur 2 | stroke-dashoffset |
| 800ms | Niveau 3 : Produit | fade-in |
| 1000ms | Separateur 3 | stroke-dashoffset |
| 1100ms | Niveau 4 : Panier | fade-in |
| 1300ms | Separateur 4 | stroke-dashoffset |
| 1400ms | Niveau 5 : Achat (fill orange) | fade-in + pulse |

**Animation phase 2 :**
5-6 dots tombent depuis le haut. A chaque separateur, 1-2 dots devient vers les bords et disparaissent. Le dernier dot atteignant Achat pulse en orange. Visuellement : le flux de conversion.

Les dots sont geres par `startFunnelLoop(container)`.

**Implementation de startFunnelLoop :**

1. **Creation des dots :** 5 elements `<circle r="3" fill="#fa5d19">` sont crees via `document.createElementNS` et appendes au SVG root. Positions initiales : repartis horizontalement en haut du funnel (y = valeur du haut de `#funnel-left`), x = positions equidistantes entre les bords gauche et droit.

2. **Mouvement :** Chaque dot descend avec `requestAnimationFrame`. La vitesse est constante (ex: 1.5px/frame). Les coordonnees x de chaque dot convergent progressivement vers le centre (interpolation lineaire entre la largeur du funnel a y_courant et y_bas).

3. **Elimination :** A chaque separateur (y connu via les attributs du path `#separator-N`), on compare un random [0,1] a un seuil :
   - Separateur 1 : 40% elimines (2 dots devient vers les bords, opacity->0 en 300ms)
   - Separateur 2 : 40% des restants (1 dot elimine)
   - Separateur 3 : 50% (1 dot)
   - Separateur 4 : 50% (le dernier survivant pulse ou pas)
   La deviation = le dot arrete de descendre et translate en x vers le bord le plus proche, avec fade-out.

4. **Arrivee :** Le dot survivant (1-2 max) atteint le dernier niveau et pulse en orange (#fa5d19, scale 1->1.5->1) avant de fade-out.

5. **Cleanup :** Tous les `<circle>` crees sont retires du DOM (`remove()`) a la fin du cycle. Pause 1.5s, puis un nouveau cycle demarre avec 5 nouveaux dots.

6. **Retour :** La fonction retourne un cleanup qui appelle `cancelAnimationFrame` et retire tous les dots du DOM.

**IDs SVG :**
- `#funnel-left`, `#funnel-right`
- `#separator-1` a `#separator-4`
- `#level-1` a `#level-5`
- `#funnel-fill`
- `#funnel-svg-root` — le `<svg>` root, parent pour les dots dynamiques

## Architecture

### Hook partage : useExcalidrawFlow.ts (~40 lignes)

Encapsule le boilerplate commun :
- Container ref + dangerouslySetInnerHTML
- State machine (idle -> entering -> looping -> paused)
- prefers-reduced-motion check
- IntersectionObserver lifecycle + cleanup

Signature :
```tsx
function useExcalidrawFlow(
  svgString: string,
  onEntrance: (container: HTMLElement) => Promise<void>,
  onStartLoop: (container: HTMLElement) => () => void,
  onReducedMotion: (container: HTMLElement) => void,
): { containerRef: RefObject<HTMLDivElement>; containerProps: object }
```

Chaque composant passe ses propres callbacks :
- `onEntrance` : closure sur `runEntrance(container, MY_SEQUENCE)`
- `onStartLoop` : closure sur `startDotLoop(container, MY_CONFIG)` ou `startFunnelLoop(container)`
- `onReducedMotion` : affiche tout d'un coup (chaque composant sait quels elements reveler)

Exemple pour AutomationFlow :
```tsx
const { containerProps } = useExcalidrawFlow(
  svgString,
  (el) => runEntrance(el, AUTOMATION_SEQUENCE),
  (el) => startDotLoop(el, AUTOMATION_CONFIG),
  (el) => showAllElements(el, '[id^="node-"], [id^="arrow-"]'),
);
```

`showAllElements` est un utilitaire exporte par le module d'animation qui set opacity=1, transform=scale(1), et strokeDashoffset=0 sur tous les elements matches.

### Modules d'animation (split pour respecter la limite 200 lignes)

Refactoring de `automationFlowAnimation.ts` en 3 modules :

**`excalidrawEntrance.ts` (~80 lignes) :**
- `runEntrance(container, sequence)` — sequence passee en argument
- `showAllElements(container, selector)` — utilitaire pour prefers-reduced-motion
- Types : `EntranceStep`

**`excalidrawDotLoop.ts` (~100 lignes) :**
- `startDotLoop(container, config)` — config avec linearPathIds + forkPathIds + endpointIds
- Types : `DotLoopConfig`

**`excalidrawFunnelLoop.ts` (~100 lignes) :**
- `startFunnelLoop(container)` — animation specifique au funnel

**`excalidrawObserver.ts` (~15 lignes) :**
- `createVisibilityObserver(element, onVisible, onHidden)` — inchange

Type de la sequence :
```typescript
type EntranceStep = {
  selector: string;
  delay: number;
  type: "node" | "arrow" | "line" | "group";
};
```

Comportement par type :
- `"node"` : cible l'element directement. Animation: opacity 0->1, transform scale(0.8->1). Utilise `transform-box: fill-box; transform-origin: center`.
- `"arrow"` : cible le child `.arrow-path` dans le groupe. Animation: stroke-dashoffset (calcule via getTotalLength). Le groupe parent passe en opacity 1.
- `"line"` : comme `"arrow"` mais cible l'element directement (pas de child .arrow-path). Le path a dessiner EST l'element. Utilise pour les traits de tronc, la timeline, les separateurs.
- `"group"` : cible l'element directement. Animation: opacity 0->1, translateY(8px->0). Pas de scale. Utilise pour les blocs texte (titre + description sous les milestones, labels des niveaux du funnel).

Type de la config dot loop :
```typescript
type DotLoopConfig = {
  dotId: string;             // default "#dot-pulse"
  linearPathIds: string[];
  forkPathIds: string[];
  endpointIds?: string[];    // IDs d'elements ou le dot pulse a l'arrivee (ex: feuilles du tree)
  cycleDuration?: number;    // default 3000
  pauseDuration?: number;    // default 1000
};
```

Gestion du second dot pour les forks : quand `forkPathIds` est non-vide, `startDotLoop` clone le dot (`dotEl.cloneNode()`) au moment du fork et l'ajoute au meme parent SVG. Le clone est retire du DOM a la fin du cycle. Pas besoin de `#dot-pulse-b` predéfini dans le SVG — les SVG qui listaient `#dot-pulse-b` n'en ont plus besoin.

```typescript
```

Pour MobileTree : `linearPathIds: ["#trunk-1", "#trunk-2"]`, `forkPathIds: ["#branch-ios", "#branch-android"]`, `endpointIds: ["#leaf-ios-1", "#leaf-ios-2", "#leaf-ios-3", "#leaf-android-1", "#leaf-android-2", "#leaf-android-3"]`. Quand le dot atteint la fin d'un fork path, il pulse (scale bounce) sur chaque endpoint avant de fade-out.

Pour ProcessTimeline : `linearPathIds: ["#timeline-line"]`, `forkPathIds: []` (pas de fork). Le dot parcourt la ligne et pulse sur chaque milestone en passant. Les milestones sont detectes par leur position sur le path (points a 25%, 50%, 75%, 100% de la longueur).

### Fichiers

**Crees :**
```
src/assets/process-timeline.svg
src/assets/mobile-tree.svg
src/assets/ecommerce-funnel.svg
src/components/pretext/useExcalidrawFlow.ts
src/components/pretext/excalidrawEntrance.ts
src/components/pretext/excalidrawDotLoop.ts
src/components/pretext/excalidrawFunnelLoop.ts
src/components/pretext/excalidrawObserver.ts
src/components/pretext/ProcessTimeline.tsx
src/components/pretext/MobileTree.tsx
src/components/pretext/EcommerceFunnel.tsx
```

**Modifies :**
```
src/components/pretext/AutomationFlow.tsx    — migre vers useExcalidrawFlow + nouveaux modules
src/components/sections/ServiceCustomDev.tsx — ajout conditionnels MobileTree + EcommerceFunnel
src/components/sections/Process.tsx          — remplace SimpleGrid par ProcessTimeline
```

**Supprimes :**
```
src/components/pretext/automationFlowAnimation.ts    — remplace par les 4 modules split
```

### Migration AutomationFlow

L'actuel `AutomationFlow.tsx` (85 lignes) est simplifie :
- La sequence d'entree (actuellement dans `automationFlowAnimation.ts` lignes 1-11) devient une constante `AUTOMATION_SEQUENCE` dans `AutomationFlow.tsx`
- La config dot loop (`ARROW_IDS` / `FORK_IDS` actuels) devient un objet `DotLoopConfig` passe a `startDotLoop`
- La convention `.arrow-path` est preservee dans le type `"arrow"` de `EntranceStep`
- Le boilerplate state machine / observer / reduced-motion est remplace par `useExcalidrawFlow`
- Le composant passe de ~85 lignes a ~25 lignes

### Integration Process.tsx

Le header de la section (ScrollReveal + titre "Un process clair, sans surprise.") est conserve. Seul le `SimpleGrid` + map de cards est remplace par `<ProcessTimeline />`. Les ScrollReveal individuels sur chaque card disparaissent (l'animation est geree par le hook).

### Logos supplementaires

Pour MobileTree :
- `apple.svg` : telecharger depuis `https://raw.githubusercontent.com/gilbarbara/logos/main/logos/apple.svg` vers `public/illustrations/logos/apple.svg`
- Android : reutiliser `public/illustrations/android-svgrepo-com.svg` existant (copier ou referencer directement)

### Responsive

Meme approche que AutomationFlow : viewBox fixe + width: 100% + preserveAspectRatio.

Pour ProcessTimeline (pleine largeur) : le viewBox sera plus large (~900x250) et le SVG se scale naturellement. Les descriptions sous chaque milestone seront courtes (max 2 lignes).

### Performance

- Chaque SVG est inline via `?raw` import depuis `src/assets/`
- Animations CSS pour phase 1, rAF uniquement pour les dots en phase 2
- Chaque composant nettoie ses observers et rAF au unmount via le hook partage
- Pas de dependance npm supplementaire

### Accessibilite

Chaque composant a :
- `role="img"` + `aria-label` descriptif
- `prefers-reduced-motion: reduce` → affichage complet sans animation
