import type { ReactNode } from "react";
import { Reveal } from "../Reveal";
import { GlitchTitle } from "../pretext/GlitchTitle";
import { BottomCrosses } from "../pretext/GridCross";

interface Props {
  index: number;
  title: string;
  description: string;
  tags: string[];
  media: ReactNode;
}

/** Bande 50/50 alternée d'une offre (illustration + texte). */
export function ServiceSplitRow({ index, title, description, tags, media }: Props) {
  return (
    <Reveal
      delay={index * 60}
      className={index % 2 ? "split-row split-row--reverse" : "split-row"}
    >
      <div className="split-row__media">{media}</div>
      <div className="split-row__body">
        <p className="split-row__num">0{index + 1}</p>
        <GlitchTitle fz="var(--fs-xl)" as="h3">
          {title}
        </GlitchTitle>
        <p className="split-row__desc">{description}</p>
        <div className="tag-row">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <BottomCrosses />
    </Reveal>
  );
}
