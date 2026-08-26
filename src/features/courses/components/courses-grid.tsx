import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { coursesApi } from "@/features/courses/api/courses-api";
import { useAuthStore } from "@/shared/stores/auth-store";

import {
  BookOpen,
  Users,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  SearchX,
} from "lucide-react";


const courseColors = [
  {
    bg: "bg-blue-50",
    tag: "bg-blue-100 text-blue-700",
  },
  {
    bg: "bg-pink-50",
    tag: "bg-pink-100 text-pink-700",
  },
  {
    bg: "bg-emerald-50",
    tag: "bg-emerald-100 text-emerald-700",
  },
  {
    bg: "bg-purple-50",
    tag: "bg-purple-100 text-purple-700",
  },
  {
    bg: "bg-amber-50",
    tag: "bg-amber-100 text-amber-700",
  },
];


type CourseItem = {
  id?: number;

  title?: string;

  description?: string;

  students_count?: number;

  lectures_count?: number;

  tests_count?: number;

  total_duration_minutes?: number;

  level?: string;

  price?: number;

  category?: string;

  image?: string;
};



const filterKeys = [
  "all",
  "webDev",
  "design",
  "dataScience",
  "mobile",
] as const;



export function CoursesGrid() {


  const { t, i18n } = useTranslation("courses");


  const currentLang =
    i18n.language.startsWith("ar")
      ? "ar"
      : "en";


  const isRTL =
    currentLang === "ar";


  const ArrowIcon =
    isRTL
      ? ArrowLeft
      : ArrowRight;



  const [
    activeFilter,
    setActiveFilter
  ] = useState("all");



  const [
    searchQuery,
    setSearchQuery
  ] = useState("");




  const user = useAuthStore((state) => state.user);
  const role = user?.role?.toLowerCase();
  const isInstructor = role === "instructor" || role === "teacher";

  const {
    data: apiCourses,
    isLoading,
    error

  } = useQuery({

    queryKey:[
      isInstructor ? "instructorCourses" : "allCourses",
      currentLang
    ],

    queryFn:
      isInstructor
        ? coursesApi.instructorCourses
        : coursesApi.all,

  });





  console.log(
    "Courses API Response:",
    apiCourses
  );





  const courses = (

    Array.isArray(apiCourses?.data)

      ? apiCourses.data

      :

    Array.isArray(apiCourses)

      ? apiCourses

      :

    []

  ) as CourseItem[];







  const filteredCourses = useMemo(()=>{


    return courses.filter((course)=>{


      const matchesSearch =

        !searchQuery ||

        course.title
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )

        ||

        course.description
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        );



      const matchesFilter =

        activeFilter === "all"

        ||

        course.category === activeFilter;



      return (
        matchesSearch &&
        matchesFilter
      );


    });


  },[
    courses,
    searchQuery,
    activeFilter
  ]);







  if(isLoading){

    return (

      <div className="py-20 text-center">

        Loading courses...

      </div>

    );

  }




  if(error){

    return (

      <div className="py-20 text-center text-red-500">

        Failed to load courses

      </div>

    );

  }







return (

<section className="py-16 lg:py-24 bg-white">


<div className="container mx-auto px-4 sm:px-6 lg:px-8">



<div className="mb-12 space-y-6">


<div className="max-w-md mx-auto relative">


<Search

className="
absolute
left-4
top-1/2
-translate-y-1/2
w-5
h-5
text-gray-400
"

/>



<input

type="text"

placeholder={
t("search.placeholder")
}

value={searchQuery}

onChange={(e)=>
setSearchQuery(e.target.value)
}

className="
w-full
pl-12
pr-4
py-3.5
bg-gray-50
border
rounded-xl
"

/>


</div>






<div className="
flex
flex-wrap
justify-center
gap-2
">


{
filterKeys.map((key)=>(


<button

key={key}

onClick={()=>
setActiveFilter(key)
}

className={

activeFilter === key

?

"px-5 py-2.5 rounded-xl bg-blue-600 text-white"

:

"px-5 py-2.5 rounded-xl bg-gray-100"

}

>


{t(`filters.${key}`)}


</button>


))

}


</div>


</div>








{
filteredCourses.length > 0

?


<motion.div

layout

className="
grid
sm:grid-cols-2
lg:grid-cols-3
gap-6
"

>


<AnimatePresence>


{

filteredCourses.map(
(course,index)=>{


const color =
courseColors[
index %
courseColors.length
];



return (

<motion.div

key={
course.id ?? index
}


layout

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

exit={{
opacity:0,
y:20
}}

className="
bg-white
rounded-2xl
border
overflow-hidden
hover:shadow-xl
transition
"

>




<div className="
h-48
bg-gray-100
">


{
course.image &&

<img

src={course.image}

alt={
course.title ?? "Course"
}

className="
w-full
h-full
object-cover
"

/>


}


</div>







<div className="p-5">



<h3 className="
font-bold
text-gray-900
mb-2
">


{
course.title
}


</h3>






<p className="
text-sm
text-gray-500
mb-4
">


{
course.description
}


</p>






<div className="
flex
gap-4
text-xs
text-gray-400
">


<span>

<Users className="inline w-4 h-4"/>

{" "}
{
course.students_count ?? 0
}

</span>



<span>

<BookOpen className="inline w-4 h-4"/>

{" "}
{
course.lectures_count ?? 0
}

</span>


</div>







<div className="
flex
justify-between
mt-4
pt-4
border-t
">


<span>

<Clock className="inline w-4 h-4"/>

{" "}
{
course.total_duration_minutes ?? 0
}

</span>




<span className="
text-lg
font-bold
text-blue-600
">


${course.price ?? 0}


</span>



</div>







<Link

to={`/courses/${course.id}`}

className="block mt-4"

>


<button

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
"

>


{
t("card.enrollNow")
}


<ArrowIcon

className="
inline
ml-2
w-4
h-4
"

/>


</button>


</Link>





</div>



</motion.div>


);


})

}


</AnimatePresence>


</motion.div>




:


<div className="text-center py-20">


<SearchX

className="
mx-auto
w-10
h-10
text-gray-400
"

/>


<h3 className="
mt-4
font-bold
">

{t("search.noResults")}

</h3>


</div>


}






</div>


</section>


);


}