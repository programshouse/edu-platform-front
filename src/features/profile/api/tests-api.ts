import { axiosInstance } from "@/shared/api/axios-instance";


export const testsApi = {


  getStudentTests: async () => {

    const { data } =
      await axiosInstance.get(
        "/get-tests"
      );

    return data;

  },



  getTestDetails: async (
    id:number|string
  ) => {

    const { data } =
      await axiosInstance.get(
        `/test-details/${id}`
      );

    return data;

  },



  getQuestions: async (
    id:number|string
  ) => {

    const { data } =
      await axiosInstance.get(
        `/test-questions/${id}`
      );

    return data;

  },



  submitTest: async(
    payload:any
  )=>{

    const {data} =
      await axiosInstance.post(
        "/submit-test",
        payload
      );


    return data;

  }


};