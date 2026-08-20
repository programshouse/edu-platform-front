import { HeroSection } from "./components/hero-section";
import { AboutInstructor } from "./components/about-instructor";
import { IntroVideo } from "./components/intro-video";
import { StatsSection } from "./components/stats-section";
import { CoursesPreview } from "./components/courses-preview";
import { Testimonials } from "./components/testimonials";
import { CtaSection } from "./components/cta-section";
import { Footer } from "./components/footer";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutInstructor />
      <IntroVideo />
      <StatsSection />
      <CoursesPreview />
      <Testimonials />
      <CtaSection />
      <Footer />
    </>
  );
}
