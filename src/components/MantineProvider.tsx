import { MantineProvider as Provider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import type { ReactNode } from "react";

const theme = createTheme({
  primaryColor: "orange",
  fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
  fontFamilyMonospace: "'Geist Mono', monospace",
  colors: {
    heat: [
      "#fff4ed", "#ffe8d6", "#ffc9a3", "#ffa56e",
      "#fa5d19", "#e04d10", "#b83d0d", "#8f2f0a",
      "#6b2408", "#4a1a06",
    ],
  },
  headings: {
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
});

export function MantineProvider({ children }: { children: ReactNode }) {
  return (
    <Provider theme={theme} defaultColorScheme="light">
      {children}
    </Provider>
  );
}
