import { axiosInstance } from "@/shared/api/axios-instance";


export const testsApi = {


  // GET /tests — list all student tests
  getStudentTests: async () => {

    const { data } = await axiosInstance.get("/get-tests");
    return data;

  },


  // GET /tests/:id/details — intro info + previous result (mark, result, questions)
  getTestDetails: async (id: number | string) => {

    const { data } = await axiosInstance.get(`/student/tests/${id}/details`);
    return data;

  },


  // GET /student/tests/:id — questions with options for taking the test
  getQuestions: async (id: number | string) => {

    const { data } = await axiosInstance.get(`/student/tests/${id}/details`);
    return data;

  },


  // POST /tests/:testId/test-questions/:questionId/answer-test-question
  answerQuestion: async (
    testId: number | string,
    questionId: number | string,
    questionOptionId: number | string
  ) => {

    const formData = new FormData();
    formData.append("question_option_id", String(questionOptionId));

    const { data } = await axiosInstance.post(
      `/tests/${testId}/test-questions/${questionId}/answer-test-question`,
      formData
    );

    return data;

  },


  // POST /tests/:id/submit-test
  submitTest: async (id: number | string) => {
    const { data } = await axiosInstance.post(`/tests/${id}/submit-test`);
    return data;

  },


  // GET /tests/:id/details — results after submission (mark, result, questions)
  showTestResults: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/tests/${id}`);
    return data;
  },


};
