import { ScrollingLogos } from "./ScrollingLogos";

const LOGOS = [
  { src: "/illustrations/telegram-svgrepo-com.svg", color: "#26A5E4" },
  { src: "/illustrations/whatsapp-svgrepo-com.svg", color: "#25D366" },
];

export function BotBackground() {
  return <ScrollingLogos logos={LOGOS} />;
}
