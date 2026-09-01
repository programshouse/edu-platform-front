import { axiosInstance } from "@/shared/api/axios-instance";

export interface PlatformStatistics {
  students_count: string;
  courses_count: string;
  total_hours: string;
  success_rate: string;
}

export const platformApi = {
  statistics: async (): Promise<PlatformStatistics> => {
    const { data } = await axiosInstance.get("/platform/statistics");

    return data;
  },
};