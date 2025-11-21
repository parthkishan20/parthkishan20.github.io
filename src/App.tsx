import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { SEOHead } from "@/components/seo-head";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { SectionDivider } from "@/components/section-divider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";

// Import all pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Education from "@/pages/education";
import Experience from "@/pages/experience";
import Projects from "@/pages/projects";
import Skills from "@/pages/skills";
import Certifications from "@/pages/certifications";
import Extracurricular from "@/pages/extracurricular";
import Testimonials from "@/pages/testimonials";
import Resume from "@/pages/resume";
import Contact from "@/pages/contact";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SEOHead />
        <ScrollProgress />
        <a href="#home" className="skip-to-main">
          Skip to main content
        </a>
        <Layout>
            <section id="home" className="min-h-screen w-full">
              <Home />
            </section>
            <SectionDivider />
            <section id="about" className="min-h-screen w-full">
              <About />
            </section>
            <SectionDivider />
            <section id="experience" className="min-h-screen w-full">
              <Experience />
            </section>
            <SectionDivider />
            <section id="education" className="min-h-screen w-full">
              <Education />
            </section>
            <SectionDivider />
            <section id="skills" className="min-h-screen w-full">
              <Skills />
            </section>
            <SectionDivider />
            <section id="projects" className="min-h-screen w-full">
              <Projects />
            </section>
            <SectionDivider />
            <section id="certifications" className="min-h-screen w-full">
              <Certifications />
            </section>
            <SectionDivider />
            <section id="extracurricular" className="min-h-screen w-full">
              <Extracurricular />
            </section>
            <SectionDivider />
            <section id="testimonials" className="min-h-screen w-full">
              <Testimonials />
            </section>
            <SectionDivider />
            <section id="resume" className="min-h-screen w-full">
              <Resume />
            </section>
            <SectionDivider />
            <section id="contact" className="min-h-screen w-full">
              <Contact />
            </section>
        </Layout>
        <BackToTop />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;