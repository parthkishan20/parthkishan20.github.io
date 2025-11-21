import { motion } from "framer-motion";
import siteData from "@/data/siteData.json";
import { Button } from "@/components/ui/button";
import { GitHubStats } from "@/components/github-stats";
import { ArrowRight, Download, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center py-8 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/30 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/30 dark:bg-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 dark:opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-7xl"
      >
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2 mb-12">
          {/* Hero Image with Professional Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <img
                src="/images/profile/avatar.png"
                alt="Parthkumar Patel - Software Developer"
                className="w-full h-auto rounded-full shadow-2xl"
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Open to Full-Time Opportunities</span>
            </motion.div>

            <h1 className="text-4xl font-bold text-balance sm:text-5xl lg:text-6xl leading-tight">
              Hi, I'm <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{siteData.profile.name}</span>
            </h1>
            
            <h2 className="text-2xl sm:text-3xl text-muted-foreground font-semibold">
              Building Scalable Web Solutions
            </h2>
            
            <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
              MS Computer Science student at <span className="font-semibold text-foreground">Stevens Institute of Technology</span> with 1.5 years of full-stack development experience. Specialized in React, TypeScript, and Node.js with a passion for creating high-performance, user-centric applications.
            </p>

            <div className="flex flex-col gap-3 w-full lg:items-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>📍 {siteData.profile.location}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                📧 {siteData.profile.email} • 📞 {siteData.profile.phone}
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start pt-4">
              <Button asChild size="lg" className="group">
                <a
                  href="#contact"
                  className="gap-2"
                >
                  Let's Connect
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="gap-2">
                <a
                  href={siteData.resume.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            </div>

            <div className="flex gap-4 pt-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={siteData.profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href={siteData.profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* GitHub Stats */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-6">GitHub Activity</h3>
          <GitHubStats />
        </div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 py-8 px-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-lg border border-primary/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                {siteData.projects.length}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Projects Completed
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {siteData.skills.languages.length + siteData.skills.frameworks.length}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Technologies Mastered
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {siteData.certifications.length}+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Professional Certifications
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
