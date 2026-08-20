import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, CalendarClock, CheckCircle2, FileBadge, XCircle } from "lucide-react";

interface AssignmentHeaderProps {
  title: string;
  description: string;
  deadlineDate: Date;
  isOverdue: boolean;
  status: string;
  courseId: string | undefined;
  lectureIndex: string | undefined;
}

export function AssignmentHeader({
  title,
  description,
  deadlineDate,
  isOverdue,
  status,
  courseId,
  lectureIndex,
}: AssignmentHeaderProps) {
  const { t, i18n } = useTranslation("courses");
  const isRtl = i18n.language === "ar";

  const getStatusBadge = () => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <CheckCircle2 className="w-4 h-4" />
            {t("assignment.submitted")}
          </span>
        );
      case "graded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <FileBadge className="w-4 h-4" />
            {t("assignment.graded", "Graded")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <XCircle className="w-4 h-4" />
            {t("assignment.notSubmitted")}
          </span>
        );
    }
  };

  return (
    <>
      <Link
        to={`/courses/${courseId}/lectures/${lectureIndex}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 font-medium"
      >
        {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        {t("test.backToCourse")}
      </Link>

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6 pb-6 border-b">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t("assignment.title", { name: title })}
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="bg-gray-50 rounded-xl p-4 border flex items-center gap-3">
               <CalendarClock className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
               <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{t("assignment.deadline")}</p>
                  <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {deadlineDate.toLocaleDateString(i18n.language)} {deadlineDate.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                  </p>
               </div>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-gray-500">{t("assignment.status")}</span>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Instructions</h3>
          <p className="whitespace-pre-wrap">{description}</p>
        </div>
      </motion.div>
    </>
  );
}
