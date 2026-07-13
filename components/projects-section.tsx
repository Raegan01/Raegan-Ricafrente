import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/site-content";

export function ProjectsSection() {
  return (
    <section
      className="projects-section"
      id="projects"
      aria-label="Selected projects"
    >
      <div className="section-canvas">
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
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
