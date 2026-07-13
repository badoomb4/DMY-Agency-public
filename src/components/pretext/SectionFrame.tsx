import type { ReactNode } from "react";

/** Cadre de section : bordures latérales + rythme vertical (voir layout.css). */
export function SectionFrame({ children }: { children: ReactNode }) {
  return <div className="frame">{children}</div>;
}
