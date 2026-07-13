import { createVisibilityObserver } from "../pretext/excalidrawObserver";

interface LoopOptions {
  /** Dessine UNE frame (sans se re-planifier). */
  draw: () => void;
  /** Rendu unique en prefers-reduced-motion (défaut : une frame de draw). */
  staticFrame?: () => void;
}

/**
 * Boucle rAF qui ne tourne que si l'élément est dans le viewport ET l'onglet
 * visible. En reduced-motion : une seule frame statique, pas de boucle.
 * Retourne une fonction de nettoyage.
 */
export function startCanvasLoop(el: HTMLElement, { draw, staticFrame }: LoopOptions): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    (staticFrame ?? draw)();
    return () => {};
  }

  let raf = 0;
  let running = false;
  let inView = false;

  function tick() {
    draw();
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    const shouldRun = inView && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  const disconnect = createVisibilityObserver(
    el,
    () => {
      inView = true;
      sync();
    },
    () => {
      inView = false;
      sync();
    },
  );
  document.addEventListener("visibilitychange", sync);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    disconnect();
    document.removeEventListener("visibilitychange", sync);
  };
}
