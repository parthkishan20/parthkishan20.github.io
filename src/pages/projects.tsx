import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProjectPan } from "@/components/project-pan";
import { featuredProjects, otherProjects } from "@/data/adapters";

export default function Projects() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <ProjectPan
        heading={
          <h2 className="max-w-[30ch] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.01em]">
            What I've built.
          </h2>
        }
        projects={featuredProjects}
      />

      <div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            More projects
          </h3>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="more-projects-grid"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            {expanded ? "Show less" : `Show ${otherProjects.length} more`}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-[220ms] ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Same ProjectPan carousel as the featured row above - no
            heading (the eyebrow/toggle row above already labels this
            section), just the scroll-snap row and its own prev/next
            buttons. Collapsed by default (progressive disclosure):
            these are the uncurated projects, after the four featured
            ones above - gating them behind one click keeps the page
            shorter without dropping the content entirely. */}
        {expanded && (
          <div id="more-projects-grid" className="animate-panel-reveal mt-5">
            <ProjectPan
              projects={otherProjects}
              ariaLabel="More projects, scrollable"
            />
          </div>
        )}
      </div>
    </div>
  );
}
