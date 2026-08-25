import { axiosInstance } from "@/shared/api/axios-instance";

export type InstructorStatistics = {
  active_subscriptions_count: number;
  unique_students_count: number;
  courses: any[];
  total_revenue: string | number;
};

export async function getInstructorStatistics(): Promise<InstructorStatistics> {
  const { data } = await axiosInstance.get("/instructor/subscription-statistics");
  return data.data;
}
