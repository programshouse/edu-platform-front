import { axiosInstance } from "@/shared/api/axios-instance";


// statistics
export async function getInstructorStatistics() {
  const {data} = await axiosInstance.get(
    "/instructor/subscription-statistics"
  );

  return data.data;
}


// latest subscriptions
export async function getLatestSubscriptions(){

 const {data}= await axiosInstance.get(
   "/instructor/latest-subscribed-students"
 );

 return data.data;

}


// latest students
export async function getLatestStudents(){

 const {data}= await axiosInstance.get(
   "/instructor/latest-joined-students"
 );

 return data.data;

}