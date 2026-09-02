import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";


interface EnrolledCourse {

  id:number;

  title:string;

  description:string;

  image:string | null;

  progress:number;

  status?: "active" | "expired";

  expiresAt?: string;

  lectures?: any[];

  homework_titles?: string[];

  test_titles?: string[];

}



interface CoursesTabProps {

 courses:EnrolledCourse[];

}




const containerVariants={

hidden:{
 opacity:0
},

visible:{
 opacity:1,

 transition:{
  staggerChildren:0.07
 }

}

};




const itemVariants={

hidden:{
 opacity:0,
 y:18
},

visible:{
 opacity:1,

 transition:{
  duration:0.35
 }

}

};





export function CoursesTab({

courses

}:CoursesTabProps){


const {t}=useTranslation("profile");






if(!courses.length){


return (

<div className="
flex
flex-col
items-center
justify-center
py-20
text-center
">


<div className="
w-16
h-16
rounded-2xl
bg-blue-50
flex
items-center
justify-center
mb-4
">

<BookOpen
className="
w-8
h-8
text-blue-400
"
/>


</div>




<p className="
text-lg
font-semibold
text-gray-700
">

{t("courses.noCourses")}

</p>



<p className="
text-sm
text-gray-400
mt-1
">

{t("courses.noCoursesDesc")}

</p>



<Link

to="/courses"

className="
mt-6
px-6
py-2.5
rounded-xl
bg-blue-600
text-white
text-sm
font-semibold
"

>

{t("courses.viewDetails")}

</Link>


</div>

)

}








return (

<motion.div

variants={containerVariants}

initial="hidden"

animate="visible"

className="
grid
sm:grid-cols-2
xl:grid-cols-3
gap-5
"

>


{

courses.map((course)=>{


const isActive =
course.status !== "expired";


const isCompleted =
course.progress >= 100;





return (


<motion.div

key={course.id}

variants={itemVariants}

className="
bg-white
rounded-2xl
border
border-gray-100
shadow-sm
overflow-hidden
flex
flex-col
"


>






{/* Image */}

<div className="
relative
h-40
bg-gray-100
">


{


course.image ?


<img

src={course.image}

alt={course.title}

className="
w-full
h-full
object-cover
"

/>


:


<div className="
w-full
h-full
flex
items-center
justify-center
">

<BookOpen

className="
w-10
h-10
text-gray-300
"

/>


</div>


}







<div className="
absolute
top-3
end-3
">


<span

className={cn(

"flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold",

isCompleted

?

"bg-blue-600 text-white"

:

isActive

?

"bg-emerald-500 text-white"

:

"bg-red-500 text-white"

)}

>


<CheckCircle

className="
w-3
h-3
"

/>


{


isCompleted

?

"Completed"

:

isActive

?

t("courses.status.active")

:

t("courses.status.expired")

}



</span>



</div>



</div>









<div className="
p-4
flex
flex-col
gap-3
flex-1
">





<h3 className="
font-bold
text-gray-900
">

{course.title}

</h3>






<p className="
text-xs
text-gray-400
line-clamp-2
">

{course.description}

</p>








{/* Progress */}


<div>


<div className="
flex
justify-between
text-xs
mb-1
">


<span>

{t("courses.progress")}

</span>



<span className="
text-blue-600
font-bold
">

{course.progress || 0}%

</span>



</div>





<div className="
h-2
bg-gray-100
rounded-full
overflow-hidden
">


<div

style={{

width:`${course.progress || 0}%`

}}

className="
h-full
bg-blue-600
rounded-full
transition-all
"

/>


</div>



</div>










<div className="
flex
items-center
gap-2
text-xs
text-gray-400
">


<Calendar

className="
w-3.5
h-3.5
"

/>



{course.expiresAt || "-"}


</div>









<div className="
flex
gap-2
mt-auto
pt-2
">






{/* Continue Learning */}


<Link

to={`/student/courses/${course.id}`}

className={cn(

"flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all",

isActive

?

"bg-blue-600 hover:bg-blue-700 text-white"

:

"bg-gray-100 text-gray-400 pointer-events-none"

)}

>


{

isCompleted

?

"Completed"

:

t("courses.accessCourse")

}


</Link>









{/* Details */}



<Link

to={`/courses/${course.id}`}
className="
flex
items-center
gap-1
px-3
py-2
rounded-xl
border
border-gray-200
text-xs
font-semibold
text-gray-600
hover:bg-gray-50
"

>


<ExternalLink

className="
w-3.5
h-3.5
"

/>



{t("courses.viewDetails")}



</Link>







</div>






</div>





</motion.div>



)


})


}



</motion.div>


)


}