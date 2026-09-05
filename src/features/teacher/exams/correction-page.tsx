import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  PenLine,
} from "lucide-react";


import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

import { TeacherPageLayout } from "../components/teacher-page-layout";

import { fetchExamResults } from "./api/exams-api";

import { instructorTestsApi } from "@/features/teacher/test-results/api";





interface AnswerOption {

  id: number;

  option_en: string;

  option_ar: string;

  is_correct?: number | boolean;

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

  submitted_at?: string | null;


  questions?: SubmittedQuestion[];

}






function normalise(
  r: any
): StudentEntry {


  const studentObject =

    typeof r.student === "object" &&
    r.student !== null

      ? r.student

      : typeof r.user === "object" &&
        r.user !== null

      ? r.user

      : {};





  const studentId =

    studentObject.id ??

    studentObject.student_id ??

    studentObject.user_id ??

    r.student_id ??

    r.user_id ??

    0;





  const studentName =

    studentObject.name ??

    studentObject.full_name ??

    r.student_name ??

    r.user_name ??

    "—";





  const questions =

    Array.isArray(r.questions)

      ? r.questions

      : Array.isArray(r.test_questions)

      ? r.test_questions

      : [];





const uniqueQuestions =

  questions.map(
    (q:any,index:number)=>({

      ...q,

      id:
        q.id ??
        index + 1,

    })

  ) as SubmittedQuestion[];





  return {


    student: {

      id: Number(studentId),

      name: String(studentName),

    },



    student_mark:

      r.student_mark ??
      r.mark ??
      null,



    full_mark:

      Number(
        r.full_mark ??
        r.test?.full_mark ??
        0
      ),



    result:

      r.result ??
      null,



    student_attempt:

      Number(
        r.student_attempt ??
        r.attempt ??
        1
      ),



    submitted_at:

      r.submitted_at ??
      r.created_at ??
      null,



    questions:

      uniqueQuestions,


  };
  function QuestionCard({

  q,

  index,

}: {

  q: SubmittedQuestion;

  index: number;

}) {


  return (

    <div className="rounded-xl border bg-card overflow-hidden">


      <div
        className="
          bg-muted/40
          border-b
          px-5
          py-3.5
          flex
          items-start
          justify-between
          gap-4
        "
      >


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

            {
              q.question_ar ||
              q.question_en
            }

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

          <div
            className="
              bg-muted/30
              rounded-lg
              p-4
              border
              text-sm
            "
          >

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



  const queryClient =
    useQueryClient();




  const [selectedIdx,setSelectedIdx] =
    useState(0);



  const [mark,setMark] =
    useState("");



  const [savedMarks,setSavedMarks] =
    useState<Record<number,number>>({});




  const {

    data: raw = [],

    isLoading,

    isError,

    refetch,

  } = useQuery({


    queryKey:[

      "exam-grading",

      id

    ],


    queryFn:()=>fetchExamResults(id),


    enabled:!!id,


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



    const student_id =
      current.student.id;



    if (
      !student_id ||
      String(student_id) === "0"
    ) {

      throw new Error(
        "تعذر تحديد معرف الطالب"
      );

    }



    return instructorTestsApi.markStudent(

      id,

      student_id,

      mark

    );


  },



  onSuccess: () => {


    const student_id =
      entries[selectedIdx]
        .student
        .id;



    setSavedMarks(

      (prev)=>({

        ...prev,

        [student_id]:
          Number(mark),

      })

    );



    toast.success(
      "تم حفظ الدرجة بنجاح ✓"
    );



    setMark("");



    queryClient.invalidateQueries({

      queryKey:[

        "exam-grading",

        id

      ]

    });


  },



  onError:(error:any)=>{


    toast.error(

      error?.message ??

      "فشل حفظ الدرجة"

    );


  },


});





if (isLoading) {

  return (

    <Loader2
      className="
        animate-spin
        w-8
        h-8
      "
    />

  );

}




if (isError) {

  return (

    <Button
      onClick={()=>refetch()}
    >

      إعادة المحاولة

    </Button>

  );

}




if (!entries.length) {

  return (

    <div>

      لا توجد إجابات

    </div>

  );

}




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


      {/* Navigation */}

      <div className="flex items-center gap-3">


        <Button

          variant="outline"

          disabled={
            selectedIdx === 0
          }

          onClick={() => {

            setSelectedIdx(
              (p)=>
                Math.max(
                  0,
                  p - 1
                )
            );

            setMark("");

          }}

        >

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

              (p)=>

                Math.min(

                  entries.length - 1,

                  p + 1

                )

            );


            setMark("");

          }}

        >

          التالي

        </Button>


      </div>






      <div className="grid lg:grid-cols-3 gap-6">



        {/* Questions */}

        <div className="lg:col-span-2">


          <div className="rounded-xl border bg-card p-5 space-y-4">


            <div className="flex items-center gap-3">


              <User
                className="
                  w-5
                  h-5
                  text-primary
                "
              />


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
              current.questions &&
              current.questions.length > 0

              ?

              current.questions.map(
                (q,index)=>(

                  <QuestionCard

                    key={
                      `question-${index}-${q.id}`
                    }

                    q={q}

                    index={index}

                  />

                )

              )


              :

              (

                <div
                  className="
                    text-center
                    py-10
                    text-muted-foreground
                  "
                >

                  لا توجد تفاصيل الإجابات

                </div>

              )

            }



          </div>


        </div>






        {/* Mark */}

        <div>


          <div
            className="
              rounded-xl
              border
              bg-card
              p-5
              sticky
              top-5
            "
          >



            <div className="flex items-center gap-2 mb-5">


              <PenLine
                className="
                  w-5
                  h-5
                  text-primary
                "
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
                setMark(
                  e.target.value
                )
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


              onClick={()=>
                saveMark()
              }

            >

              {
                saving &&

                <Loader2
                  className="
                    w-4
                    h-4
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
