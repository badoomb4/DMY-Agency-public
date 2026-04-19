import { MantineProvider } from "./MantineProvider";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Process } from "./sections/Process";
import { Pricing } from "./sections/Pricing";
import { Faq } from "./sections/Faq";
import { CtaFinal } from "./sections/CtaFinal";
import { CategoryDivider } from "./pretext/CategoryDivider";

export function LandingPage() {
  return (
    <MantineProvider>
      <Navbar />
      <main>
        <Hero />
        <CategoryDivider />
        <Services />
        <CategoryDivider />
        <Process />
        <CategoryDivider />
        <Pricing />
        <CategoryDivider />
        <Faq />
        <CategoryDivider />
        <CtaFinal />
      </main>
      <Footer />
    </MantineProvider>
  );
}
