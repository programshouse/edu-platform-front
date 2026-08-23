import { axiosInstance } from "@/shared/api/axios-instance";

export const coursesApi = {
  // Public/available courses for students
  all: async () => {
    const { data } = await axiosInstance.get("/get-all-courses");
    return data;
  },

  // Courses purchased/subscribed by current student
  studentCourses: async () => {
    const { data } = await axiosInstance.get("/student/get-courses");
    return data;
  },

  details: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/courses/${id}/details`);
    return data;
  },

  subscribe: async (id: number | string) => {
    const { data } = await axiosInstance.post(`/courses/${id}/subscribe-to-course`);
    return data;
  },
};
