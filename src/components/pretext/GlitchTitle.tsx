import { useState, useRef, useCallback, type ReactNode } from "react";

const GLITCH_CHARS = "01!@#$%&*+=<>?{}[]~^αβγδπΣΩ∞∂∫λ";

function pickGlitch() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
}

interface Props {
  children: string;
  fz?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "div";
}

function GlitchChar({ char }: { char: string }) {
  const [display, setDisplay] = useState(char);
  const timerRef = useRef<number | null>(null);

  const onEnter = useCallback(() => {
    setDisplay(pickGlitch());
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
    timerRef.current = window.setTimeout(cycle, 80);
  }, [char]);

  const isGlitching = display !== char;

  return (
    <span
      onMouseEnter={onEnter}
      style={{
        color: isGlitching ? "#fa5d19" : "inherit",
        transition: "color 150ms",
        cursor: "default",
      }}
    >
      {display}
    </span>
  );
}

export function GlitchTitle({ children, fz = 24, as: Tag = "div" }: Props) {
  // Strip trailing dots/punctuation — the orange square replaces them
  const text = children.replace(/[.\s]+$/, "");

  const rendered: ReactNode[] = text.split("").map((char, i) => {
    if (char === " ") return <span key={i}> </span>;
    return <GlitchChar key={i} char={char} />;
  });

  // Always append orange square at the end
  rendered.push(
    <span key="square" style={{
      color: "#fa5d19",
      fontSize: "0.35em",
      marginLeft: "0.2em",
    }}>
      ■
    </span>,
  );

  return (
    <Tag
      style={{
        fontSize: fz,
        fontWeight: 700,
        color: "#262626",
        letterSpacing: "-0.5px",
        lineHeight: 1.2,
        cursor: "default",
        fontFamily: "'Geist', system-ui, sans-serif",
        margin: 0,
      }}
    >
      {rendered}
    </Tag>
  );
}
