import { Group } from "@mantine/core";
import type { ProcessDefinition } from "./processData";

interface Props {
  processes: ProcessDefinition[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function ProcessSelector({ processes, activeKey, onChange }: Props) {
  return (
    <Group gap={8} mt="lg" style={{ flexWrap: "wrap" }}>
      {processes.map((p) => {
        const active = p.key === activeKey;
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: `1px solid ${active ? "#fa5d19" : "#ededed"}`,
              background: active ? "rgba(250, 93, 25, 0.08)" : "transparent",
              color: active ? "#fa5d19" : "#737373",
              fontFamily: "'Geist', monospace",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms ease",
              outline: "none",
            }}
          >
            {p.label}
          </button>
        );
      })}
    </Group>
  );
}
