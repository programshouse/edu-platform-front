import { axiosInstance } from "@/shared/api/axios-instance";


const getLanguage = () => {

  const lang =
    localStorage.getItem("i18nextLng") || "ar";

  return lang.startsWith("ar")
    ? "ar"
    : "en";

};



export const coursesApi = {


  // Instructor courses
  all: async () => {

    const { data } =
      await axiosInstance.get(
        "/instructor/courses",
        {
          headers:{
            lang: getLanguage(),
          },
        }
      );


    return data;

  },



  // Public/available courses for students
  getAllCourses: async () => {

    const { data } =
      await axiosInstance.get(
        "/get-all-courses",
        {
          headers:{
            lang: getLanguage(),
          },
        }
      );


    return data;

  },



  // Courses purchased/subscribed by current student
  studentCourses: async () => {

    const { data } =
      await axiosInstance.get(
        "/student/get-courses",
        {
          headers:{
            lang: getLanguage(),
          },
        }
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
        {
          headers:{
            lang: getLanguage(),
          },
        }
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
        {
          headers:{
            lang: getLanguage(),
          },
        }
      );


    return data;

  },


};