import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Décalage du reveal, en ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Élément révélé au scroll par le script global (src/scripts/reveal.js).
 * Ce script pose `data-in` sur le HTML SSR avant l'hydratation React :
 * suppressHydrationWarning acte cette mutation externe légitime.
 */
export function Reveal({ children, delay = 0, className, style }: Props) {
  return (
    <div
      data-reveal
      suppressHydrationWarning
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties) : style}
    >
      {children}
    </div>
  );
}
