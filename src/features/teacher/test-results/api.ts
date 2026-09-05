import { axiosInstance } from "@/shared/api";

export type MarkQuestionPayload = {
  test_question_id: number | string;
  mark: number | string;
};

export const instructorTestsApi = {
  // GET /instructor/tests
  getTests: async () => {
    const { data } = await axiosInstance.get("/instructor/tests");
    return data?.data ?? data ?? [];
  },

  showTest: async (id: string | number) => {
    try {
      const { data } = await axiosInstance.get(`/tests/${id}/show-test-details`);
      if (data) return data?.data ?? data;
    } catch {}

    try {
      const { data } = await axiosInstance.get(`/tests/${id}`);
      if (data) return data?.data ?? data;
    } catch {}

    try {
      const { data } = await axiosInstance.get(`/tests/${id}/details`);
      if (data) return data?.data ?? data;
    } catch {}

    const { data } = await axiosInstance.get("/instructor/tests");
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const found = list.find((item: any) => String(item.id) === String(id));
    if (found) return found;
    throw new Error(`Test ${id} not found`);
  },

  getTestDetails: async (id: string | number) => {
    try {
      const { data } = await axiosInstance.get(`/tests/${id}/show-test-details`);
      if (data) return data?.data ?? data;
    } catch {}

    try {
      const { data } = await axiosInstance.get(`/tests/${id}`);
      if (data) return data?.data ?? data;
    } catch {}

    try {
      const { data } = await axiosInstance.get(`/tests/${id}/details`);
      if (data) return data?.data ?? data;
    } catch {}

    const { data } = await axiosInstance.get("/instructor/tests");
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const found = list.find((item: any) => String(item.id) === String(id));
    if (found) return found;
    throw new Error(`Test ${id} not found`);
  },

  // GET /tests/{id}/get-student-test-results
  getStudentResults: async (id: string | number) => {
    const { data } = await axiosInstance.get(`/tests/${id}/get-student-test-results`);
    return data?.data ?? [];
  },

  // GET /get-pending-tests
  getPending: async () => {
    const { data } = await axiosInstance.get("/get-pending-tests");
    return data?.data ?? [];
  },

  // Filter pending tests by test id
  getPendingForTest: async (testId: string | number) => {
    const { data } = await axiosInstance.get("/get-pending-tests");
    const list = data?.data ?? [];
    return list.filter((item: any) => String(item.test?.id) === String(testId));
  },

  /**
   * POST /students/{student_id}/tests/{test_id}/mark
   * Supports both questions array and single mark value
   */
  markStudent: async (
    testId: string | number,
    studentId: string | number,
    markOrQuestions: MarkQuestionPayload[] | number | string
  ) => {
    if (!studentId) {
      throw new Error("Student ID is required");
    }

    if (Array.isArray(markOrQuestions)) {
      if (markOrQuestions.length === 0) {
        throw new Error("Questions are required");
      }

      const payload = {
        questions: markOrQuestions.map((q) => ({
          test_question_id: Number(q.test_question_id),
          mark: Number(q.mark),
        })),
      };

      const { data } = await axiosInstance.post(
        `/students/${studentId}/tests/${testId}/mark`,
        payload
      );
      return data;
    } else {
      const formData = new FormData();
      formData.append("mark", String(markOrQuestions));
      const { data } = await axiosInstance.post(
        `/students/${studentId}/tests/${testId}/mark`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    }
  },

  // GET /instructor/latest-subscribed-students
  getLatestSubscribedStudents: async () => {
    const { data } = await axiosInstance.get("/instructor/latest-subscribed-students");
    return data?.data ?? data ?? [];
  },
};