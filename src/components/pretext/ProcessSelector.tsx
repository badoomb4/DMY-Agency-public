import { useRef } from "react";
import type { ProcessDefinition } from "./processData";

interface Props {
  processes: ProcessDefinition[];
  activeKey: string;
  onChange: (key: string) => void;
}

/** Onglets de parcours — pattern WAI-ARIA tabs (flèches, Home/End). */
export function ProcessSelector({ processes, activeKey, onChange }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = processes[(index + processes.length) % processes.length]!;
    onChange(next.key);
    refs.current[(index + processes.length) % processes.length]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") select(index + 1);
    else if (e.key === "ArrowLeft") select(index - 1);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(processes.length - 1);
    else return;
    e.preventDefault();
  }

  return (
    <div role="tablist" aria-label="Type de projet" className="chips">
      {processes.map((p, i) => {
        const active = p.key === activeKey;
        return (
          <button
            key={p.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`ptab-${p.key}`}
            aria-selected={active}
            aria-controls={`ppanel-${p.key}`}
            tabIndex={active ? 0 : -1}
            className="chip"
            onClick={() => onChange(p.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
