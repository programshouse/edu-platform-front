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
    try {
      const { data } = await axiosInstance.get(`/tests/${id}/get-student-test-results`);
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  // GET /get-pending-tests
  getPending: async () => {
    try {
      const { data } = await axiosInstance.get("/get-pending-tests");
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  // Filter pending tests by test id
  getPendingForTest: async (testId: string | number) => {
    try {
      const { data } = await axiosInstance.get("/get-pending-tests");
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      return list.filter((item: any) =>
        String(item.test?.id ?? item.test_id ?? "") === String(testId)
      );
    } catch {
      return [];
    }
  },

  /**
   * POST /students/{student_id}/tests/{test_id}/mark
   * Supports both questions array and single mark value
   */
 markStudent: async (
  test_id: string | number,
  student_id: string | number,
  mark: number | string
) => {

  if (
    !student_id ||
    String(student_id) === "undefined" ||
    String(student_id) === "0"
  ) {
    throw new Error("student_id is required");
  }

  if (
    mark === undefined ||
    mark === null ||
    mark === ""
  ) {
    throw new Error("mark is required");
  }


  const { data } = await axiosInstance.post(
    `/students/${student_id}/tests/${test_id}/mark`,
    {
      mark: Number(mark),
    }
  );


  return data;
},

  // GET /instructor/latest-subscribed-students
  getLatestSubscribedStudents: async () => {
    const { data } = await axiosInstance.get("/instructor/latest-subscribed-students");
    return data?.data ?? data ?? [];
  },
};