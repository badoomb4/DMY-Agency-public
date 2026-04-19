import { ScrollingLogos } from "./ScrollingLogos";

const LOGOS = [
  { src: "/illustrations/app-store-svgrepo-com.svg", color: "#007AFF" },
  { src: "/illustrations/android-svgrepo-com.svg", color: "#3ddc84" },
];

export function PlatformLogos() {
  return <ScrollingLogos logos={LOGOS} />;
}
