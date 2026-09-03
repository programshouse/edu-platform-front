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



  getStudentResults: async (id: string) => {
    const { data } = await axiosInstance.get(`/tests/${id}/get-student-test-results`);
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


// Mark student test
// POST /student/{student_id}/tests/{test_id}/mark
// Body: multipart/form-data { mark }

markStudent: async (
  testId: string | number,
  studentId: string | number,
  mark: number | string
) => {

  const formData = new FormData();

  formData.append(
    "mark",
    String(mark)
  );

  const { data } = await axiosInstance.post(
    `/student/${studentId}/tests/${testId}/mark`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
},


  // GET /instructor/latest-subscribed-students
  getLatestSubscribedStudents: async () => {
    const { data } = await axiosInstance.get('/instructor/latest-subscribed-students');
    return data?.data ?? data ?? [];
  },


};
