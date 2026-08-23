import { axiosInstance } from "@/shared/api/axios-instance";

export const studentApi = {
  register: async (payload: FormData) => {
    const { data } = await axiosInstance.post('/register', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  login: async (payload: { email: string; password: string; remember_me?: number }) => {
    const { data } = await axiosInstance.post('/login', payload);
    return data;
  },

  viewProfile: async () => {
    const { data } = await axiosInstance.get('/student/profile');
    return data;
  },

  updateProfile: async (payload: FormData) => {
    const { data } = await axiosInstance.post('/student/update-profile', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  changePassword: async (payload: FormData) => {
    const { data } = await axiosInstance.post('/student/change-password', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/student/logout');
    return data;
  },

  getGrades: async () => {
    const { data } = await axiosInstance.get('/register/get-grades');
    return data;
  },

  getGovernorates: async () => {
    const { data } = await axiosInstance.get('/register/get-governorates');
    return data;
  },
};
