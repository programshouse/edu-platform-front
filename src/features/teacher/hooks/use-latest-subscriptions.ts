import {useQuery} from "@tanstack/react-query";
import {getLatestSubscriptions} from "../api/instructor-dashboard-api";


export function useLatestSubscriptions(){

return useQuery({

queryKey:[
"teacher",
"latest-subscriptions"
],

queryFn:getLatestSubscriptions,

staleTime:1000*60*5

});

}