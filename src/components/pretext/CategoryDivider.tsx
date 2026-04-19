import { Container } from "@mantine/core";
import { CrossMark } from "./GridCross";

export function CategoryDivider() {
  return (
    <div
      style={{
        position: "relative",
        height: 0,
        borderTop: "2px dashed #cececeff",
      }}
    >
      <Container size="xl" style={{ position: "relative", height: 0 }}>
        <CrossMark left={0} top={0} />
        <CrossMark left="100%" top={0} />
      </Container>
    </div>
  );
}
