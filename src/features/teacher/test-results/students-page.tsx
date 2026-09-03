
import { useQuery } from "@tanstack/react-query";
import { instructorTestsApi } from "./api";

export default function InstructorLatestStudentsPage(){
 const {data=[]}=useQuery({queryKey:["latest-subscribed-students"],queryFn:instructorTestsApi.getLatestSubscribedStudents});
 return <div className="p-8 space-y-6">
  <h1 className="text-3xl font-bold">Latest Subscribed Students</h1>
  <div className="grid md:grid-cols-3 gap-5">
   {data.map((x:any,i:number)=><div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
    <h2 className="font-bold">{x.student?.name || x.student || "Student"}</h2>
    <p>Course: {x.course?.title || "-"}</p>
    <p className="text-sm text-gray-500">{x.subscribed_at}</p>
   </div>)}
  </div>
 </div>
}
