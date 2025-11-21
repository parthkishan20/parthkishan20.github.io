import { motion } from "framer-motion";
import { Code, Database, Layers, Cloud, Wrench, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import siteData from "@/data/siteData.json";

const skillGroups = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Languages",
    items: siteData.skills.languages,
    color: "text-blue-500",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Frameworks & Libraries",
    items: siteData.skills.frameworks,
    color: "text-purple-500",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Databases",
    items: siteData.skills.databases,
    color: "text-green-500",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud & Deployment",
    items: siteData.skills.cloud,
    color: "text-cyan-500",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Tools & Technologies",
    items: siteData.skills.tools,
    color: "text-orange-500",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Other Skills",
    items: siteData.skills.other,
    color: "text-yellow-500",
  },
];

export default function Skills() {
  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-7xl mx-auto space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Technical Skills</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiencies
          </p>
        </div>
        
        <div className="mx-auto max-w-7xl space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
              <Card className="border-primary/20 rounded-lg border p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`bg-gradient-to-br from-muted to-muted/50 rounded-full p-3 ${group.color} group-hover:scale-110 transition-transform shadow-md`}>
                      {group.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold">{group.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, itemIdx) => (
                      <Badge key={itemIdx} variant="secondary" className="text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all cursor-default hover:scale-105">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}