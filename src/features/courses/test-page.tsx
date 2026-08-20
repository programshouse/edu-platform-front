import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestHeader } from "./components/test-header";
import { TestIntro } from "./components/test-intro";
import { TestResult } from "./components/test-result";
import { TestQuestion } from "./components/test-question";

// Mock data
const mockTest = {
  title: "HTML & CSS Practical Test",
  durationMinutes: 30,
  attemptsAllowed: 2,
  totalScore: 100,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
      ],
      correctAnswer: 0,
      points: 25,
    },
    {
      id: "q2",
      type: "true-false",
      text: "CSS stands for Cascading Style Sheets.",
      correctAnswer: "true",
      points: 25,
    },
    {
      id: "q3",
      type: "selection",
      text: "Which of the following are block-level elements? (Select all that apply)",
      options: ["<div>", "<span>", "<p>", "<a>"],
      correctAnswer: [0, 2], // <div> and <p>
      points: 25,
    },
    {
      id: "q4",
      type: "essay",
      text: "Explain the difference between flexbox and grid in CSS.",
      correctAnswer: null, // manual grading
      points: 25,
    },
  ],
};

export function TestPage() {
  const { courseId, lectureIndex } = useParams();
  const { t, i18n } = useTranslation("courses");
  const isRtl = i18n.language === "ar";

  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockTest.durationMinutes * 60);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | number[]>>({});
  const [calculatedScore, setCalculatedScore] = useState(0);

  const calculateScore = () => {
    let score = 0;
    mockTest.questions.forEach((q) => {
      const userAns = answers[q.id];
      if (q.type === "multiple-choice" || q.type === "true-false") {
        if (userAns === q.correctAnswer) score += q.points;
      } else if (q.type === "selection") {
        if (
          Array.isArray(userAns) &&
          Array.isArray(q.correctAnswer) &&
          userAns.length === q.correctAnswer.length &&
          userAns.every((val) => (q.correctAnswer as number[]).includes(val as number))
        ) {
          score += q.points;
        }
      }
      // Essay is not auto-graded here
    });
    setCalculatedScore(score);
  };

  const handleAutoSubmit = () => {
    alert(t("test.timeUp") as string);
    calculateScore();
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (hasStarted && !isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !isSubmitted) {
      handleAutoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, isSubmitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (val: number | string | number[]) => {
    const qId = mockTest.questions[currentQuestionIdx].id;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleToggleSelection = (optionIdx: number) => {
    const qId = mockTest.questions[currentQuestionIdx].id;
    const currentAns = (answers[qId] as number[]) || [];
    if (currentAns.includes(optionIdx)) {
      setAnswers((prev) => ({
        ...prev,
        [qId]: currentAns.filter((i: number) => i !== optionIdx),
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [qId]: [...currentAns, optionIdx],
      }));
    }
  };

  const handleSubmit = () => {
    if (confirm(t("test.submit") as string)) {
      calculateScore();
      setIsSubmitted(true);
    }
  };

  if (!hasStarted) {
    return (
      <TestIntro
        title={mockTest.title}
        durationMinutes={mockTest.durationMinutes}
        totalScore={mockTest.totalScore}
        attemptsAllowed={mockTest.attemptsAllowed}
        courseId={courseId}
        lectureIndex={lectureIndex}
        onStart={() => setHasStarted(true)}
      />
    );
  }

  if (isSubmitted && !showCorrection) {
    return (
      <TestResult
        score={calculatedScore}
        totalScore={mockTest.totalScore}
        courseId={courseId}
        lectureIndex={lectureIndex}
        onViewCorrection={() => setShowCorrection(true)}
      />
    );
  }

  const question = mockTest.questions[currentQuestionIdx];
  const qAns = answers[question.id];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TestHeader
        title={mockTest.title}
        currentQuestion={currentQuestionIdx + 1}
        totalQuestions={mockTest.questions.length}
        timeLeft={timeLeft}
        isSubmitted={isSubmitted}
        formatTime={formatTime}
      />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <TestQuestion
            question={question}
            qAns={qAns}
            showCorrection={showCorrection}
            isSubmitted={isSubmitted}
            handleAnswer={handleAnswer}
            handleToggleSelection={handleToggleSelection}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
              disabled={currentQuestionIdx === 0}
              className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium transition-colors ${
                currentQuestionIdx === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              {t("test.previous")}
            </button>

            {currentQuestionIdx < mockTest.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                className="flex items-center gap-2 py-3 px-6 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {t("test.next")}
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="py-3 px-8 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors border shadow-sm"
              >
                {t("test.submit")}
              </button>
            ) : (
                <Link
                  to={`/courses/${courseId}/lectures/${lectureIndex}`}
                  className="py-3 px-8 rounded-xl font-medium bg-gray-800 hover:bg-gray-900 text-white transition-colors"
                >
                  {t("test.backToCourse")}
                </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
