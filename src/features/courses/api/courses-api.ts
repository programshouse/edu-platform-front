import { axiosInstance } from "@/shared/api/axios-instance";


export const coursesApi = {


  // Student/public courses
  all: async () => {

    const { data } = await axiosInstance.get(
      "/get-all-courses"
    );

    return data;

  },



  // Public courses
  getAllCourses: async () => {

    const { data } = await axiosInstance.get(
      "/get-all-courses"
    );

    return data;

  },



  // Student enrolled courses
  studentCourses: async () => {

    const { data } = await axiosInstance.get(
      "/student/get-courses"
    );

    return data;

  },



  // Instructor courses
  instructorCourses: async () => {

    const { data } = await axiosInstance.get(
      "/instructor/courses"
    );

    return data;

  },



  // Course details
  details: async (
    id: number | string
  ) => {

    const { data } = await axiosInstance.get(
      `/courses/${id}/details`
    );

    return data;

  },



  // Student subscribe to course
  subscribe: async (
    id: number | string
  ) => {

    const { data } = await axiosInstance.post(
      `/courses/${id}/subscribe-to-course`,
      {}
    );

    return data;

  },


};