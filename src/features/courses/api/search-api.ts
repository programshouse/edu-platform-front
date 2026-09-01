import { axiosInstance } from "@/shared/api/axios-instance";


export const searchApi = {

  search: async (search: string) => {

    const { data } =
      await axiosInstance.get(
        "/search",
        {
          params: {
            search: search
          }
        }
      );


    return data;

  }

};