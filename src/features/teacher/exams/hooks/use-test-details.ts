import { useQuery } from "@tanstack/react-query";
import { instructorTestsApi } from "@/features/teacher/test-results/api";


export function useTestDetails(
  id?: string | number
) {

  return useQuery({

    queryKey:[
      "test-details",
      id
    ],


    queryFn:()=> 
      instructorTestsApi.getTestDetails(
        id!
      ),


    enabled:
      !!id,

  });

}