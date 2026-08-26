import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import {
  createExam,
  updateExam,
} from "../api";

import type {
  ExamBuilderFormData,
} from "../types";



export function useSaveExam(
  examId?: string
) {


  const { t } =
    useTranslation("teacherExams");


  const queryClient =
    useQueryClient();


  const navigate =
    useNavigate();



  return useMutation({


    mutationFn:
      async (
        payload: ExamBuilderFormData
      ) => {


        if (examId) {


          return updateExam({

            id: examId,

            payload,

          });


        }


        return createExam(payload);


      },



    onSuccess:()=>{


      queryClient.invalidateQueries({

        queryKey:[
          "teacher",
          "exams"
        ],

      });



      if(examId){


        queryClient.invalidateQueries({

          queryKey:[
            "teacher",
            "exam",
            examId
          ],

        });


      }



      toast.success(

        examId

          ? t(
              "notifications.examUpdated"
            )

          : t(
              "notifications.examCreated"
            )

      );



      navigate(
        "/teacher/exams"
      );


    },



    onError:(error: Error)=>{


      toast.error(

        error.message ||

        t(
          "notifications.error"
        )

      );


    },


  });

}