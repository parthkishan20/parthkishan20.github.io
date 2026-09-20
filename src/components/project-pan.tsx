import { useEffect, useRef, type ReactNode } from "react";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProjectMetrics } from "@/data/adapters";
import type { projects } from "@/data/adapters";

type Project = (typeof projects)[number];

interface ProjectPanProps {
  heading: ReactNode;
  projects: Project[];
}

// notes-from-artifacts.md entry 4, built per plan 7.1/7.2/7.4 (Q10: no
// animation library — CSS scroll-driven animation only, or the plain
// scroll-snap row as the universal fallback).
//
// Base state (always, and the entire experience on mobile, in browsers
// without `animation-timeline` support, and with JS disabled): a plain
// horizontally scrollable, scroll-snapping row. See .project-pan-* in
// index.css. This is not a degraded fallback — it is a first-class
// experience per N1, and it is exactly what ships if the enhancement
// is ever deleted outright (7.2's stated recovery path).
//
// Enhanced state (>=1160px, `animation-timeline: scroll()` supported,
// no prefers-reduced-motion): the same DOM pins and scrubs
// horizontally via CSS alone — no JS branch, no hydration flash. See
// the @supports block in index.css.
export function ProjectPan({ heading, projects }: ProjectPanProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 7.4: the fallback-path progress driver. A passive scroll listener
  // on the viewport sets --pan-progress, which .project-pan-progress-bar
  // reads via scaleX. This listener still exists and still runs at
  // desktop widths without JS-independent effect on the enhanced path
  // — there the viewport is `overflow: hidden` so it never fires, and
  // the CSS scroll-timeline keyframe drives the bar instead.
  useEffect(() => {
    const viewport = viewportRef.current;
    const bar = progressBarRef.current;
    if (!viewport || !bar) return;

    // resize goes through the same rAF gate as scroll. It used to call
    // `update` synchronously, so dragging a window edge ran a
    // scrollWidth/clientWidth read (forces layout) plus a style write
    // per resize event. The pending frame is also cancelled on cleanup,
    // so `update` cannot run one frame late against a detached node.
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = viewport.scrollWidth - viewport.clientWidth;
      const ratio = max > 0 ? viewport.scrollLeft / max : 0;
      bar.style.setProperty("--pan-progress", ratio.toFixed(4));
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
  }, []);

  return (
    <div className="project-pan">
      <div className="project-pan-frame">
        {/* Lives inside the pinned frame, not as a sibling before it
            (notes entry 4's .pan-head markup). Once the section is
            truly pinned, only what's inside .project-pan-frame stays
            on screen — a heading rendered outside it would have
            already scrolled away by the time the pan engages, which
            is what the 1280x720 "heading, tallest panel and progress
            line all visible" acceptance check is actually testing. */}
        <div className="mb-6 rail:mb-4">{heading}</div>

        <div
          ref={viewportRef}
          tabIndex={0}
          aria-label="Featured projects, scrollable"
          className="project-pan-viewport @container -mx-5 snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 pb-2 [overscroll-behavior-x:contain] [scrollbar-width:thin] sm:-mx-6 sm:px-6 sm:scroll-px-6 rail:mx-0 rail:px-0 rail:scroll-px-0"
        >
          {/* scroll-px matches the inline padding. Snap alignment is
              measured from the scrollport (padding box) edge, so with
              scroll-padding left at `auto` the browser snapped
              scrollLeft to the padding value on first layout and ate
              the gutter: the first project card rested at rect.left 0,
              flush against the screen edge, while every other section
              on the page is inset 20/24px. Measured on load with no
              user interaction. */}
          {/* w-max: a block-level flex container defaults to filling
              its parent's width (block width:auto), not sizing to its
              own content. Without forcing it to content width here,
              `-100%` in the enhanced translateX keyframe resolves
              against the shrunk parent-matching width instead of the
              track's real (wider) content width, and the pan barely
              moves — this was caught empirically, not assumed. */}
          <div className="project-pan-track flex w-max gap-6">
            {projects.map((project) => (
              <ProjectPanel key={project.name} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-4 h-0.5 w-full rounded-full bg-border">
          <div
            ref={progressBarRef}
            className="project-pan-progress-bar h-full w-full origin-left rounded-full bg-primary"
          />
        </div>
      </div>
    </div>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const metrics = getProjectMetrics(project.name);
  const visibleTech = project.tech.slice(0, 6);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  return (
    <article className="flex w-[min(88vw,560px)] shrink-0 snap-start flex-col gap-4 rounded-lg border border-border bg-card p-6 rail:gap-3 rail:p-5 md:w-[min(70vw,480px)]">
      <div>
        <h3 className="text-lg font-semibold tracking-tight md:text-xl">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
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
            <ExternalLink className="h-4 w-4" /> Live demo
          </a>
        )}
      </div>
    </article>
  );
}
