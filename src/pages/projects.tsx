import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectPan } from "@/components/project-pan";
import { featuredProjects, otherProjects } from "@/data/adapters";

export default function Projects() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <ProjectPan
        heading={
          <h2 className="max-w-[30ch] text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.08] tracking-[-0.01em]">
            What I have built.
          </h2>
        }
        projects={featuredProjects}
      />

      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          More projects
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {otherProjects.map((project) => (
            <article
              key={project.name}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-[border-color,transform] duration-[220ms] hover:-translate-y-[3px] hover:border-muted-foreground-2"
            >
              <h4 className="font-semibold tracking-tight">
                {project.name}
              </h4>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.tech.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tech.length - 4}
                  </Badge>
                )}
              </div>
              {(project.github || project.demo) && (
                <div className="mt-auto flex gap-4 pt-1">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Github className="h-3.5 w-3.5" /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
