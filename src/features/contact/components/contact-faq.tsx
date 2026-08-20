import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function ContactFaq() {
  const { t } = useTranslation("contact");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = t("faq.items", { returnObjects: true }) as FaqItem[];

  return (
    <section className="py-16 lg:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-4">
            {t("faq.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {t("faq.title")}{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t("faq.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-2xl mx-auto space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full text-start px-6 py-4 rounded-xl border transition-all duration-200 ${
                    isOpen
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-gray-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 text-sm text-gray-600 leading-relaxed"
                    >
                      {item.answer}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
