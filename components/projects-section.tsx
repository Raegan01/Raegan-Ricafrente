import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/site-content";

export function ProjectsSection() {
  return (
    <section
      className="projects-section"
      id="projects"
      aria-label="Selected projects"
    >
      <Reveal className="section-heading-row">
        <div>
          <p className="eyebrow">[ Project ]</p>
          <h2 id="projects-title">Projects</h2>
          <p className="projects-section__intro">
            <em>
              What looks effortless here is the result of deliberate
              overthinking.
            </em>
          </p>
        </div>
        <span className="button button--dark" aria-hidden="true">
          See them all
        </span>
      </Reveal>
      <div className="projects-grid" id="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
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
          </article>
        ))}
      </div>
    </section>
  );
}
