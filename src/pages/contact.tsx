import { motion } from "framer-motion";
import siteData from "@/data/siteData.json";
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default function Contact() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-5xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Send className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Let's Connect</span>
          </motion.div>
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, collaborations, or answering questions. Drop me a message!
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all border border-transparent hover:border-primary/20">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">Email</p>
                  <a href={`mailto:${siteData.profile.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:text-primary hover:underline break-all transition-colors">
                    {siteData.profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all border border-transparent hover:border-primary/20">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">Phone</p>
                  <a href={`tel:${siteData.profile.phone.replace(/\s/g,"")}`} className="text-sm text-blue-600 dark:text-blue-400 hover:text-primary hover:underline transition-colors">
                    {siteData.profile.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all border border-transparent hover:border-primary/20">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-muted-foreground">{siteData.profile.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all border border-transparent hover:border-primary/20">
                <Linkedin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">LinkedIn</p>
                  <a href={siteData.profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:text-primary hover:underline break-all transition-colors">
                    linkedin.com/in/parthkishan20
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all border border-transparent hover:border-primary/20">
                <Github className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-sm">GitHub</p>
                  <a href={siteData.profile.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:text-primary hover:underline break-all transition-colors">
                    github.com/parthkishan20
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </motion.div>
    </div>
  );
}
