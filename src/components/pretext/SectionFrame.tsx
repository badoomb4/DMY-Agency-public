import { Container } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionFrameProps {
  children: ReactNode;
}

export function SectionFrame({ children }: SectionFrameProps) {
  return (
    <Container
      size="xl"
      style={{
        borderLeft: "1px solid #ededed",
        borderRight: "1px solid #ededed",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 30,
        paddingBottom: 30,
      }}
    >
      {children}
    </Container>
  );
}
