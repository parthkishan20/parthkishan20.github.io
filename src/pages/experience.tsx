import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import siteData from "@/data/siteData.json";

export default function Experience() {
  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="relative mx-auto max-w-3xl">
          {/* Timeline vertical separator */}
          <Separator orientation="vertical" className="bg-muted absolute left-4 top-8 h-full hidden sm:block" />
          {siteData.experience.map((exp, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative mb-12 sm:mb-16 sm:pl-12"
            >
              {/* Timeline dot */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 absolute left-0 top-7 size-5 sm:flex items-center justify-center rounded-full border-2 border-background shadow-lg hidden" />
              <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    {exp.company}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 text-sm sm:text-base font-medium">
                    <span className="text-primary">{exp.role}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{exp.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-full">{exp.dates}</span>
                  </div>
                  <ul className="space-y-3 text-sm sm:text-base text-muted-foreground">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-1.5 shrink-0">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}