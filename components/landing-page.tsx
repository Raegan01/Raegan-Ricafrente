import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { ProjectsSection } from "@/components/projects-section";

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="landing-flow">
          <AboutSection />
          <ProjectsSection />
        </div>
        <ContactSection />
      </main>
    </>
  );
}
