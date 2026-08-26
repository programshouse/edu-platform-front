import { useQuery } from "@tanstack/react-query";

import {
  getInstructorStatistics,
} from "../api/instructor-dashboard-api";


export function useInstructorStatistics() {

  return useQuery({

    queryKey:[
      "teacher",
      "statistics"
    ],


    queryFn:
      getInstructorStatistics,


    staleTime:
      1000 * 60 * 5,

  });

}