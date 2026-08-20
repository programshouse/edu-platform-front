import { AboutHero } from "./components/about-hero";
import { MissionVision } from "./components/mission-vision";
import { ValuesSection } from "./components/values-section";
import { AboutInstructorSection } from "./components/about-instructor-section";
import { Footer } from "@/features/landing/components/footer";
import { AboutInstructor } from "../landing/components/about-instructor";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutInstructor />
      <MissionVision />
      <ValuesSection />
      <AboutInstructorSection />
      <Footer />
    </>
  );
}
