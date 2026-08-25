import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { APP_CONFIG } from "@/shared/config/constants";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { ApiErrorResponse } from "./types";


const axiosInstance: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});


// ─── Request Interceptor ───
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const { accessToken } = useAuthStore.getState();


    // Authorization token
    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }


    // ─── Language handling ───
    // Get current i18next language
    const currentLang =
      localStorage.getItem("i18nextLng") ||
      localStorage.getItem("edu-platform-lang") ||
      "ar";


    const lang =
      currentLang.startsWith("ar")
        ? "ar"
        : "en";


    // Send language as query param
    config.params = {
      ...(config.params || {}),
      lang,
    };


    // Also send language as header
    // (support both backend implementations)
    config.headers.lang = lang;


    return config;
  },

  (error) => Promise.reject(error),
);



// ─── Response Interceptor with Refresh Token Logic ───

let isRefreshing = false;


let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];



const processQueue = (
  error: unknown,
  token: string | null = null
) => {

  failedQueue.forEach((promise) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }

  });


  failedQueue = [];
};



axiosInstance.interceptors.response.use(

  (response) => response,


  async (
    error: AxiosError<ApiErrorResponse>
  ) => {


    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };



    // Handle 401 Unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {


      if (isRefreshing) {

        return new Promise(
          (resolve, reject) => {

            failedQueue.push({
              resolve,
              reject,
            });

          }
        )
        .then((token) => {

          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return axiosInstance(originalRequest);

        });

      }



      originalRequest._retry = true;
      isRefreshing = true;



      try {


        const {
          refreshToken,
        } = useAuthStore.getState();



        if (!refreshToken) {
          throw new Error(
            "No refresh token"
          );
        }



        const { data } = await axios.post(
          `${APP_CONFIG.api.baseUrl}/auth/refresh`,
          {
            refreshToken,
          },
        );



        const newAccessToken =
          data.accessToken;



        useAuthStore
          .getState()
          .setTokens(
            newAccessToken,
            data.refreshToken
          );



        processQueue(
          null,
          newAccessToken
        );



        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;



        return axiosInstance(
          originalRequest
        );



      } catch (refreshError) {


        processQueue(
          refreshError,
          null
        );


        useAuthStore
          .getState()
          .clearAuth();


        window.location.href =
          APP_CONFIG.auth.loginPath;



        return Promise.reject(
          refreshError
        );


      } finally {

        isRefreshing = false;

      }

    }



    return Promise.reject(error);

  },
);



export {
  axiosInstance
};