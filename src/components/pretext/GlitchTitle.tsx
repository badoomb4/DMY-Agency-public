import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const GLITCH_CHARS = "01!@#$%&*+=<>?{}[]~^αβγδπΣΩ∞∂∫λ";

function pickGlitch() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
}

function GlitchChar({ char, enabled }: { char: string; enabled: boolean }) {
  const [display, setDisplay] = useState(char);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const onEnter = useCallback(() => {
    if (!enabled) return;
    let count = 0;
    function cycle() {
      count++;
      if (count < 6) {
        setDisplay(pickGlitch());
        timerRef.current = window.setTimeout(cycle, 80);
      } else {
        setDisplay(char);
        timerRef.current = null;
      }
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplay(pickGlitch());
    timerRef.current = window.setTimeout(cycle, 80);
  }, [char, enabled]);

  const isGlitching = display !== char;

  return (
    <span
      onMouseEnter={onEnter}
      style={{
        color: isGlitching ? "var(--brand)" : "inherit",
        transition: "color var(--t-fast)",
      }}
    >
      {display}
    </span>
  );
}

interface Props {
  /** Texte du titre ; `text` est requis depuis Astro (children n'y est pas une string). */
  children?: string;
  text?: string;
  fz?: number | string;
  as?: "h1" | "h2" | "h3" | "h4" | "div";
}

export function GlitchTitle({ children, text: textProp, fz = "var(--fs-2xl)", as: Tag = "div" }: Props) {
  const reduced = useReducedMotion();
  const source = textProp ?? (typeof children === "string" ? children : "");
  // La ponctuation finale est remplacée par le carré orange.
  const text = source.replace(/[.\s]+$/, "");

  const rendered: ReactNode[] = text.split("").map((char, i) => {
    if (char === " ") return <span key={i}> </span>;
    return <GlitchChar key={i} char={char} enabled={!reduced} />;
  });

  return (
    <Tag
      aria-label={source}
      style={{
        fontSize: fz,
        fontWeight: 700,
        color: "var(--text)",
        letterSpacing: "var(--ls-title)",
        lineHeight: "var(--lh-snug)",
        cursor: "default",
        margin: 0,
      }}
    >
      <span aria-hidden="true">
        {rendered}
        <span style={{ color: "var(--brand)", fontSize: "0.35em", marginLeft: "0.2em" }}>■</span>
      </span>
    </Tag>
  );
}
