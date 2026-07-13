import type { CSSProperties } from "react";

const CROSS_SIZE = 9;
const CROSS_THICKNESS = 1;
const CROSS_COLOR = "var(--brand)";

interface CrossMarkProps {
  left: string | number;
  top?: string | number;
  bottom?: string | number;
  style?: CSSProperties;
}

export function CrossMark({ left, top, bottom, style }: CrossMarkProps) {
  const isTop = top !== undefined;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left,
        ...(isTop ? { top } : { bottom: bottom ?? 0 }),
        width: CROSS_SIZE,
        height: CROSS_SIZE,
        transform: `translate(-50%, ${isTop ? "-50%" : "50%"})`,
        background: `linear-gradient(${CROSS_COLOR}, ${CROSS_COLOR}) center / ${CROSS_THICKNESS}px 100% no-repeat, linear-gradient(${CROSS_COLOR}, ${CROSS_COLOR}) center / 100% ${CROSS_THICKNESS}px no-repeat`,
        zIndex: 2,
        pointerEvents: "none" as const,
        ...style,
      }}
    />
  );
}

export function TopCrosses() {
  return (
    <>
      <CrossMark left={0} top={0} />
      <CrossMark left="50%" top={0} />
      <CrossMark left="100%" top={0} />
    </>
  );
}

export function BottomCrosses() {
  return (
    <>
      <CrossMark left={0} bottom={0} />
      <CrossMark left="50%" bottom={0} />
      <CrossMark left="100%" bottom={0} />
    </>
  );
}
