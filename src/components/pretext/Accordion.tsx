import { useId, useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

/** Accordéon FAQ accessible — animation CSS grid-template-rows (voir faq.css). */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="acc">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question} className="acc__item" data-open={isOpen || undefined}>
            <h3 className="acc__q">
              <button
                id={buttonId}
                className="acc__btn"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.question}
                <span className="acc__chevron" aria-hidden="true">
                  ▶
                </span>
              </button>
            </h3>
            <div id={panelId} className="acc__panel" role="region" aria-labelledby={buttonId}>
              <div>
                <p className="acc__answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
