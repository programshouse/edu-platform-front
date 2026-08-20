import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";

export function AboutInstructor() {
  const { t } = useTranslation("landing");

  const credentials = [
    {
      icon: Briefcase,
      value: "10+",
      label: t("about.experience"),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      value: "15+",
      label: t("about.certificates"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: GraduationCap,
      value: "200+",
      label: t("about.projects"),
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/30">
                <div className="aspect-4/3 bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-300/40 mb-4">
                      <GraduationCap className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-blue-600 font-semibold text-lg">
                      Instructor
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative floating card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 inset-e-0 lg:-inset-e-6 bg-white rounded-xl shadow-lg shadow-gray-200/50 p-2 lg:p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Award className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">10+</p>
                    <p className="text-xs text-gray-500">
                      {t("about.experience")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
              {t("about.badge")}
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {t("about.title")}
            </h2>
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-6">
              {t("about.titleHighlight")}
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {t("about.description")}
            </p>

            {/* Credentials Grid */}
            <div className="grid grid-cols-3 gap-4">
              {credentials.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${item.bgColor} rounded-xl p-4 text-center`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br ${item.color} mb-2`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
