import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Project } from "@/data/site-content";
import type { ProjectGallery } from "@/data/project-galleries";

function GalleryFigure({ design, order }: { design: ProjectGallery["designs"][number]; order?: number }) {
  return (
    <figure style={order === undefined ? undefined : { order }}>
      <figcaption>{design.name}</figcaption>
      <Image src={design.src} alt={design.alt} width={design.width} height={design.height}
        sizes="(max-width: 809px) calc(100vw - 80px), 350px" />
    </figure>
  );
}

export function ProjectCard({ project, expanded = false, expandedProject = null, gallery, onToggle }: {
  project: Project;
  expanded?: boolean;
  expandedProject?: Project["tone"] | null;
  gallery?: ProjectGallery;
  onToggle?: () => void;
}) {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const wasExpanded = useRef(expanded);
  const restoreFocus = useRef(false);
  const reducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    if (wasExpanded.current !== expanded) {
      if (expanded) cardRef.current?.focus({ preventScroll: true });
      else if (restoreFocus.current) toggleRef.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
      wasExpanded.current = expanded;
    }
  }, [expanded]);
  const collapse = () => {
    restoreFocus.current = true;
    onToggle?.();
    const card = toggleRef.current?.closest("article");
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ block: "start", behavior: "instant" });
    }
  };
  const hasHoverReveal =
    project.tone === "adidas" ||
    project.tone === "bound" ||
    project.tone === "desk" ||
    project.tone === "ragas";

  return (
    <motion.article
      ref={cardRef}
      tabIndex={expanded ? -1 : undefined}
      layout={!reducedMotion}
      layoutDependency={expandedProject}
      initial={false}
      transition={{ layout: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
      style={{ borderRadius: 12, transition: "none" }}
      className={`project-card project-card--${project.tone}${expanded ? " project-card--expanded" : ""}`}
      onKeyDown={(event) => {
        if (expanded && event.key === "Escape") {
          event.preventDefault();
          collapse();
        }
      }}
    >
      {!expanded && (project.image ? (
        <Image
          className="project-card__media project-card__image"
          src={project.image.src}
          alt={project.image.alt}
          fill
          sizes="(max-width: 809px) calc(100vw - 56px), (max-width: 1199px) 60vw, 660px"
        />
      ) : (
        <MediaPlaceholder
          className="project-card__media"
          description={`Future ${project.title} project image`}
          kind="image"
          label={project.placeholderLabel}
        />
      ))}
      <motion.div
        layout={reducedMotion ? false : "position"}
        layoutDependency={expandedProject}
        transition={{ layout: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
        className="project-card__content"
      >
        <h3>{project.title}</h3>
        <p>{project.discipline}</p>
        <p>{project.context}</p>
        {hasHoverReveal && !expanded ? (
          <span className="project-card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M5 12h13M13 7l5 5-5 5" />
            </svg>
          </span>
        ) : null}
      </motion.div>
      {onToggle && gallery && (
        <button
          ref={toggleRef}
          className="project-card__toggle"
          hidden={expanded}
          type="button"
          aria-expanded={expanded}
          aria-controls={gallery.id}
          aria-label={`Expand ${project.title} designs`}
          onClick={onToggle}
        />
      )}
      {onToggle && gallery && <div id={gallery.id} hidden={!expanded}>
        {expanded && (
          <motion.div
            className="brand-gallery"
            role="region"
            aria-label={`${project.title} designs`}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {gallery.columnCount ? (
              <div className="brand-gallery__boards brand-gallery__boards--columns">
                {Array.from({ length: gallery.columnCount }, (_, column) => (
                  <div className="brand-gallery__column" key={column}>
                    {gallery.designs.map((design, index) => index % gallery.columnCount! === column ? (
                      <GalleryFigure key={design.src} design={design} order={index} />
                    ) : null)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="brand-gallery__boards">
                {gallery.designs.map((design) => <GalleryFigure key={design.src} design={design} />)}
              </div>
            )}
            <button className="button button--dark brand-gallery__collapse" type="button" onClick={collapse}>
              Collapse designs ↑
            </button>
          </motion.div>
        )}
      </div>}
    </motion.article>
  );
}
