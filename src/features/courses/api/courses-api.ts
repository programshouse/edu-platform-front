import { axiosInstance } from "@/shared/api/axios-instance";





export const coursesApi = {


  // Student/public courses
  all: async () => {
    const { data } = await axiosInstance.get("/get-all-courses");
    return data;
  },



  // Public/available courses for students
  getAllCourses: async () => {

    const { data } =
      await axiosInstance.get(
        "/get-all-courses",
      );


    return data;

  },



  // Courses purchased/subscribed by current student
  studentCourses: async () => {

    const { data } =
      await axiosInstance.get(
        "/student/get-courses",
      );


    return data;

  },



  // Course details
  details: async (
    id: number | string
  ) => {

    const { data } =
      await axiosInstance.get(
        `/courses/${id}/details`,
      );


    return data;

  },



  subscribe: async (
    id: number | string
  ) => {

    const { data } =
      await axiosInstance.post(
        `/courses/${id}/subscribe-to-course`,
        {},
      );


    return data;

  },


};