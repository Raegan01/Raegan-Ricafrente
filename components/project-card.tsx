import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Project } from "@/data/site-content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-card--${project.tone}`}>
      <MediaPlaceholder
        className="project-card__media"
        description={`Future ${project.title} project image`}
        kind="image"
        label={project.placeholderLabel}
      />
      <div className="project-card__content">
        <h3>{project.title}</h3>
        <p>{project.discipline}</p>
        <p>{project.context}</p>
      </div>
      {project.tone === "adidas" ? (
        <span className="project-card__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M5 12h13M13 7l5 5-5 5" />
          </svg>
        </span>
      ) : null}
    </article>
  );
}
