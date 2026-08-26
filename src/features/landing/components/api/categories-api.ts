import { axiosInstance } from "@/shared/api/axios-instance";


export type Category = {
  id: number;
  name: string;
  image: string | null;
};



export async function getCategories(): Promise<Category[]> {

  const { data } =
    await axiosInstance.get(
      "/all-categories"
    );


  return data?.data ?? [];

}