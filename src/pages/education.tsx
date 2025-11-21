import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import siteData from "@/data/siteData.json";

export default function Education() {
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
          {siteData.education.map((edu, idx) => (
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
                    {edu.school}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap gap-2 text-sm sm:text-base font-medium">
                    <span className="text-primary">{edu.degree}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{edu.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-muted-foreground text-sm font-medium bg-muted/50 px-3 py-1 rounded-full">{edu.dates}</span>
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent px-3 py-1 rounded-full border border-primary/20">GPA: {edu.gpa}</span>
                  </div>
                  {/* <ul className="list-disc list-inside space-y-1 text-base text-muted-foreground">
                    {edu.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}