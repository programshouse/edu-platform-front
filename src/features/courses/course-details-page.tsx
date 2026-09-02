import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  FileText,
  ClipboardCheck,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { Footer } from "@/features/landing/components/footer";
import { coursesApi } from "./api/courses-api";


interface Course {

  id:number;

  title:string;

  description:string;

  image:string|null;

  price:number;

  level:string;

  duration:string;

  total_duration_minutes:number;

  students_count:number;

  start_date:string;

  end_date?:string;

  lectures:any[];

  homework_titles:string[];

  test_titles:string[];

  progress?:number;

}




export function CourseDetailsPage(){

const {id}=useParams();


const [course,setCourse]=useState<Course|null>(null);

const [loading,setLoading]=useState(true);






useEffect(()=>{


if(!id)
return;



const loadCourse=async()=>{


try{


const response:any =
await coursesApi.details(id);



console.log(
"COURSE DETAILS RESPONSE:",
response
);



const data =
response?.data ?? response;



setCourse(data);



}

catch(error){

console.error(
"COURSE DETAILS ERROR:",
error
);


}


finally{

setLoading(false);

}



};



loadCourse();



},[id]);









if(loading){

return (

<div className="
min-h-screen
flex
items-center
justify-center
">


<div className="
animate-spin
w-12
h-12
border-4
border-blue-600
border-t-transparent
rounded-full
"/>


</div>

)

}







if(!course){


return (

<div className="
min-h-screen
flex
flex-col
items-center
justify-center
gap-5
">


<h2 className="
text-2xl
font-bold
">

Course not found

</h2>



<Link

to="/courses"

className="
px-6
py-3
rounded-xl
bg-blue-600
text-white
"

>

Back To Courses

</Link>


</div>

)

}






const progress =
course.progress ?? 0;






return (

<div className="
min-h-screen
bg-gray-50
">






{/* HERO */}

<section className="
bg-gradient-to-br
from-blue-700
via-indigo-700
to-purple-800
text-white
">


<div className="
container
mx-auto
px-5
py-16
grid
lg:grid-cols-2
gap-10
items-center
">





<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

>


<h1 className="
text-4xl
lg:text-5xl
font-bold
mb-5
">

{course.title}

</h1>



<p className="
text-white/80
leading-8
text-lg
">

{course.description}

</p>





<div className="
flex
flex-wrap
gap-3
mt-8
">


<div className="
bg-white/20
px-4
py-2
rounded-xl
flex
items-center
gap-2
">

<BookOpen size={18}/>

{course.lectures?.length || 0}
Lectures

</div>



<div className="
bg-white/20
px-4
py-2
rounded-xl
flex
items-center
gap-2
">

<Users size={18}/>

{course.students_count || 0}

Students

</div>



<div className="
bg-white/20
px-4
py-2
rounded-xl
capitalize
">

{course.level}

</div>



</div>



</motion.div>









<div className="
rounded-3xl
overflow-hidden
shadow-2xl
bg-white/10
">


{

course.image

?

<img

src={course.image}

alt={course.title}

className="
w-full
h-80
object-cover
"

/>


:

<div className="
h-80
flex
items-center
justify-center
">

<BookOpen
size={90}
/>


</div>


}


</div>







</div>


</section>









<main className="
container
mx-auto
px-5
py-12
grid
lg:grid-cols-3
gap-8
">






<div className="
lg:col-span-2
space-y-6
">





<div className="
bg-white
rounded-3xl
p-6
shadow-sm
">


<h2 className="
text-2xl
font-bold
mb-4
">

About Course

</h2>


<p className="
text-gray-600
leading-8
">

{course.description}

</p>


</div>









<div className="
bg-white
rounded-3xl
p-6
shadow-sm
">


<h2 className="
text-2xl
font-bold
mb-5
">

Course Content

</h2>




{

course.lectures?.length

?

<div className="
space-y-3
">

{

course.lectures.map(
(lecture,index)=>(


<div

key={index}

className="
border
rounded-2xl
p-4
flex
items-center
justify-between
hover:bg-gray-50
"

>


<div className="
flex
items-center
gap-3
">


<PlayCircle
className="
text-blue-600
"
/>


<span className="
font-medium
">

{
lecture.title ||
`Lecture ${index+1}`
}

</span>


</div>



<CheckCircle
size={18}
className="
text-green-500
"
/>


</div>


)

)

}

</div>


:

<p className="
text-gray-400
">

No lectures available

</p>


}



</div>









<div className="
grid
md:grid-cols-2
gap-5
">





<div className="
bg-white
rounded-3xl
p-6
">

<h3 className="
font-bold
flex
gap-2
mb-4
">

<FileText/>

Homework

</h3>



{

course.homework_titles?.length

?

course.homework_titles.map(
(item,index)=>(

<p
key={index}
className="
text-gray-600
mb-2
"
>

{item}

</p>

)

)

:

<p className="text-gray-400">
No homework
</p>

}


</div>








<div className="
bg-white
rounded-3xl
p-6
">


<h3 className="
font-bold
flex
gap-2
mb-4
">

<ClipboardCheck/>

Tests

</h3>



{

course.test_titles?.length

?

course.test_titles.map(
(item,index)=>(

<p
key={index}
className="
text-gray-600
mb-2
"
>

{item}

</p>

)

)

:

<p className="text-gray-400">
No tests
</p>

}


</div>





</div>







</div>









{/* SIDE CARD */}


<aside>


<div className="
bg-white
rounded-3xl
p-6
shadow-lg
sticky
top-5
">


<h2 className="
text-3xl
font-bold
text-blue-600
mb-6
">

{course.price} EGP

</h2>






<div className="
mb-6
">


<div className="
flex
justify-between
mb-2
text-sm
">

<span>
Progress
</span>


<b className="
text-blue-600
">

{progress}%

</b>


</div>




<div className="
h-3
bg-gray-100
rounded-full
overflow-hidden
">

<div

style={{
width:`${progress}%`
}}

className="
h-full
bg-blue-600
"

/>


</div>


</div>







<div className="
space-y-4
text-gray-600
">


<div className="
flex
gap-2
">

<Clock/>

{course.duration}

</div>



<div className="
flex
gap-2
">

<Calendar/>

{course.start_date}

</div>



<div className="
flex
gap-2
">

<BookOpen/>

{course.total_duration_minutes}

Minutes

</div>



</div>








<Link

to={`/student/courses/${course.id}`}

className="
mt-8
w-full
bg-blue-600
hover:bg-blue-700
text-white
py-3
rounded-2xl
flex
justify-center
items-center
gap-2
font-semibold
"

>


Start Learning

<ArrowLeft size={18}/>


</Link>





</div>


</aside>





</main>







<Footer/>


</div>


)


}