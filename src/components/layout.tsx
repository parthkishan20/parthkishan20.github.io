import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const sectionNames: Record<string, string> = {
  home: "Home",
  about: "About",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  extracurricular: "Extracurricular",
  resume: "Resume",
  contact: "Contact",
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(sectionNames);
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar activeSection={activeSection} />
      <SidebarInset>
       <header className="flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
         <SidebarTrigger className="-ml-1" />
         <h1 className="text-lg font-semibold">{sectionNames[activeSection]}</h1>
         <div className="ml-auto">
           <ModeToggle />
         </div>
       </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
