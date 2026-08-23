import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/features/courses/api/courses-api";
import {
  BookOpen,
  Users,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  SearchX,
} from "lucide-react";

const courseColors = [
  {
    bg: "bg-blue-50",
    icon: "from-blue-500 to-blue-600",
    border: "border-blue-100",
    tag: "bg-blue-100 text-blue-700",
  },
  {
    bg: "bg-pink-50",
    icon: "from-pink-500 to-rose-500",
    border: "border-pink-100",
    tag: "bg-pink-100 text-pink-700",
  },
  {
    bg: "bg-emerald-50",
    icon: "from-emerald-500 to-teal-600",
    border: "border-emerald-100",
    tag: "bg-emerald-100 text-emerald-700",
  },
  {
    bg: "bg-purple-50",
    icon: "from-purple-500 to-violet-600",
    border: "border-purple-100",
    tag: "bg-purple-100 text-purple-700",
  },
  {
    bg: "bg-amber-50",
    icon: "from-amber-500 to-orange-600",
    border: "border-amber-100",
    tag: "bg-amber-100 text-amber-700",
  },
  {
    bg: "bg-cyan-50",
    icon: "from-cyan-500 to-teal-500",
    border: "border-cyan-100",
    tag: "bg-cyan-100 text-cyan-700",
  },
];

type CourseItem = {
  title?: string;
  description?: string;
  students?: number;
  lessons?: number;
  hours?: number;
  level?: string;
  price?: number;
  category?: string;
  image?: string;
};

const filterKeys = [
  "all",
  "webDev",
  "design",
  "dataScience",
  "mobile",
] as const;

export function CoursesGrid() {
  const { t, i18n } = useTranslation("courses");
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apiCourses } = useQuery({
    queryKey: ["allCourses"],
    queryFn: coursesApi.all,
  });

  const courses = (
    Array.isArray(apiCourses?.data) ? apiCourses.data :
    Array.isArray(apiCourses) ? apiCourses :
    t("items", { returnObjects: true })
  ) as CourseItem[];

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return courses.filter((course) => {
      const matchesFilter =
        activeFilter === "all" || course?.category === activeFilter;
      const matchesSearch =
        !searchQuery ||
        (course?.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course?.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [courses, activeFilter, searchQuery]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-12 pe-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filterKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {t(`filters.${key}`)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => {
                const color = courseColors[index % courseColors.length];

                return (
                  <motion.div
                    key={course.title || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Card Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.title || "Course"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                      {course.level && (
                        <span
                          className={`absolute top-3 inset-s-3 inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${color.tag} backdrop-blur-sm`}
                        >
                          {t(`card.level.${course.level}`)}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title ?? ""}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {course.description ?? ""}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {(course.students ?? 0).toLocaleString()}{" "}
                          {t("card.students")}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessons ?? 0} {t("card.lessons")}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {course.hours ?? 0} {t("card.hours")}
                        </div>
                        <span className="text-lg font-extrabold text-blue-600">
                          ${course.price ?? 0}
                        </span>
                      </div>

                      {/* Enroll Button */}
                      <Link
                        to={`/courses/${index}`}
                        className="block w-full mt-4"
                      >
                        <button className="w-full group/btn flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 hover:-translate-y-0.5 transition-all duration-200 text-sm cursor-pointer">
                          {t("card.enrollNow")}
                          <ArrowIcon className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("search.noResults")}
            </h3>
            <p className="text-gray-500">{t("search.noResultsDesc")}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}