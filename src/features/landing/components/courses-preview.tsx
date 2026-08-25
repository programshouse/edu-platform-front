import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  Code,
  Palette,
  BarChart3,
  Smartphone,
} from "lucide-react";

const courseIcons = [Code, Palette, BarChart3, Smartphone];
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
];

export function CoursesPreview() {
  const { t, i18n } = useTranslation("landing");
  const isRTL = i18n.language === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const courses = t("courses.items", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    students: number;
    lessons: number;
    hours: number;
    level: string;
    price: number;
  }>;

  return (
    <section className="py-20 lg:py-28 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            {t("courses.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {t("courses.title")}{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("courses.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t("courses.subtitle")}
          </p>
        </motion.div>

        {/* Course Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => {
            const IconComponent = courseIcons[index % courseIcons.length];
            const color = courseColors[index % courseColors.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-blue-50/60 rounded-2xl border border-blue-100 overflow-hidden hover:shadow-xl hover:shadow-blue-200/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header */}
                <div className={`${color.bg} p-6 relative overflow-hidden`}>
                  <div className="absolute -inset-e-4 -top-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${color.icon} flex items-center justify-center shadow-lg mb-3`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${color.tag}`}
                  >
                    {t(`courses.level.${course.level}`)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {(course.students ?? 0).toLocaleString()} {t("courses.students")}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.lessons} {t("courses.lessons")}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {course.hours} {t("courses.hours")}
                    </div>
                    <span className="text-lg font-extrabold text-blue-600">
                      ${course.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            {t("courses.viewAll")}
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
