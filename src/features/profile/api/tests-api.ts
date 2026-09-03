import { axiosInstance } from "@/shared/api/axios-instance";


export const testsApi = {


  // GET /get-tests — student tests list (id, lecture_title, course_title, student_result, student_mark, student_attempts)
  getStudentTests: async () => {
    const { data } = await axiosInstance.get("/get-tests");
    return data;
  },


  // GET /tests/:id/details — test details + questions for intro screen
  getTestDetails: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/details`);
    return data;
  },


  // GET /tests/:id/questions — questions with options for taking the test
  getQuestions: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/questions`);
    return data;
  },


  // POST /tests/:id/answer-test-question  body: { question_id, question_option_id }
  answerQuestion: async (
    testId: number | string,
    questionId: number | string,
    questionOptionId: number | string
  ) => {
    const formData = new FormData();
    formData.append("question_id",        String(questionId));
    formData.append("question_option_id", String(questionOptionId));
    const { data } = await axiosInstance.post(
      `/tests/${testId}/answer-test-question`,
      formData
    );
    return data;
  },


  // POST /tests/:id/submit-test
  submitTest: async (id: number | string) => {
    const { data } = await axiosInstance.post(`/tests/${id}/submit-test`);
    return data;
  },


  // GET /tests/:id/details — show results after submission
  showTestResults: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/details`);
    return data;
  },


};
