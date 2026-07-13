import type { CSSProperties } from "react";
import { ProcessStepDetail } from "./ProcessStepDetail";
import type { Step } from "./processData";

interface Props {
  activeKey: string;
  steps: Step[];
}

export function ProcessTimeline({ activeKey, steps }: Props) {
  return (
    <div
      role="tabpanel"
      id={`ppanel-${activeKey}`}
      aria-labelledby={`ptab-${activeKey}`}
      tabIndex={0}
      className="steps-grid"
    >
      {steps.map((step, i) => (
        <div
          key={step.number}
          className="step-card fade-in"
          style={{ "--fade-delay": `${i * 100}ms` } as CSSProperties}
        >
          <span className="step-card__ghost" aria-hidden="true" data-n={step.number} />
          <span className="step-card__icon" aria-hidden="true">
            {step.icon}
          </span>
          <h3 className="step-card__title">{step.title}</h3>
          <p className="step-card__desc">{step.description}</p>
          <ProcessStepDetail actions={step.actions} livrables={step.livrables} />
        </div>
      ))}
    </div>
  );
}
