import { useState, useRef, useEffect, useCallback } from "react";
import { prepare, layout, type PreparedText } from "@chenglou/pretext";

interface AccordionItem {
  question: string;
  answer: string;
}

interface Props {
  items: AccordionItem[];
}

function parsePx(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function getFont(styles: CSSStyleDeclaration) {
  return styles.font.length > 0
    ? styles.font
    : `${styles.fontStyle} ${styles.fontVariant} ${styles.fontWeight} ${styles.fontSize} / ${styles.lineHeight} ${styles.fontFamily}`;
}

export function PretextAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>(() => items.map(() => 0));
  const answerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preparedRef = useRef<{ font: string; texts: PreparedText[] }>({ font: "", texts: [] });

  const measure = useCallback(() => {
    const firstP = answerRefs.current[0];
    const firstInner = innerRefs.current[0];
    if (!firstP || !firstInner) return;

    const pStyles = getComputedStyle(firstP);
    const innerStyles = getComputedStyle(firstInner);
    const font = getFont(pStyles);
    const lh = parsePx(pStyles.lineHeight);
    const w = firstP.getBoundingClientRect().width;
    const py = parsePx(innerStyles.paddingTop) + parsePx(innerStyles.paddingBottom);

    if (preparedRef.current.font !== font) {
      preparedRef.current = {
        font,
        texts: items.map((item) => prepare(item.answer, font)),
      };
    }

    const newHeights = preparedRef.current.texts.map((prepared) => {
      const result = layout(prepared, w, lh);
      return Math.ceil(result.height + py);
    });
    setHeights(newHeights);
  }, [items]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              background: "#f9f9f9",
              border: "1px solid #ededed",
              borderRadius: 8,
              overflow: "hidden",
              transition: "border-color 150ms",
              borderColor: isOpen ? "#d4d4d4" : "#ededed",
            }}
          >
            <button
              onClick={() => { setOpenIndex(isOpen ? null : i); measure(); }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#262626",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              {item.question}
              <span
                style={{
                  transition: "transform 200ms ease",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  fontSize: 14,
                  color: "#a3a3a3",
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                ▶
              </span>
            </button>
            <div
              style={{
                height: isOpen ? heights[i] : 0,
                overflow: "hidden",
                transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                ref={(el) => { innerRefs.current[i] = el; }}
                style={{ padding: "0 20px 16px" }}
              >
                <p
                  ref={(el) => { answerRefs.current[i] = el; }}
                  style={{ color: "#737373", fontSize: 14, lineHeight: 1.7, margin: 0 }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
