import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
  User,
  AlertCircle,
  PenLine,
  BookOpen,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

import { TeacherPageLayout } from "../components/teacher-page-layout";

import { fetchExamResults } from "./api/exams-api";

import { instructorTestsApi } from "@/features/teacher/test-results/api";



interface AnswerOption {

  id: number;

  option_en: string;

  option_ar: string;

}



interface SubmittedQuestion {

  id: number;

  question_en: string;

  question_ar: string;

  mark: number;

  type: string;

  options?: AnswerOption[];

  student_answer_option_id?: number | null;

  student_answer_text?: string | null;

}



interface StudentEntry {

  student: {

    id: number;

    name: string;

  };


  student_mark: number | null;

  full_mark: number;

  result: string | null;

  student_attempt: number;

  submitted_at?: string;


  questions?: SubmittedQuestion[];

}
function normalise(r: any): StudentEntry {

  return {

    student: {

      id:
        r.student?.id ??
        r.student_id ??
        0,


      name:
        r.student?.name ??
        r.student_name ??
        "—",

    },


    student_mark:

      r.student_mark ??
      r.mark ??
      null,



    full_mark:

      r.full_mark ??
      0,



    result:

      r.result ??
      null,



    student_attempt:

      r.student_attempt ??
      1,



    submitted_at:

      r.submitted_at ??
      null,



    questions:

      Array.isArray(r.questions)

        ? r.questions

        : [],

  };

}





function QuestionCard({

  q,

  index,

}: {

  q: SubmittedQuestion;

  index: number;

}) {


  return (

    <div className="rounded-xl border bg-card overflow-hidden">


      <div className="bg-muted/40 border-b px-5 py-3.5 flex items-start justify-between gap-4">


        <div className="flex items-start gap-3">


          <span
            className="
            shrink-0
            w-6
            h-6
            rounded-full
            bg-primary/10
            text-primary
            text-xs
            font-bold
            flex
            items-center
            justify-center
            "
          >

            {index + 1}

          </span>



          <p className="font-medium text-sm leading-relaxed">

            {q.question_ar || q.question_en}

          </p>


        </div>



        <Badge className="shrink-0">

          {q.mark} درجة

        </Badge>



      </div>




      <div className="px-5 py-4">


        {
          q.type === "essay"

            ?

            <div className="
              bg-muted/30
              rounded-lg
              p-4
              text-sm
              border
            ">

              {
                q.student_answer_text ||
                "لا توجد إجابة"
              }


            </div>


            :

            <div className="text-sm text-muted-foreground">

              {
                q.student_answer_text ||
                "تم اختيار الإجابة"
              }

            </div>

        }


      </div>



    </div>

  );

}
export function ExamCorrectionPage() {


  const { id = "" } = useParams();


  const queryClient = useQueryClient();



  const [selectedIdx, setSelectedIdx] = useState(0);


  const [mark, setMark] = useState("");


  const [savedMarks, setSavedMarks] =
    useState<Record<number, number>>({});




  const {
    data: raw = [],
    isLoading,
    isError,
    refetch,

  } = useQuery({

    queryKey: [
      "exam-grading",
      id
    ],


    queryFn: () =>
      fetchExamResults(id),


    enabled:
      !!id,

  });




  const entries: StudentEntry[] =
    (raw as any[])
      .map(normalise);





  const {
    mutate: saveMark,
    isPending: saving,

  } = useMutation({



    mutationFn: () => {


      const current =
        entries[selectedIdx];



      const studentId =
        current.student.id;



      if (!studentId) {

        throw new Error(
          "Student ID missing"
        );

      }




      const questions =

        current.questions?.map(
          (q) => ({

            test_question_id:
              q.id,


            mark:
              Number(mark),

          })

        ) ?? [];




      if (!questions.length) {

        throw new Error(
          "Questions missing"
        );

      }




      return instructorTestsApi.markStudent(

        id,

        studentId,

        questions

      );

    },





    onSuccess: () => {


      const studentId =
        entries[selectedIdx]
          .student
          .id;



      setSavedMarks(
        (prev) => ({

          ...prev,

          [studentId]:
            Number(mark),

        })
      );



      toast.success(
        "تم حفظ الدرجة بنجاح ✓"
      );



      setMark("");



      queryClient.invalidateQueries({

        queryKey: [
          "exam-grading",
          id
        ]

      });


    },




    onError: (error: any) => {


      toast.error(

        error?.message ??
        "فشل حفظ الدرجة"

      );


    },


  });




  if (isLoading)

    return (

      <Loader2
        className="
        animate-spin
        w-8
        h-8
        "
      />

    );




  if (isError)

    return (

      <Button
        onClick={() => refetch()}
      >

        إعادة المحاولة

      </Button>

    );




  if (!entries.length)

    return (

      <div>
        لا توجد إجابات
      </div>

    );



  const current =
    entries[selectedIdx];



  const displayMark =
    savedMarks[current.student.id]
    ??
    current.student_mark;
      return (

    <TeacherPageLayout>


      <div
        className="p-6 space-y-6"
        dir="rtl"
      >



        {/* Students navigation */}

        <div className="flex items-center gap-3">


          <Button

            variant="outline"

            disabled={
              selectedIdx === 0
            }

            onClick={() => {

              setSelectedIdx(
                (p) => Math.max(0, p - 1)
              );

              setMark("");

            }}

          >

            <ChevronRight className="w-4 h-4" />

            السابق

          </Button>




          <span className="text-sm">

            {selectedIdx + 1}
            /
            {entries.length}

          </span>




          <Button

            variant="outline"

            disabled={
              selectedIdx === entries.length - 1
            }


            onClick={() => {

              setSelectedIdx(
                (p) =>
                  Math.min(
                    entries.length - 1,
                    p + 1
                  )
              );

              setMark("");

            }}

          >

            التالي

            <ChevronLeft className="w-4 h-4" />

          </Button>


        </div>





        <div className="grid lg:grid-cols-3 gap-6">



          {/* Questions */}

          <div className="lg:col-span-2 space-y-4">


            <div className="rounded-xl border bg-card p-5">


              <div className="flex items-center gap-3 mb-4">


                <User className="w-5 h-5 text-primary" />


                <div>

                  <p className="font-semibold">

                    {current.student.name}

                  </p>


                  <p className="text-sm text-muted-foreground">

                    المحاولة #
                    {current.student_attempt}

                  </p>


                </div>


              </div>





              {
                current.questions?.length

                  ?

                  current.questions.map(
                    (q, index) => (

                      <QuestionCard

                        key={q.id}

                        q={q}

                        index={index}

                      />

                    )

                  )


                  :

                  (

                    <div className="
                      text-center
                      py-10
                      text-muted-foreground
                    ">

                      لا توجد تفاصيل الإجابات

                    </div>

                  )

              }


            </div>


          </div>





          {/* Grade */}

          <div>


            <div className="
              rounded-xl
              border
              bg-card
              p-5
              sticky
              top-5
            ">


              <div className="
                flex
                items-center
                gap-2
                mb-5
              ">

                <PenLine
                  className="w-5 h-5 text-primary"
                />

                <h2 className="font-semibold">

                  التقييم

                </h2>


              </div>





              {
                displayMark !== null &&
                displayMark !== undefined &&

                (

                  <Badge className="mb-4">

                    الدرجة الحالية:
                    {" "}
                    {displayMark}

                  </Badge>

                )

              }





              <input

                type="number"

                value={mark}

                onChange={(e)=>
                  setMark(e.target.value)
                }


                className="
                  w-full
                  rounded-lg
                  border
                  p-3
                  text-center
                  text-xl
                  font-bold
                "


                placeholder="أدخل الدرجة"

              />





              <Button

                className="w-full mt-4"


                disabled={
                  saving ||
                  !mark
                }


                onClick={() =>
                  saveMark()
                }

              >


                {
                  saving &&

                  <Loader2
                    className="
                      w-4 h-4
                      animate-spin
                      me-2
                    "
                  />

                }


                حفظ الدرجة


              </Button>



            </div>


          </div>



        </div>



      </div>


    </TeacherPageLayout>

  );


}