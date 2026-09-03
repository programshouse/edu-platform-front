import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import { testsApi } from "@/features/profile/api/tests-api";
import { cn } from "@/shared/lib/utils";


// ─── Types ────────────────────────────────────────────────

interface Option {
  id: number;
  option_en: string;
  option_ar: string;
}


interface Question {
  id: number;
  question_en: string;
  question_ar: string;
  type: string;
  mark: number;
  options: Option[];
}


type Phase =
  | "intro"
  | "taking"
  | "submitting"
  | "results";


// ─── Helpers ──────────────────────────────────────────────

function ResultsView({
  testId,
  isAr,
}: {
  testId: string;
  isAr: boolean;
}) {

  const navigate = useNavigate();


  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "test-results",
      testId
    ],

    queryFn: () =>
      testsApi.showTestResults(testId),

  });



  if (isLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <Loader2
          className="
            animate-spin
            w-10
            h-10
            text-blue-600
          "
        />

      </div>
    );

  }



  if (isError || !data?.data) {

    return (

      <div
        className="
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          gap-4
        "
      >

        <p className="text-red-500">

          {
            isAr
              ? "فشل تحميل النتيجة"
              : "Failed to load results"
          }

        </p>



        <button

          onClick={() =>
            navigate("/profile")
          }

          className="
            px-6
            py-2.5
            bg-blue-600
            text-white
            rounded-xl
          "

        >

          {
            isAr
              ? "الملف الشخصي"
              : "Back to Profile"
          }

        </button>


      </div>

    );

  }



  const result = data.data;

  const passed =
    result.result === "passed";



  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        flex
        items-center
        justify-center
        p-4
      "
    >

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.95
        }}

        animate={{
          opacity: 1,
          scale: 1
        }}

        className="
          bg-white
          rounded-2xl
          shadow-xl
          w-full
          max-w-lg
          p-8
          text-center
        "

      >

        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            passed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600"
          )}
        >

          {
            passed

              ? <CheckCircle2 className="w-10 h-10" />

              : <XCircle className="w-10 h-10" />

          }

        </div>


        <h1 className="text-2xl font-bold text-gray-900 mb-1">

          {result.test_title}

        </h1>


        <p
          className={cn(
            "text-lg font-semibold mb-6",
            passed
              ? "text-emerald-600"
              : "text-red-500"
          )}
        >

          {
            passed
              ? (
                isAr
                  ? "ناجح ✓"
                  : "Passed ✓"
              )
              : (
                isAr
                  ? "راسب ✗"
                  : "Failed ✗"
              )
          }

        </p>


        <div
          className="
            text-4xl
            font-bold
            bg-gray-50
            py-6
            rounded-xl
            border
            mb-8
          "
        >

          {result.mark}

          <span className="text-gray-400 text-2xl">

            {" / "}
            {result.full_mark ?? "--"}

          </span>


        </div>

      </motion.div>

    </div>
  );
}
// ─── Main Page ────────────────────────────────────────────

export function StudentTestPage() {

  const { testId } = useParams<{ testId: string }>();

  const { i18n } = useTranslation();

  const isAr = i18n.language.startsWith("ar");


  const [phase, setPhase] = useState<Phase>("intro");

  const [currentIdx, setCurrentIdx] = useState(0);

  const [answers, setAnswers] = useState<Record<number, number>>({});

  const [submitResult, setSubmitResult] = useState<any>(null);



  // ── Fetch test details ──────────────────────────────────

  const {
    data: detailsData,
    isLoading: detailsLoading,
    isError: detailsError,
    error: detailsRawError,

  } = useQuery({

    queryKey: [
      "test-details",
      testId
    ],

    queryFn: () =>
      testsApi.getTestDetails(testId!),

    enabled: !!testId,

    retry: (_, err: any) =>
      err?.response?.status !== 403,

  });



  // ── Fetch questions ─────────────────────────────────────

  const {
    data: questionsData,
    isLoading: questionsLoading,

  } = useQuery({

    queryKey: [
      "test-questions",
      testId
    ],

    queryFn: () =>
      testsApi.getQuestions(testId!),

    enabled:
      !!testId &&
      phase === "taking",

  });



  // ── Answer mutation ─────────────────────────────────────

  const answerMutation = useMutation({

    mutationFn: ({
      questionId,
      optionId,

    }: {
      questionId: number;
      optionId: number;

    }) =>

      testsApi.answerQuestion(
        testId!,
        questionId,
        optionId
      ),

  });



  // ── Submit mutation (UPDATED) ───────────────────────────

  const submitMutation = useMutation({

    mutationFn: () =>
      testsApi.submitTest(testId!),



    onSuccess: (res) => {

      setSubmitResult(
        res?.data ?? res
      );


      toast.success(
        isAr
          ? "تم تسليم الاختبار بنجاح"
          : "Test submitted successfully"
      );


      setPhase("results");

    },



    onError: (error: any) => {

      const message =
        error?.response?.data?.message ||
        "";



      if (
        message ===
        "No active test attempt found."
      ) {

        toast.error(
          isAr
            ? "لا توجد محاولة اختبار نشطة"
            : "No active test attempt found"
        );


        setPhase("taking");


        return;

      }



      toast.error(
        isAr
          ? "حدث خطأ أثناء تسليم الاختبار"
          : "Failed to submit test"
      );


      setPhase("taking");

    },

  });



  // ── Derived ──────────────────────────────────────────────

  const details =
    detailsData?.data ?? detailsData;



  const questions: Question[] =
    Array.isArray(questionsData?.data)

      ? questionsData.data

      : Array.isArray(questionsData)

        ? questionsData

        : [];



  const currentQuestion =
    questions[currentIdx];



  const totalQuestions =
    questions.length;



  const allAnswered =
    questions.every(
      (q) =>
        answers[q.id] !== undefined
    );



  function selectOption(
    questionId: number,
    optionId: number
  ) {

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));


    answerMutation.mutate({
      questionId,
      optionId,
    });

  }
    // ── Loading ──────────────────────────────────────────────

  if (detailsLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />

      </div>
    );

  }



  if (detailsError || !testId) {

    const is403 =
      (detailsRawError as any)?.response?.status === 403;


    return (

      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5 p-4"
        dir={isAr ? "rtl" : "ltr"}
      >

        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center",
            is403
              ? "bg-amber-100 text-amber-500"
              : "bg-red-100 text-red-500"
          )}
        >

          {
            is403
              ? <ShieldAlert className="w-10 h-10" />
              : <XCircle className="w-10 h-10" />
          }

        </div>


        <div className="text-center">

          <h2 className="text-xl font-bold text-gray-900 mb-2">

            {
              is403
                ? (
                  isAr
                    ? "غير مصرح بالوصول"
                    : "Access Denied"
                )
                : (
                  isAr
                    ? "فشل تحميل الاختبار"
                    : "Failed to load test"
                )
            }

          </h2>


          <p className="text-gray-500 text-sm">

            {
              is403
                ? (
                  isAr
                    ? "يجب أن تكون مسجلاً في الكورس للوصول إلى هذا الاختبار"
                    : "You must be enrolled in the course to access this test"
                )
                : (
                  isAr
                    ? "حدث خطأ غير متوقع"
                    : "An unexpected error occurred"
                )
            }

          </p>

        </div>


        <Link
          to="/profile"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl"
        >

          {
            isAr
              ? "الملف الشخصي"
              : "Profile"
          }

        </Link>


      </div>

    );

  }



  if (phase === "results") {

    return (
      <ResultsView
        testId={testId}
        isAr={isAr}
      />
    );

  }



  if (phase === "intro") {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

        <motion.div

          initial={{
            opacity:0,
            scale:.95
          }}

          animate={{
            opacity:1,
            scale:1
          }}

          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"

        >

          <ClipboardList className="mx-auto mb-5 w-16 h-16 text-blue-600"/>


          <h1 className="text-2xl font-bold">

            {
              details?.title ??
              (isAr ? "الاختبار" : "Test")
            }

          </h1>


          <button

            onClick={() =>
              setPhase("taking")
            }

            className="
              mt-8
              w-full
              py-3.5
              bg-blue-600
              text-white
              rounded-xl
              font-semibold
            "

          >

            {
              isAr
                ? "ابدأ الاختبار"
                : "Start Test"
            }

          </button>


        </motion.div>

      </div>

    );

  }



  if (questionsLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="animate-spin w-10 h-10 text-blue-600"/>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">


      <main className="flex-1 py-8 px-4">

        <div className="max-w-3xl mx-auto">


          {currentQuestion && (

            <motion.div

              key={currentQuestion.id}

              className="
                bg-white
                rounded-2xl
                border
                p-6
                mb-6
              "

            >

              <h2 className="text-xl font-bold mb-6">

                {
                  isAr
                    ? currentQuestion.question_ar
                    : currentQuestion.question_en
                }

              </h2>



              <div className="space-y-3">

                {
                  currentQuestion.options.map((opt)=>{

                    const selected =
                      answers[currentQuestion.id] === opt.id;


                    return (

                      <button

                        key={opt.id}

                        onClick={() =>
                          selectOption(
                            currentQuestion.id,
                            opt.id
                          )
                        }

                        className={cn(
                          "w-full text-start p-4 rounded-xl border-2",
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        )}

                      >

                        {
                          isAr
                            ? opt.option_ar
                            : opt.option_en
                        }

                      </button>

                    );

                  })
                }

              </div>


            </motion.div>

          )}



          <div className="flex justify-end">


            <button

              onClick={() => {

                if (
                  confirm(
                    isAr
                      ? "هل تريد تسليم الاختبار؟"
                      : "Submit the test?"
                  )
                ) {

                  setPhase("submitting");

                  submitMutation.mutate();

                }

              }}


              disabled={
                submitMutation.isPending
              }


              className="
                px-6
                py-3
                rounded-xl
                bg-emerald-600
                text-white
                font-semibold
              "

            >

              {
                submitMutation.isPending && (

                  <Loader2
                    className="
                      inline
                      w-4
                      h-4
                      animate-spin
                      mr-2
                    "
                  />

                )
              }


              {
                isAr
                  ? "تسليم الاختبار"
                  : "Submit Test"
              }


            </button>


          </div>


        </div>

      </main>


    </div>

  );

}