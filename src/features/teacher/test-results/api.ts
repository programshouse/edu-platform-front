import { axiosInstance } from '@/shared/api';


export const instructorTestsApi = {


  // GET /instructor/tests — list instructor's own tests
  getTests: async () => {
    const { data } = await axiosInstance.get('/instructor/tests');
    return data?.data ?? data ?? [];
  },


  // GET /tests/:id/show-test-details — test info for instructor
  getTestDetails: async (id: string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/show-test-details`);
    return data?.data ?? data;
  },


  // GET /tests/:id/show-all-students-test-results — all student results for a test
  getStudentResults: async (id: string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/show-all-students-test-results`);
    return data?.data ?? [];
  },


  // GET /get-pending-tests — pending (ungraded) submissions across all tests
  getPending: async () => {
    const { data } = await axiosInstance.get('/get-pending-tests');
    return data?.data ?? [];
  },


  // GET /get-pending-tests filtered by testId (client-side filter since no per-test endpoint)
  getPendingForTest: async (testId: string) => {
    const { data } = await axiosInstance.get('/get-pending-tests');
    const all: any[] = data?.data ?? [];
    return all.filter((item: any) => String(item.test?.id) === String(testId));
  },


  // POST /tests/:testId/mark-student-test  body: { student_id, mark }
  markStudent: async (
    testId: string | number,
    studentId: string | number,
    mark: number | string
  ) => {
    const fd = new FormData();
    fd.append('student_id', String(studentId));
    fd.append('mark',       String(mark));
    const { data } = await axiosInstance.post(
      `/tests/${testId}/mark-student-test`,
      fd
    );
    return data;
  },


  // GET /instructor/latest-subscribed-students
  getLatestSubscribedStudents: async () => {
    const { data } = await axiosInstance.get('/instructor/latest-subscribed-students');
    return data?.data ?? data ?? [];
  },


};
