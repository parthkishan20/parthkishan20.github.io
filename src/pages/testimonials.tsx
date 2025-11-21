import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Clock } from "lucide-react";

export default function Testimonials() {
  return (
    <div className="w-full min-h-screen flex items-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-4xl mx-auto"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Coming Soon</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Testimonials</h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardContent className="pt-12 pb-12 px-6 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                    <Clock className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Testimonials Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                    This section will be updated with recommendations and feedback from colleagues, mentors, and collaborators. Check back soon to see what others have to say about working with me!
                  </p>
                </div>

                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    <span>Currently collecting testimonials</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
