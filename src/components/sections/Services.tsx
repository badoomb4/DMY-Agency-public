import { ServiceCustomDev } from "./ServiceCustomDev";
import { ServiceConseil } from "./ServiceConseil";

export function Services() {
  return (
    <section id="services" style={{ background: "var(--surface)" }}>
      <div className="frame">
        <p className="eyebrow" data-reveal>
          {"// 01 — Services"}
        </p>
        <ServiceCustomDev />
        <ServiceConseil />
      </div>
    </section>
  );
}
