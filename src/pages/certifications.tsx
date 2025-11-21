import { motion } from "framer-motion";
import React from "react";
import { Award, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import siteData from "@/data/siteData.json";

export default function Certifications() {
  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="flex flex-col">
          {siteData.certifications.map((cert, index) => (
            <React.Fragment key={index}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 md:gap-4 px-2 md:px-4 py-5 md:py-6"
              >
                <span className="flex h-12 w-12 md:h-14 md:w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Award className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  {/* First row: name (left), year (right) */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{cert.name}</h3>
                    <span className="text-sm md:text-base font-medium text-muted-foreground whitespace-nowrap">{cert.year}</span>
                  </div>
                  {/* Second row: issuer (left), link (right) */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">{cert.issuer}</span>
                    {cert.link ? (
                      <a
                        className="inline-flex items-center gap-1 md:gap-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="hidden sm:inline">View Certificate</span>
                        <span className="sm:hidden">View</span>
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">No link</span>
                    )}
                  </div>
                </div>
              </motion.div>
              {index < siteData.certifications.length - 1 && (
                <Separator className="my-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}