import {useQuery} from "@tanstack/react-query";
import {getInstructorTests} from "../api/exams-api";

export function useExams(){
  return useQuery({
    queryKey:["teacher","exams"],
    queryFn:getInstructorTests
  });
}
