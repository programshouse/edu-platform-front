import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

interface TestQuestionProps {
  question: {
    id: string;
    type: string;
    text: string;
    options?: string[];
    correctAnswer: number | string | number[] | null;
    points: number;
  };
  qAns: number | string | number[] | undefined;
  showCorrection: boolean;
  isSubmitted: boolean;
  handleAnswer: (val: number | string | number[]) => void;
  handleToggleSelection: (val: number) => void;
}

export function TestQuestion({
  question,
  qAns,
  showCorrection,
  isSubmitted,
  handleAnswer,
  handleToggleSelection,
}: TestQuestionProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-sm border p-6 sm:p-10 mb-8"
    >
      {showCorrection && (
        <div
          className={`flex items-center gap-2 mb-6 p-4 rounded-xl border ${
            question.type === "essay" ? "bg-blue-50 border-blue-200 text-blue-800" :
            ((question.type === "multiple-choice" || question.type === "true-false") && qAns === question.correctAnswer) ||
            (question.type === "selection" && Array.isArray(qAns) && (question.correctAnswer as number[])?.length === qAns.length && qAns.every(v => (question.correctAnswer as number[])?.includes(v)))
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
            {question.type === "essay" ? <ShieldAlert className="w-5 h-5" /> : (
            ((question.type === "multiple-choice" || question.type === "true-false") && qAns === question.correctAnswer) ||
            (question.type === "selection" && Array.isArray(qAns) && (question.correctAnswer as number[])?.length === qAns.length && qAns.every(v => (question.correctAnswer as number[])?.includes(v)))) ? (
            <CheckCircle2 className="w-5 h-5" />
            ) : (
            <XCircle className="w-5 h-5" />
            )}
          <span className="font-semibold">
            {question.type === "essay" ? "Needs Manual Grading" :
            ((question.type === "multiple-choice" || question.type === "true-false") && qAns === question.correctAnswer) ||
            (question.type === "selection" && Array.isArray(qAns) && (question.correctAnswer as number[])?.length === qAns.length && qAns.every(v => (question.correctAnswer as number[])?.includes(v)))
              ? "Correct Answer"
              : "Incorrect Answer"}
          </span>
          {question.type !== "essay" && (
            <span className="ml-auto text-sm font-medium">Earned {
              ((question.type === "multiple-choice" || question.type === "true-false") && qAns === question.correctAnswer) ||
              (question.type === "selection" && Array.isArray(qAns) && (question.correctAnswer as number[])?.length === qAns.length && qAns.every(v => (question.correctAnswer as number[])?.includes(v))) ? question.points : 0
            } out of {question.points}</span>
          )}
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
         {question.text}
      </h2>

      {/* Multiple Choice */}
      {question.type === "multiple-choice" && (
        <div className="space-y-3">
          {question.options?.map((opt: string, i: number) => {
            const isSelected = qAns === i;
            let optionClass = "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50";
            if (isSelected) optionClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
            
            if (showCorrection) {
              if (i === question.correctAnswer) {
                optionClass = "border-green-500 bg-green-50 ring-1 ring-green-500 text-green-900";
              } else if (isSelected) {
                optionClass = "border-red-500 bg-red-50 ring-1 ring-red-500 text-red-900";
              } else {
                optionClass = "border-gray-200 bg-gray-50 opacity-60";
              }
            }

            return (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${optionClass} flex items-center gap-4`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    showCorrection && i === question.correctAnswer ? "border-green-600" :
                    showCorrection && isSelected ? "border-red-600" :
                    isSelected ? "border-blue-600" : "border-gray-300"
                }`}>
                  {(isSelected || (showCorrection && i === question.correctAnswer)) && (
                    <div className={`w-3 h-3 rounded-full ${
                      showCorrection && i === question.correctAnswer ? "bg-green-600" :
                      showCorrection && isSelected ? "bg-red-600" :
                      "bg-blue-600"
                    }`} />
                  )}
                </div>
                <span className="text-lg">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* True / False */}
      {question.type === "true-false" && (
        <div className="flex gap-4">
          {["true", "false"].map((opt) => {
            const isSelected = qAns === opt;
            let optionClass = "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50";
            if (isSelected) optionClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
            
            if (showCorrection) {
              if (opt === question.correctAnswer) {
                optionClass = "border-green-500 bg-green-50 ring-1 ring-green-500 text-green-900";
              } else if (isSelected) {
                optionClass = "border-red-500 bg-red-50 ring-1 ring-red-500 text-red-900";
              } else {
                optionClass = "border-gray-200 bg-gray-50 opacity-60";
              }
            }

            return (
              <button
                key={opt}
                disabled={isSubmitted}
                onClick={() => handleAnswer(opt)}
                className={`flex-1 text-center py-5 rounded-xl border transition-all ${optionClass}`}
              >
                <span className="text-xl font-medium capitalize">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selection (Multiple Select) */}
      {question.type === "selection" && (
        <div className="space-y-3">
          {question.options?.map((opt: string, i: number) => {
            const isSelected = Array.isArray(qAns) && qAns.includes(i);
            const isCorrectAns = Array.isArray(question.correctAnswer) && (question.correctAnswer as number[]).includes(i);
            
            let optionClass = "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50";
            if (isSelected) optionClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
            
            if (showCorrection) {
              if (isCorrectAns) {
                optionClass = "border-green-500 bg-green-50 ring-1 ring-green-500 text-green-900";
              } else if (isSelected && !isCorrectAns) {
                optionClass = "border-red-500 bg-red-50 ring-1 ring-red-500 text-red-900";
              } else {
                optionClass = "border-gray-200 bg-gray-50 opacity-60";
              }
            }

            return (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => handleToggleSelection(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${optionClass} flex items-center gap-4`}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${
                    showCorrection && isCorrectAns ? "border-green-600 bg-green-600" :
                    showCorrection && isSelected ? "border-red-600 bg-red-600" :
                    isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                }`}>
                  {(isSelected || (showCorrection && isCorrectAns)) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-lg">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Essay */}
      {question.type === "essay" && (
        <div>
          <textarea
            disabled={isSubmitted}
            value={(qAns as string) || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          />
          {showCorrection && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-xl">
              <h4 className="font-semibold mb-2">Teacher's Note / Expected Answer Keyword:</h4>
              <p className="text-gray-700">{question.correctAnswer || "Awaiting manual grading."}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
