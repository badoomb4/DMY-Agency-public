import { Reveal } from "../Reveal";
import { ServiceCustomDev } from "./ServiceCustomDev";
import { ServiceConseil } from "./ServiceConseil";

export function Services() {
  return (
    <section id="services" style={{ background: "var(--surface)" }}>
      <div className="frame">
        <Reveal>
          <p className="eyebrow">{"// 01 — Services"}</p>
        </Reveal>
        <ServiceCustomDev />
        <ServiceConseil />
      </div>
    </section>
  );
}
