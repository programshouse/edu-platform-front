import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { APP_CONFIG } from "@/shared/config/constants";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { ApiErrorResponse } from "./types";
import { getAppLanguage } from "@/shared/i18n/language";



export const axiosInstance: AxiosInstance = axios.create({

  baseURL: APP_CONFIG.api.baseUrl,

  timeout: APP_CONFIG.api.timeout,

  headers: {

    "Content-Type": "application/json",

    Accept: "application/json",

  },

});




// ==============================
// REQUEST INTERCEPTOR
// ==============================

axiosInstance.interceptors.request.use(

  (config: InternalAxiosRequestConfig) => {


    const {
      accessToken
    } = useAuthStore.getState();



    console.log(
      "API TOKEN:",
      accessToken
    );



    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;

    }




    const lang =
      getAppLanguage() || "ar";



    config.params = {

      ...(config.params || {}),

      lang,

    };



    config.headers.lang = lang;



    return config;


  },


  (error)=>{

    return Promise.reject(error);

  }

);






// ==============================
// RESPONSE INTERCEPTOR
// ==============================


let isRefreshing = false;



let failedQueue:Array<{

 resolve:(value:any)=>void;

 reject:(reason:any)=>void;

}> = [];




function processQueue(
 error:any,
 token:string|null=null
){

 failedQueue.forEach((item)=>{

   if(error){

     item.reject(error);

   }else{

     item.resolve(token);

   }

 });


 failedQueue=[];

}






axiosInstance.interceptors.response.use(


(response)=>response,



async(
 error:AxiosError<ApiErrorResponse>
)=>{


 const originalRequest =
 error.config as InternalAxiosRequestConfig & {
   _retry?:boolean;
 };





 // only refresh on 401
 if(
   error.response?.status === 401 &&
   !originalRequest._retry
 ){



   if(isRefreshing){


     return new Promise(
       (resolve,reject)=>{


         failedQueue.push({
           resolve,
           reject
         });


       }

     )
     .then((token)=>{


       originalRequest.headers.Authorization =
       `Bearer ${token}`;


       return axiosInstance(
         originalRequest
       );


     });


   }




   originalRequest._retry=true;

   isRefreshing=true;




   try{


     const {
       refreshToken
     } =
     useAuthStore.getState();




     if(!refreshToken){

       throw new Error(
        "No refresh token"
       );

     }




     const response =
     await axios.post(

       `${APP_CONFIG.api.baseUrl}/auth/refresh`,

       {
         refreshToken
       }

     );





     const newAccessToken =
     response.data.accessToken;



     const newRefreshToken =
     response.data.refreshToken;




     useAuthStore
     .getState()
     .setTokens(
       newAccessToken,
       newRefreshToken
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




   }catch(refreshError){



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



   }finally{


     isRefreshing=false;


   }


 }




 return Promise.reject(error);


}

);