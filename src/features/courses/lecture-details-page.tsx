import { useParams, Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ClipboardCheck, FileText } from "lucide-react";
import { LectureBanner } from "./components/lecture-banner";
import { LectureVideoPlayer } from "./components/lecture-video-player";
import { LectureInfoCard } from "./components/lecture-info-card";
import { LectureNavigation } from "./components/lecture-navigation";
import { LectureAsks } from "./components/lecture-asks";
import { Footer } from "@/features/landing/components/footer";

type Lecture = {
  title: string;
  duration: string;
  isFree: boolean;
};

type TestOrAssignment = {
  title: string;
  type: "quiz" | "assignment";
};

type CourseItem = {
  title: string;
  description: string;
  detailedDescription: string;
  students: number;
  lessons: number;
  hours: number;
  level: string;
  price: number;
  category: string;
  image: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  availabilityPeriod: number;
  purchaseSeparately: boolean;
  lectures: Lecture[];
  testsAndAssignments: TestOrAssignment[];
};

export function LectureDetailsPage() {
  const { courseId, lectureIndex: lectureIdxParam } = useParams<{
    courseId: string;
    lectureIndex: string;
  }>();
  const { t } = useTranslation("courses");

  const courses = t("items", { returnObjects: true }) as CourseItem[];
  const courseIdx = Number(courseId);

  // Validate course
  if (isNaN(courseIdx) || courseIdx < 0 || courseIdx >= courses.length) {
    return <Navigate to="/courses" replace />;
  }

  const course = courses[courseIdx];
  const lectureIdx = Number(lectureIdxParam);

  // Validate lecture
  if (
    isNaN(lectureIdx) ||
    lectureIdx < 0 ||
    lectureIdx >= course.lectures.length
  ) {
    return <Navigate to={`/courses/${courseId}`} replace />;
  }

  const lecture = course.lectures[lectureIdx];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Banner */}
      <LectureBanner
        bannerImage={course.bannerImage}
        courseTitle={course.title}
        lectureTitle={lecture.title}
        lectureNumber={lectureIdx + 1}
        level={course.level}
        courseId={courseId!}
      />

      {/* Main Content */}
      <section className="py-10 lg:py-14 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Left — Lecture Content */}
            <div className="flex-1 min-w-0">
              {/* Video Player */}
              <LectureVideoPlayer
                isFree={lecture.isFree}
                lectureTitle={lecture.title}
                lectureIndex={lectureIdx}
              />
              

              {/* Lecture Asks / Q&A */}
              <LectureAsks />

              {/* Tests & Assignments */}
              {course.testsAndAssignments && course.testsAndAssignments.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8"
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {t("details.labels.testsAndAssignments")}
                    </h2>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {course.testsAndAssignments.map((item, index) => {
                      const isQuiz = item.type === "quiz";
                      const itemLink = isQuiz 
                        ? `/courses/${courseId}/lectures/${lectureIdxParam}/test/${index}`
                        : `/courses/${courseId}/lectures/${lectureIdxParam}/assignment/${index}`;
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                        >
                          <Link
                            to={itemLink}
                            className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                              isQuiz
                                ? "bg-blue-50/50 border-blue-100 hover:border-blue-200"
                                : "bg-amber-50/50 border-amber-100 hover:border-amber-200"
                            }`}
                          >
                            <div
                              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                                isQuiz
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-amber-100 text-amber-600"
                              }`}
                            >
                              {isQuiz ? (
                                <FileText className="w-4.5 h-4.5" />
                              ) : (
                                <ClipboardCheck className="w-4.5 h-4.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {t(`details.labels.${item.type}`)}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.section>
              )}
              
              {/* Previous / Next Navigation */}
              <LectureNavigation
                courseId={courseId!}
                currentIndex={lectureIdx}
                lectures={course.lectures}
              />
            </div>

            {/* Right — Info Card Sidebar */}
            <div className="w-full lg:w-90 shrink-0">
              <LectureInfoCard
                courseId={courseId!}
                lecture={lecture}
                lectureIndex={lectureIdx}
                totalLectures={course.lectures.length}
                lectures={course.lectures}
                level={course.level}
                purchaseSeparately={course.purchaseSeparately}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
