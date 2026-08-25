import { axiosInstance, parseApiError } from "@/shared/api";

export interface Category {
  id: number;
  name: string;
  image?: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await axiosInstance.get("/all-categories");
    return data?.data ?? [];
  } catch (err) {
    throw parseApiError(err);
  }
}
