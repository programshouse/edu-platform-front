import { CoursesHero } from "./components/courses-hero";
import { CoursesGrid } from "./components/courses-grid";
import { Footer } from "@/features/landing/components/footer";

export function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CoursesGrid />
      <Footer />
    </>
  );
}
