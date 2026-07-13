import { ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Project } from "@/data/site-content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`project-card project-card--${project.layout} project-card--${project.tone}`}
    >
      <MediaPlaceholder
        className="project-card__media"
        description={`Future ${project.title} project image`}
        kind="image"
        label={project.placeholderLabel}
      />
      <div className="project-card__content">
        <div>
          <h3>{project.title}</h3>
          <p>{project.discipline}</p>
          <p>{project.context}</p>
        </div>
        <button
          aria-label={`Open ${project.title} project`}
          className="project-card__arrow"
          disabled
          type="button"
        >
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
