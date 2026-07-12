import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";

export function LandingPage() {
  return (
    <main>
      <Hero />
      <div className="landing-flow">
        <AboutSection />
        <ProjectsSection />
      </div>
      <ContactSection />
    </main>
  );
}
