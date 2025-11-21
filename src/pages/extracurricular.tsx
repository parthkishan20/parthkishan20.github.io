import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import siteData from "@/data/siteData.json";

export default function Extracurricular() {
  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="flex flex-col gap-6 md:gap-8">
          {siteData.extracurricular.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
            <Card className="border-none shadow-lg bg-card/80 backdrop-blur-md">
              <CardContent className="flex flex-col gap-4 md:gap-6 py-6 md:py-8 px-4 md:px-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-muted/80 shadow">
                    {index === 0 ? <Star className="h-5 w-5 md:h-7 md:w-7 text-primary" /> : <Users className="h-5 w-5 md:h-7 md:w-7 text-primary" />}
                  </span>
                  <h2 className="font-bold text-xl md:text-2xl leading-tight">{activity.name}</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary w-fit">{activity.role}</span>
                  {activity.dates && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">{activity.dates}</span>
                  )}
                </div>
                <p className="text-sm md:text-base font-medium text-muted-foreground italic">{activity.org}</p>
                <p className="text-sm leading-relaxed text-foreground">
                  {activity.summary}
                </p>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}