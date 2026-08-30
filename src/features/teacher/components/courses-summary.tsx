import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ExternalLinkIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useCoursesQuery } from "@/features/teacher/courses/hooks/use-courses-query";


type CourseStatus =
  | "active"
  | "inactive"
  | "expired"
  | "finished";


interface Course {

  id: string;

  title?: string;

  students?: number;

  earnings?: number;

  status?: CourseStatus;

}



const STATUS_STYLE: Record<CourseStatus,string> = {

  active:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",

  inactive:
    "bg-gray-50 text-gray-600 border border-gray-200",

  expired:
    "bg-red-50 text-red-600 border border-red-200",

  finished:
    "bg-gray-50 text-gray-600 border border-gray-200",

};



export function CoursesSummary() {


  const { t } =
    useTranslation("teacher");


  const {
    data,
    isLoading
  } = useCoursesQuery();



  const courses: Course[] =
    data?.data ?? [];




  if(isLoading){

    return (

      <section className="
        text-center
        py-10
        text-gray-500
      ">

        Loading courses...

      </section>

    );

  }





  if(!courses.length){

    return (

      <section className="
        text-center
        py-10
        text-gray-500
      ">

        No courses found

      </section>

    );

  }





return (

<section>


<div className="
flex
items-center
justify-between
mb-4
">


<h2 className="
text-base
font-semibold
text-gray-800
">

{t("courses.title")}

</h2>



<Link

to="/teacher/courses"

className="
flex
items-center
gap-1.5
text-xs
font-medium
text-blue-600
hover:text-blue-700
"

>

{t("courses.viewAll")}

<ExternalLinkIcon className="size-3"/>

</Link>


</div>





<div className="
bg-white
rounded-xl
border
border-gray-100
shadow-sm
overflow-hidden
">



<div className="
grid
grid-cols-[1fr_auto_auto_auto_auto]
gap-4
px-5
py-3
bg-gray-50
border-b
text-xs
font-semibold
text-gray-400
uppercase
">


<span>
{t("courses.columns.course")}
</span>


<span className="text-center">

{t("courses.columns.students")}

</span>



<span className="hidden sm:block text-center">

{t("courses.columns.earnings")}

</span>



<span className="text-center">

{t("courses.columns.status")}

</span>



<span>

{t("courses.columns.actions")}

</span>


</div>





{
courses.map((course,idx)=>(


<div

key={course.id ?? idx}

className={cn(

"grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3.5 text-sm hover:bg-blue-50/40 transition-colors",

idx < courses.length - 1 &&
"border-b border-gray-50"

)}

>


<span className="
font-medium
text-gray-800
truncate
">

{course.title ?? "Untitled"}

</span>





<span className="
text-center
text-gray-500
tabular-nums
">

{
(course.students ?? 0)
.toLocaleString()
}

</span>





<span className="
hidden
sm:block
text-center
text-gray-500
tabular-nums
">


{
(course.earnings ?? 0)
.toLocaleString()
}


{" "}

{t("stats.currency")}


</span>





<span className="
flex
justify-center
">


<span

className={cn(

"px-2 py-0.5 rounded-full text-xs font-medium",

STATUS_STYLE[
course.status ?? "inactive"
]

)}

>


{
t(
`courses.status.${course.status ?? "inactive"}`
)

}


</span>


</span>






<Link

to={`/teacher/courses/${course.id}`}

className="
text-xs
font-medium
text-blue-600
hover:text-blue-700
hover:underline
"

>

{t("courses.manage")}


</Link>




</div>


))


}




</div>


</section>


);

}