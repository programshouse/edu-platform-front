import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const { t } = useTranslation("landing");

  const testimonials = t("testimonials.items", {
    returnObjects: true,
  }) as Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;

  const avatarColors = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-violet-600",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {t("testimonials.title")}{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("testimonials.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative bg-linear-to-br from-blue-50 to-blue-100/60 rounded-2xl border border-blue-200 p-6 lg:p-8 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 inset-e-6 opacity-10">
                <Quote className="w-10 h-10 text-blue-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base">
                "{item.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full bg-linear-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
