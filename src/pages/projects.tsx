import { motion } from "framer-motion";
import siteData from "@/data/siteData.json"
import { ExternalLink, Github, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Projects() {
  const featuredProjects = siteData.projects.filter((p) => p.featured);
  const otherProjects = siteData.projects.filter((p) => !p.featured);

  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-7xl mx-auto space-y-12"
      >
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Projects</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group border rounded-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/50 border-primary/20 relative overflow-hidden"
                >
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {project.name}
                      </h3>
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 shrink-0 group-hover:scale-110 transition-transform" />
                    </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
                      <ul className="text-xs space-y-1">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all hover:gap-2"
                      >
                        <Github className="h-4 w-4" /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-all hover:gap-2"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Other Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group border rounded-lg p-5 space-y-3 hover:shadow-lg transition-all hover:scale-[1.03] bg-gradient-to-br from-card to-card/30 border-primary/10 hover:border-primary/30"
                >
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{project.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs hover:text-primary transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}