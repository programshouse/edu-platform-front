import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Upload,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface StudentAssignment {
  id: number;
  title: string;
  courseName: string;
  courseId: number;
  lectureIndex: number;
  deadline: string;
  status: "submitted" | "notSubmitted" | "graded" | "late";
  grade: number | null;
  totalGrade: number;
  feedback: string | null;
}

interface AssignmentsTabProps {
  assignments: StudentAssignment[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.33 } },
};

const statusConfig = {
  submitted: {
    icon: CheckCircle,
    label: "assignments.status.submitted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconClass: "text-emerald-500",
  },
  notSubmitted: {
    icon: Clock,
    label: "assignments.status.notSubmitted",
    className: "bg-gray-50 text-gray-600 border-gray-100",
    iconClass: "text-gray-400",
  },
  graded: {
    icon: Star,
    label: "assignments.status.graded",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    iconClass: "text-blue-500",
  },
  late: {
    icon: AlertTriangle,
    label: "assignments.status.late",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    iconClass: "text-amber-500",
  },
};

function AssignmentCard({ assignment }: { assignment: StudentAssignment }) {
  const { t } = useTranslation("profile");
  const fileRef = useRef<HTMLInputElement>(null);
  const cfg = statusConfig[assignment.status];
  const StatusIcon = cfg.icon;
  const canUpload = assignment.status === "notSubmitted" || assignment.status === "late";
  const hasSolution = assignment.status === "graded" || assignment.status === "submitted";

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{assignment.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{assignment.courseName}</p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold shrink-0",
              cfg.className
            )}
          >
            <StatusIcon className={cn("w-3.5 h-3.5", cfg.iconClass)} />
            {t(cfg.label)}
          </span>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          {/* Deadline */}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-300" />
            {t("assignments.deadline")}: {assignment.deadline}
          </span>

          {/* Grade */}
          {assignment.grade !== null && (
            <span className="flex items-center gap-1 font-semibold text-blue-700">
              <Star className="w-3.5 h-3.5 text-blue-400" />
              {t("assignments.grade")}: {assignment.grade} / {assignment.totalGrade}
            </span>
          )}
        </div>

        {/* Instructor Feedback */}
        {assignment.feedback ? (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-0.5">{t("assignments.feedback")}</p>
              <p className="text-xs text-blue-600/80 leading-relaxed">{assignment.feedback}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-300 italic">{t("assignments.noFeedback")}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {canUpload && (
            <>
              <button
                id={`assignment-upload-${assignment.id}`}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-white transition-colors shadow-sm shadow-amber-200"
              >
                <Upload className="w-3.5 h-3.5" />
                {t("assignments.uploadFile")}
              </button>
              <input ref={fileRef} type="file" className="hidden" />
            </>
          )}
          {hasSolution && (
            <Link
              to={`/courses/${assignment.courseId}/lectures/${assignment.lectureIndex}/assignment/${assignment.id}`}
              id={`assignment-view-${assignment.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t("assignments.viewSolution")}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AssignmentsTab({ assignments }: AssignmentsTabProps) {
  const { t } = useTranslation("profile");

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">{t("assignments.noAssignments")}</p>
        <p className="text-sm text-gray-400 mt-1">{t("assignments.noAssignmentsDesc")}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 gap-4"
    >
      {assignments.map((a) => (
        <AssignmentCard key={a.id} assignment={a} />
      ))}
    </motion.div>
  );
}
