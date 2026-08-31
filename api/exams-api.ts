import { axiosInstance } from "@/shared/api";

export async function getInstructorTests(){
  const {data}=await axiosInstance.get("/instructor/tests");
  return data.data;
}

export async function getTestDetails(id:string|number){
  const {data}=await axiosInstance.get(`/tests/${id}`);
  return data.data;
}

export async function getTestResults(id:string|number){
  const {data}=await axiosInstance.get(`/tests/${id}/results`);
  return data.data;
}

export async function correctTest(id:string|number,payload:any){
  const {data}=await axiosInstance.post(`/tests/${id}/correct`,payload);
  return data;
}
