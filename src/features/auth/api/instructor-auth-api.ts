import { axiosInstance } from "@/shared/api/axios-instance";

export const instructorAuthApi = {
  login: async (payload: {email:string; password:string}) => {
    const {data}=await axiosInstance.post("/instructor-login", payload);
    return data;
  },
  register: async (payload: FormData) => {
    const {data}=await axiosInstance.post("/instructor-register", payload,{headers:{"Content-Type":"multipart/form-data"}});
    return data;
  },
  profile: async () => {
    const {data}=await axiosInstance.get("/instructor/profile");
    return data;
  },
  logout: async () => {
    const {data}=await axiosInstance.post("/instructor/logout");
    return data;
  }
};
