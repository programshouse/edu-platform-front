import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Loader2,
  PlayCircle
} from "lucide-react";

import { coursesApi } from "@/features/courses/api/courses-api";
export default function StudentCoursePage(){
const {
 courseId
}=useParams();



const {
 data,
 isLoading
}=useQuery({

 queryKey:[
  "student-course",
  courseId
 ],


 queryFn:()=>coursesApi.details(
  courseId as string
 ),


 enabled:
 !!courseId

});





if(isLoading){

return (

<div className="
min-h-screen
flex
items-center
justify-center
">

<Loader2
className="
w-8
h-8
animate-spin
text-blue-600
"
/>

</div>

)

}





const course =
data?.data ?? data;



return (

<div className="
min-h-screen
bg-gray-50
py-10
">


<div className="
container
mx-auto
px-4
">


<div className="
bg-white
rounded-3xl
p-8
mb-8
border
">


<h1 className="
text-3xl
font-bold
text-gray-900
">

{course?.title}

</h1>


<p className="
text-gray-500
mt-3
">

{course?.description}

</p>


</div>
<h2 className="
text-xl
font-bold
mb-5
flex
items-center
gap-2
">

<BookOpen
className="text-blue-600"
/>

المحاضرات

</h2>
<div className="
grid
md:grid-cols-3
gap-5
">
{
course?.lectures?.map(
(lecture:any)=>(
<Link

key={lecture.id}

to={`/courses/${courseId}/lectures/${lecture.id}`}


className="
bg-white
rounded-2xl
border
p-5
hover:shadow-md
transition
"


>


<div className="
w-12
h-12
rounded-xl
bg-blue-50
flex
items-center
justify-center
mb-4
">
<PlayCircle
className="
text-blue-600
"
/>
</div>
<h3 className="
font-semibold
text-gray-900
">

{lecture.title}

</h3>



<p className="
text-sm
text-gray-400
mt-2
">

المحاضرة {lecture.id}

</p>



</Link>


)

)

}


</div>



</div>


</div>

)

}