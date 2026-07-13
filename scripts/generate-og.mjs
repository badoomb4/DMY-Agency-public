// Génère public/og-image.png (1200×630) — identité DMY : cadre latéral,
// croix orange, eyebrow mono, « DMY ■ », bandeau sombre. `npm run og`.
import { readFileSync, writeFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const font = (p) => readFileSync(new URL(p, import.meta.url));
const div = (style, children) => ({ type: "div", props: { style, children } });

const BAND_H = 96;
const FRAME_X = 64;

const borderCol = (left) =>
  div({
    position: "absolute",
    left,
    top: 0,
    width: 2,
    height: 630 - BAND_H,
    background: "#ededed",
  });

const cross = (left, top) =>
  div(
    {
      position: "absolute",
      left,
      top,
      color: "#fa5d19",
      fontFamily: "Geist Mono",
      fontSize: 34,
      fontWeight: 600,
    },
    "+",
  );

const root = div(
  {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#f9f9f9",
    fontFamily: "Geist",
    position: "relative",
  },
  [
    borderCol(FRAME_X),
    borderCol(1200 - FRAME_X - 2),
    cross(FRAME_X - 9, 18),
    cross(1200 - FRAME_X - 11, 18),
    cross(FRAME_X - 9, 630 - BAND_H - 62),
    cross(1200 - FRAME_X - 11, 630 - BAND_H - 62),
    div(
      {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 140px",
      },
      [
        div(
          {
            fontFamily: "Geist Mono",
            fontSize: 28,
            fontWeight: 600,
            color: "#c2410c",
            marginBottom: 24,
          },
          "// DMY — Développement & Conseil IA",
        ),
        div({ display: "flex", alignItems: "flex-end" }, [
          div(
            {
              fontSize: 170,
              fontWeight: 700,
              color: "#262626",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            },
            "DMY",
          ),
          div({
            width: 34,
            height: 34,
            background: "#fa5d19",
            marginLeft: 22,
            marginBottom: 14,
          }),
        ]),
        div(
          {
            fontSize: 40,
            color: "#525252",
            marginTop: 28,
            lineHeight: 1.3,
            maxWidth: 760,
          },
          "On transforme vos idées en produits qui marchent.",
        ),
      ],
    ),
    div(
      {
        height: BAND_H,
        background: "#171717",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 140px",
      },
      [
        div(
          {
            fontFamily: "Geist Mono",
            fontSize: 30,
            fontWeight: 600,
            color: "#f5f5f5",
          },
          "+33 6 74 30 50 67",
        ),
        div({ fontSize: 28, color: "#a3a3a3" }, "dmy-agency.com"),
      ],
    ),
  ],
);

const svg = await satori(root, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Geist", data: font("./og/geist-400.ttf"), weight: 400, style: "normal" },
    { name: "Geist", data: font("./og/geist-700.ttf"), weight: 700, style: "normal" },
    { name: "Geist Mono", data: font("./og/geist-mono-600.ttf"), weight: 600, style: "normal" },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
writeFileSync(new URL("../public/og-image.png", import.meta.url), png);
console.log(`og-image.png généré (${Math.round(png.length / 1024)} Ko)`);
