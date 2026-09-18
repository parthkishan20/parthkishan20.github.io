import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SEOHead } from "@/components/seo-head";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toaster";
import { SiteShell } from "@/components/site-shell";
import { Section } from "@/components/section";

// Import all pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Experience from "@/pages/experience";
import Projects from "@/pages/projects";
import Skills from "@/pages/skills";
import Education from "@/pages/education";
import Certifications from "@/pages/certifications";
import Extracurricular from "@/pages/extracurricular";
import Resume from "@/pages/resume";
import Contact from "@/pages/contact";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SEOHead />
        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>
        <SiteShell>
          <Section id="home" label="Opening">
            <Home />
          </Section>
          <Section id="about" label="About">
            <About />
          </Section>
          <Section id="experience" label="Experience">
            <Experience />
          </Section>
          <Section id="projects" label="Projects">
            <Projects />
          </Section>
          <Section id="skills" label="Skills">
            <Skills />
          </Section>
          <Section id="background" label="Background">
            <div className="flex flex-col gap-16 md:gap-20">
              <Education />
              <Certifications />
              <Extracurricular />
            </div>
          </Section>
          <Section id="contact" label="Contact">
            <div className="flex flex-col gap-16 md:gap-20">
              <Contact />
              <Resume />
            </div>
          </Section>
        </SiteShell>
        <BackToTop />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
