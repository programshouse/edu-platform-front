import { axiosInstance } from "@/shared/api/axios-instance";

export type LoginPayload = {
  email: string;
  password: string;
  remember_me?: number;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
};

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await axiosInstance.post("/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k,v])=>form.append(k,v));
    const { data } = await axiosInstance.post("/register", form);
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post("/student/logout");
    return data;
  },

  profile: async () => {
    const { data } = await axiosInstance.get("/student/view-profile");
    return data;
  },

  updateProfile: async (payload: FormData) => {
    const { data } = await axiosInstance.post("/student/update-profile", payload);
    return data;
  },

  changePassword: async (payload: FormData) => {
    const { data } = await axiosInstance.post("/student/change-password", payload);
    return data;
  },

  grades: async () => {
    const { data } = await axiosInstance.get("/register/get-grades");
    return data;
  },

  governorates: async () => {
    const { data } = await axiosInstance.get("/register/get-governorates");
    return data;
  }
};
