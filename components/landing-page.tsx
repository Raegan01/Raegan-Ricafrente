import { AboutSection } from "@/components/about-section";
import { CtaPrelude } from "@/components/cta-prelude";
import { CursorTrail } from "@/components/cursor-trail";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { ProjectsSection } from "@/components/projects-section";

export function LandingPage() {
  return (
    <>
      <Header />
      <CursorTrail />
      <main>
        <Hero />
        <div className="landing-flow">
          <ProjectsSection />
          <AboutSection />
        </div>
        <CtaPrelude />
        <Footer />
      </main>
    </>
  );
}
