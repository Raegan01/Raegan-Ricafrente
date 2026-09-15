"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { AllProjectsGallery } from "@/components/all-projects-gallery";
import { Reveal } from "@/components/reveal";
import { projects, type Project } from "@/data/site-content";
import { projectGalleries } from "@/data/project-galleries";

const projectRows = [projects.slice(0, 2), projects.slice(2)];

export function ProjectsSection() {
  const [expandedProject, setExpandedProject] = useState<Project["tone"] | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <section
      className="projects-section"
      id="projects"
      aria-label="Selected projects"
    >
      <div className={`section-canvas projects-section__canvas${showAll ? " projects-section__canvas--all" : ""}`}>
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
          <button className="button button--dark" type="button" aria-expanded={showAll}
            aria-controls="projects-grid" onClick={(event) => {
              setExpandedProject(null);
              setShowAll(open => !open);
              event.currentTarget.focus({ preventScroll: true });
            }}>
            {showAll ? "Back to projects" : "See them all"}
          </button>
        </Reveal>
        <div className={`projects-grid${expandedProject ? " projects-grid--expanded" : ""}`} id="projects-grid">
          {showAll ? <AllProjectsGallery /> : projectRows.map((row) => (
            <div className="projects-grid__row" key={row[0].title}>
              {row.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  expandedProject={expandedProject}
                  expanded={project.tone === expandedProject}
                  gallery={projectGalleries[project.tone]}
                  onToggle={projectGalleries[project.tone] ? () => setExpandedProject((open) => open === project.tone ? null : project.tone) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
