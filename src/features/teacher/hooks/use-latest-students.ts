import {useQuery} from "@tanstack/react-query";
import {getLatestStudents} from "../api/instructor-dashboard-api";


export function useLatestStudents(){

return useQuery({

queryKey:[
"teacher",
"latest-students"
],

queryFn:getLatestStudents,

staleTime:1000*60*5

});

}