import { useTranslation } from "react-i18next";
import { FileText, FileBadge, MessageSquare } from "lucide-react";

interface AssignmentResultProps {
  status: string;
  submittedFile: string | null;
  grade: number | null;
  maxGrade: number;
  teacherComment: string | null;
}

export function AssignmentResult({
  status,
  submittedFile,
  grade,
  maxGrade,
  teacherComment,
}: AssignmentResultProps) {
  const { t } = useTranslation("courses");

  return (
    <div className="space-y-6">
      {/* Submitted file info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{submittedFile}</p>
            <p className="text-sm text-gray-500">Submitted successfully</p>
          </div>
        </div>
      </div>

      {/* Grading Info */}
      {status === "graded" && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-green-50/30 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <FileBadge className="w-5 h-5 text-green-600" />
               {t("assignment.grade")}
            </h3>
            <div className="text-2xl font-bold text-green-700">
              {grade} <span className="text-base font-medium text-green-600/60">/ {maxGrade}</span>
            </div>
          </div>
          {teacherComment && (
            <div className="p-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4 text-gray-500" />
                 {t("assignment.comment")}
              </h4>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border">
                {teacherComment}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Awaiting Grade */}
      {status === "submitted" && (
        <div className="bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 p-6 text-center">
           <p className="font-medium">Your assignment is waiting to be graded by the instructor.</p>
        </div>
      )}
    </div>
  );
}
