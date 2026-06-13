import { motion } from "framer-motion";
import siteData from "@/data/siteData.json";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    display: siteData.profile.email,
    href: `mailto:${siteData.profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    display: siteData.profile.phone,
    href: `tel:${siteData.profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    display: siteData.profile.location,
    href: null,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    display: "linkedin.com/in/parthkishan20",
    href: siteData.profile.links.linkedin,
  },
  {
    icon: Github,
    label: "GitHub",
    display: "github.com/parthkishan20",
    href: siteData.profile.links.github,
  },
];

export default function Contact() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold">Get In Touch</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            I'm always open to discussing new opportunities, collaborations, or answering questions.
          </p>
        </div>

        <div className="space-y-3">
          {contactItems.map(({ icon: Icon, label, display, href }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-4 rounded-lg border border-transparent hover:border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all"
            >
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-primary hover:underline break-all transition-colors"
                  >
                    {display}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{display}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <Button asChild>
            <a href={`mailto:${siteData.profile.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={siteData.profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              Connect on LinkedIn
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
