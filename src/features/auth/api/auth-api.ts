import { axiosInstance } from "@/shared/api/axios-instance";
import { useAuthStore } from "@/shared/stores/auth-store";

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
  parent_phone?: string;
  dob?: string;
  governorate_id?: string;
  address?: string;
  grade_id?: string;
  school?: string;
  department_name?: string;
  first_name?: string;
  second_name?: string;
  last_name?: string;
  date_of_birth?: string;
  governorate?: string;
  grade?: string;
  section?: string;
};

export type AuthResponse = {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  refreshToken?: string;
  data?: any;
  user?: any;
  message?: string;
  [key: string]: any;
};

export const authApi = {
  login: async (
    payload: LoginPayload
  ): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post(
      "/login",
      payload
    );

    return data;
  },


  register: async (
    payload: FormData | RegisterPayload
  ): Promise<AuthResponse> => {
    let body = payload;

    if (!(payload instanceof FormData)) {
      const form = new FormData();

      Object.entries(payload).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null
          ) {
            form.append(
              key,
              String(value)
            );
          }
        }
      );

      body = form;
    }

    const { data } =
      await axiosInstance.post(
        "/register",
        body,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  },


  /**
   * Refresh access token
   * used by axios interceptor
   */
  refresh: async (
    refresh_token: string
  ): Promise<AuthResponse> => {
    const { data } =
      await axiosInstance.post(
        "/auth/refresh",
        {
          refresh_token,
        }
      );

    return data;
  },


  /**
   * Universal logout
   * works for student/instructor
   */
  logout: async () => {

    const { user } = useAuthStore.getState();

    const endpoint =
      user?.role === "instructor"
        ? "/instructor/logout"
        : "/student/logout";


    const { data } =
      await axiosInstance.post(
        endpoint
      );

    return data;
  },


  /**
   * Current logged user profile
   */
  profile: async () => {
    const { user } = useAuthStore.getState();

    const endpoint =
      user?.role === "instructor"
        ? "/instructor/profile"
        : "/student/profile";


    const { data } =
      await axiosInstance.get(
        endpoint
      );

    return data;
  },


  updateProfile: async (
    payload: FormData
  ) => {

    const { data } =
      await axiosInstance.post(
        "/update-profile",
        payload,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  },


  changePassword: async (
    payload: FormData
  ) => {

    const { data } =
      await axiosInstance.post(
        "/change-password",
        payload,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  },


  grades: async () => {
    const { data } =
      await axiosInstance.get(
        "/register/get-grades"
      );

    return data;
  },


  governorates: async () => {
    const { data } =
      await axiosInstance.get(
        "/register/get-governorates"
      );

    return data;
  },
};