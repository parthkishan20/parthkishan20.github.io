import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import siteData from "@/data/siteData.json";
import { Code2, Rocket, Users2, Zap } from "lucide-react";

const highlights = [
  { icon: Code2, label: "1.5 Years Experience", color: "text-blue-500" },
  { icon: Rocket, label: "5+ Projects Delivered", color: "text-purple-500" },
  { icon: Users2, label: "Team Leadership", color: "text-indigo-500" },
  { icon: Zap, label: "3.9 GPA at Stevens", color: "text-violet-500" },
];

export default function About() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl"
      >
        <div className="mx-auto max-w-3xl space-y-8 md:space-y-10">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <Avatar className="size-24 sm:size-28 md:size-36 relative border-4 border-background">
                <AvatarImage
                  src="/images/profile/avatar.png"
                  alt={`${siteData.profile.name} - Professional headshot`}
                />
                <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {siteData.profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>

          <div className="text-center space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl"
            >
              About Me
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="secondary" className="text-base px-4 py-1.5">
                {siteData.profile.title}
              </Badge>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg sm:text-xl md:text-2xl leading-relaxed text-center"
          >
            {siteData.about.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-card to-card/50 border border-primary/20 hover:scale-105 transition-transform"
                >
                  <Icon className={`h-6 w-6 ${item.color}`} />
                  <span className="text-xs sm:text-sm font-medium text-center">{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
