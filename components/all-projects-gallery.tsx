import Image from "next/image";
import type { CSSProperties } from "react";
import { projects } from "@/data/site-content";
import { projectGalleries } from "@/data/project-galleries";

const designs = projects.flatMap(project => projectGalleries[project.tone]?.designs ?? []);

// Known image ratios reserve the complete layout before lazy-loaded images arrive.
// Keep DOM order left-to-right while independently stacking each masonry column.
function arrange(columns: number) {
  const heights = Array<number>(columns).fill(0);
  const rows = Array<number>(columns).fill(0);
  const positions = designs.map((design, index) => {
    const column = index % columns;
    const top = `calc(var(--tile-width) * ${heights[column]} + var(--gallery-gap) * ${rows[column]})`;
    heights[column] += design.height / design.width;
    rows[column]++;
    return { column, top };
  });
  const height = `max(${heights.map((height, column) =>
    `calc(var(--tile-width) * ${height} + var(--gallery-gap) * ${Math.max(0, rows[column] - 1)})`,
  ).join(", ")})`;
  return { positions, height };
}

const desktop = arrange(4);
const mobile = arrange(2);

export function AllProjectsGallery() {
  return (
    <div className="all-projects-gallery" role="region" aria-label="All project images">
      <div className="all-projects-gallery__items" style={{
        "--desktop-height": desktop.height,
        "--mobile-height": mobile.height,
      } as CSSProperties}>
        {designs.map((design, index) => (
          <figure key={design.src} style={{
            "--desktop-column": desktop.positions[index].column,
            "--desktop-top": desktop.positions[index].top,
            "--mobile-column": mobile.positions[index].column,
            "--mobile-top": mobile.positions[index].top,
          } as CSSProperties}>
            <Image src={design.src} alt={design.alt} width={design.width} height={design.height}
              sizes="(max-width: 809px) calc((100vw - 68px) / 2), (max-width: 1780px) calc((100vw - 154px) / 4), 407px" />
          </figure>
        ))}
      </div>
    </div>
  );
}
