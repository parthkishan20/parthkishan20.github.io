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

// M13: 72px clears the sticky mobile header/chip bar; rail:scroll-mt-6
// (24px) is enough once the rail replaces it and there's no header.
const SCROLL_ANCHOR = "scroll-mt-[72px] rail:scroll-mt-6";

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
          <section id="skills" className={`w-full ${SCROLL_ANCHOR}`}>
            <Skills />
          </section>
          <section id="background" className={`w-full ${SCROLL_ANCHOR}`}>
            <div id="education" className={SCROLL_ANCHOR}>
              <Education />
            </div>
            <div id="certifications" className={SCROLL_ANCHOR}>
              <Certifications />
            </div>
            <div id="extracurricular" className={SCROLL_ANCHOR}>
              <Extracurricular />
            </div>
          </section>
          <section id="contact" className={`w-full ${SCROLL_ANCHOR}`}>
            <div id="resume" className={SCROLL_ANCHOR}>
              <Resume />
            </div>
            <Contact />
          </section>
        </SiteShell>
        <BackToTop />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
