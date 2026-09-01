import { axiosInstance } from "@/shared/api/axios-instance";


export const studentApi = {


  // ==========================
  // AUTH
  // ==========================

  register: async (payload: FormData) => {

    const { data } = await axiosInstance.post(
      "/register",
      payload,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return data;
  },


  login: async (
    payload:{
      email:string;
      password:string;
      remember_me?:number;
    }
  ) => {

    const {data}=await axiosInstance.post(
      "/login",
      payload
    );

    return data;
  },


  logout: async()=>{

    const {data}=await axiosInstance.post(
      "/student/logout"
    );

    return data;

  },



  // ==========================
  // PROFILE
  // ==========================


  viewProfile: async()=>{

    const {data}=await axiosInstance.get(
      "/student/profile"
    );

    return data;

  },


  updateProfile: async(
    payload:FormData
  )=>{

    const {data}=await axiosInstance.post(
      "/student/update-profile",
      payload,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return data;

  },


  changePassword: async(
    payload:FormData
  )=>{

    const {data}=await axiosInstance.post(
      "/student/change-password",
      payload,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return data;

  },



  // ==========================
  // COURSES
  // ==========================


  getCourses: async()=>{

    const {data}=await axiosInstance.get(
      "/student/get-courses"
    );

    return data;

  },


  courseDetails: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/student/course/${id}`
    );

    return data;

  },


  subscribeCourse: async(
    payload:{
      course_id:number|string;
    }
  )=>{

    const {data}=await axiosInstance.post(
      "/student/subscribe-course",
      payload
    );

    return data;

  },


  updateCourseProgress: async(
    payload:any
  )=>{

    const {data}=await axiosInstance.post(
      "/student/update-course-progress",
      payload
    );

    return data;

  },




  // ==========================
  // LECTURES
  // ==========================


  lectureDetails: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/lectures/${id}/details`
    );

    return data;

  },


  showLectureVideo: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/lectures/${id}/video`
    );

    return data;

  },


  completeLecture: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.post(
      `/lectures/${id}/complete`
    );

    return data;

  },





  // ==========================
  // TESTS
  // ==========================


  getTests: async()=>{

    const {data}=await axiosInstance.get(
      "/student/tests"
    );

    return data;

  },


  testDetails: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/tests/${id}/details`
    );

    return data;

  },


  testQuestions: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/tests/${id}/questions`
    );

    return data;

  },


  answerTestQuestions: async(
    payload:any
  )=>{

    const {data}=await axiosInstance.post(
      "/answer-test-questions",
      payload
    );

    return data;

  },


  submitTest: async(
    payload:any
  )=>{

    const {data}=await axiosInstance.post(
      "/submit-test",
      payload
    );

    return data;

  },


  showTestResults: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/tests/${id}/results`
    );

    return data;

  },






  // ==========================
  // HOMEWORKS
  // ==========================


  getHomeworks: async()=>{

    const {data}=await axiosInstance.get(
      "/student/homeworks"
    );

    return data;

  },


  homeworkDetails: async(
    id:number|string
  )=>{

    const {data}=await axiosInstance.get(
      `/homeworks/${id}/details`
    );

    return data;

  },


  sendHomework: async(
    id:number|string,
    payload:FormData
  )=>{

    const {data}=await axiosInstance.post(
      `/homeworks/${id}/send-homework`,
      payload,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return data;

  },





  // ==========================
  // REGISTER DATA
  // ==========================


  getGrades: async()=>{

    const {data}=await axiosInstance.get(
      "/register/get-grades"
    );

    return data;

  },


  getGovernorates: async()=>{

    const {data}=await axiosInstance.get(
      "/register/get-governorates"
    );

    return data;

  },










};