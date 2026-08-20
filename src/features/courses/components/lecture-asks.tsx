import { useTranslation } from "react-i18next";
import { MessageCircleQuestion, Clock } from "lucide-react";

export function LectureAsks() {
  const { t, i18n } = useTranslation("courses");
  const isRTL = i18n.language === "ar";

  const asks = isRTL
    ? [
        {
          time: "00:30",
          question: "ما هو قانون الحركة؟",
          answer: "هو قانون كذا وكذا، يوضح كيفية تحرك الأجسام وعلاقتها بالقوة المؤثرة عليها.",
        },
        {
          time: "02:15",
          question: "هل يمكنك إعطاء مثال على القانون الأول؟",
          answer: "الجسم الساكن يبقى ساكناً، مثل كتاب على الطاولة، ما لم تؤثر عليه قوة خارجية.",
        },
      ]
    : [
        {
          time: "00:30",
          question: "What is the law of motion?",
          answer: "It is the law of such and such, explaining how objects move in relation to forces.",
        },
        {
          time: "02:15",
          question: "Can you provide an example of the first law?",
          answer: "An object at rest stays at rest, like a book on a table, until acted upon by a force.",
        },
      ];

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <MessageCircleQuestion className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("details.asks.title")}</h2>
          <p className="text-sm text-gray-500">{t("details.asks.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-6">
        {asks.map((ask, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="shrink-0 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {ask.time}
              </span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">{ask.question}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{ask.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
