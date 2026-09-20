import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Github, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getProjectCategory,
  getProjectMetrics,
  getProjectTagline,
} from "@/data/adapters";
import type { projects } from "@/data/adapters";

export type Project = (typeof projects)[number];

interface ProjectPanProps {
  heading?: ReactNode;
  projects: Project[];
  ariaLabel?: string;
}

// Apple's product-comparison carousel: a plain scroll-snap row plus two
// circular prev/next buttons - not the page-pinning scroll-scrub effect
// this replaced. No CSS scroll-timeline, no sticky frame, no progress
// bar: the row is a first-class native scroller at every width, and the
// buttons are the only enhancement layered on top (deliberately no
// wheel-hijacking - see the removed effect's history for why).
export function ProjectPan({
  heading,
  projects,
  ariaLabel = "Featured projects, scrollable",
}: ProjectPanProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Tracks button enabled state against actual scroll position, same
  // rAF-gated pattern the old progress bar used (resize goes through
  // the same gate as scroll so dragging a window edge doesn't force a
  // layout read plus a style write per event).
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = viewport.scrollWidth - viewport.clientWidth;
      setCanScrollPrev(viewport.scrollLeft > 4);
      setCanScrollNext(viewport.scrollLeft < max - 4);
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    viewport.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projects]);

  // Tried converting a plain vertical wheel into horizontal pan while
  // hovering the row, matching apple.com's own comparison carousels.
  // Reverted: that pattern only reads as correct when the carousel is
  // pinned full-viewport-height, so there's nothing else on screen for
  // "scrolling" to mean. This row sits in normal page flow with content
  // visible above and below it, so intercepting the wheel at all fought
  // the page's own vertical scroll - worst right at the two edges,
  // where a reader instinctively expects to keep scrolling the page
  // (down off the first card, up off the last) and instead got panned
  // sideways through the remaining cards first. Horizontal panning
  // still works fully via drag, touch swipe, trackpad, and the
  // prev/next buttons below; vertical wheel now always scrolls the
  // page, everywhere on the page, with no special case for this row.

  const scrollByPage = (direction: 1 | -1) => {
    viewportRef.current?.scrollBy({
      left: direction * viewportRef.current.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {heading && <div className="mb-6 rail:mb-4">{heading}</div>}

      <div
        ref={viewportRef}
        role="region"
        tabIndex={0}
        aria-label={ariaLabel}
        className="project-pan-viewport -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-2 [-ms-overflow-style:none] [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:scroll-px-6 sm:px-6 rail:mx-0 rail:scroll-px-0 rail:px-0"
      >
        {projects.map((project) => (
          <ProjectPanel key={project.name} project={project} />
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous project"
          disabled={!canScrollPrev}
          onClick={() => scrollByPage(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-muted transition-colors duration-[160ms] enabled:hover:bg-border disabled:cursor-not-allowed"
        >
          <ChevronLeft
            className={`h-5 w-5 ${canScrollPrev ? "text-foreground" : "text-muted-foreground-2"}`}
          />
        </button>
        <button
          type="button"
          aria-label="Next project"
          disabled={!canScrollNext}
          onClick={() => scrollByPage(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-muted transition-colors duration-[160ms] enabled:hover:bg-border disabled:cursor-not-allowed"
        >
          <ChevronRight
            className={`h-5 w-5 ${canScrollNext ? "text-foreground" : "text-muted-foreground-2"}`}
          />
        </button>
      </div>
    </div>
  );
}

export function ProjectPanel({ project }: { project: Project }) {
  const metrics = getProjectMetrics(project.name);
  const visibleTech = project.tech.slice(0, 4);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  return (
    <article className="flex w-[min(78vw,300px)] shrink-0 snap-start flex-col gap-5 rounded-lg bg-card p-6 rail:w-[320px]">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {getProjectCategory(project.name, project.tech)}
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {getProjectTagline(project.name, project.description)}
        </p>
      </div>

      {metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="font-display text-xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">
                {metric.value}
              </dt>
              <dd className="text-xs text-muted-foreground">
                {metric.label}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="flex flex-wrap gap-1.5">
        {visibleTech.map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
        {hiddenTechCount > 0 && (
          <Badge variant="outline" className="text-xs">
            +{hiddenTechCount}
          </Badge>
        )}
      </div>

      <div className="mt-auto flex gap-4 pt-2">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" /> Code
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowUpRight className="h-4 w-4" /> Live demo
          </a>
        )}
      </div>
    </article>
  );
}
