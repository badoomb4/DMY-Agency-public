import { useEffect, useRef, useState } from "react";

interface Props {
  actions: string[];
  livrables: string[];
}

export function ProcessStepDetail({ actions, livrables }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const itemH = 20;
  const actionsY = 36;
  const lastActionY = actionsY + actions.length * itemH;
  const sepStartY = lastActionY + 8;
  const sepEndY = sepStartY + 20;
  const livHeaderY = sepEndY + 18;
  const livStartY = livHeaderY + 16;
  const totalH = livStartY + livrables.length * itemH + 10;

  const enter = (i: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(6px)",
    transition: `opacity 300ms ease ${i * 80}ms, transform 300ms ease ${i * 80}ms`,
  });

  const font = "'Geist', system-ui, sans-serif";

  return (
    <div ref={ref} style={{ marginTop: 16 }}>
      <p className="sr-only">
        Actions : {actions.join(", ")}. Livrables : {livrables.join(", ")}.
      </p>
      <svg viewBox={`0 0 200 ${totalH}`} width="100%" aria-hidden="true">
        {/* Background card */}
        <rect x="1" y="1" width="198" height={totalH - 2} rx="8"
          fill="#fafafa" stroke="#ededed" strokeWidth="1" />

        {/* ── Actions header ── */}
        <g style={enter(0)}>
          {/* gear icon */}
          <circle cx="18" cy="18" r="6.5" stroke="#fa5d19" strokeWidth="1.2" fill="none" />
          <circle cx="18" cy="18" r="1.5" fill="#fa5d19" />
          <text x="32" y="22" fontFamily={font}
            fontSize="10.5" fontWeight="600" fill="#fa5d19">Actions</text>
        </g>

        {/* Action items */}
        {actions.map((text, i) => {
          const y = actionsY + i * itemH;
          return (
            <g key={`a${i}`} style={enter(i + 1)}>
              <circle cx="18" cy={y + 4} r="2.5" fill="#fa5d19" opacity="0.6" />
              <text x="30" y={y + 8} fontFamily={font}
                fontSize="10" fill="#525252">{text}</text>
            </g>
          );
        })}

        {/* ── Dashed arrow separator ── */}
        <g style={enter(actions.length + 1)}>
          <line x1="100" y1={sepStartY} x2="100" y2={sepEndY}
            stroke="#d4d4d4" strokeWidth="1.2" strokeDasharray="3 2" />
          <path d={`M 96 ${sepEndY - 4} L 100 ${sepEndY + 2} L 104 ${sepEndY - 4}`}
            fill="none" stroke="#d4d4d4" strokeWidth="1.2" strokeLinejoin="round" />
        </g>

        {/* ── Livrables header ── */}
        <g style={enter(actions.length + 2)}>
          {/* document icon */}
          <rect x="12" y={livHeaderY - 9} width="12" height="14" rx="2"
            stroke="#fa5d19" strokeWidth="1.2" fill="none" />
          <line x1="16" y1={livHeaderY - 3} x2="22" y2={livHeaderY - 3}
            stroke="#fa5d19" strokeWidth="0.7" />
          <line x1="16" y1={livHeaderY + 1} x2="20" y2={livHeaderY + 1}
            stroke="#fa5d19" strokeWidth="0.7" />
          <text x="32" y={livHeaderY + 1} fontFamily={font}
            fontSize="10.5" fontWeight="600" fill="#fa5d19">Livrables</text>
        </g>

        {/* Livrable items */}
        {livrables.map((text, i) => {
          const y = livStartY + i * itemH;
          return (
            <g key={`l${i}`} style={enter(actions.length + 3 + i)}>
              <rect x="13" y={y} width="9" height="11" rx="1.5"
                stroke="#fa5d19" strokeWidth="0.8" fill="none" opacity="0.5" />
              <text x="30" y={y + 9} fontFamily={font}
                fontSize="10" fill="#525252">{text}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
