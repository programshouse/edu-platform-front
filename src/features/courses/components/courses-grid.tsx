import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "use-debounce";
import { coursesApi } from "@/features/courses/api/courses-api";
import { searchApi } from "@/features/courses/api/search-api";
import { getCategories } from "@/features/landing/components/api/categories-api";
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




export function CoursesGrid() {


  const { t, i18n } =
    useTranslation("courses");


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
  ] = useState<number | "all">("all");



  const [
    searchQuery,
    setSearchQuery
  ] = useState("");



  const [
    debouncedSearch
  ] = useDebounce(
    searchQuery,
    500
  );



  const user =
    useAuthStore(
      (state)=>state.user
    );


  const role =
    user?.role?.toLowerCase();

  const {
    data: categories = []
  } = useQuery({
    queryKey:["categories", currentLang],
    queryFn: getCategories,
  });



  const isInstructor =
    role === "instructor" ||
    role === "teacher";



  // Courses API

  const {
    data: apiCourses,
    isLoading,
    error

  } = useQuery({

    queryKey:[
      isInstructor
      ? "instructorCourses"
      : "allCourses",
      currentLang
    ],


    queryFn:
      isInstructor
      ? coursesApi.instructorCourses
      : coursesApi.all,

  });



  // Search API

  const {
    data: searchResults,
    isFetching:isSearching

  } = useQuery({

    queryKey:[
      "search",
      debouncedSearch
    ],


    queryFn:
      ()=>searchApi.search(
        debouncedSearch
      ),


    enabled:
      debouncedSearch.length > 1,

  });





  const courses = (

    Array.isArray(apiCourses?.data)

    ?

    apiCourses.data

    :

    Array.isArray(apiCourses)

    ?

    apiCourses

    :

    []

  ) as CourseItem[];





  const searchedCourses =

    debouncedSearch.length > 1

    ?

    searchResults?.data?.courses ?? []

    :

    courses;







  const filteredCourses =
    useMemo(()=>{


      return searchedCourses.filter(
        (course:CourseItem)=>{


          const matchesSearch =

            !searchQuery

            ||

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

            Number((course as any).category_id ?? (course as any).category?.id) === activeFilter;



          return (
            matchesSearch &&
            matchesFilter
          );


        }
      );


    },[
      searchedCourses,
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

      <div
        className="
        py-20
        text-center
        text-red-500
        "
      >

        Failed to load courses

      </div>

    );

  }





return (

<section
className="
py-16
lg:py-24
bg-white
"
>


<div
className="
container
mx-auto
px-4
sm:px-6
lg:px-8
"
>




<div
className="
mb-12
space-y-6
"
>



<div
className="
max-w-md
mx-auto
relative
"
>


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
setSearchQuery(
 e.target.value
)
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



{
isSearching &&

<p
className="
text-xs
text-blue-500
mt-2
text-center
"
>
Searching...
</p>

}


</div>






<div
className="
flex
flex-wrap
justify-center
gap-2
"
>


<button
key="all"
onClick={()=>setActiveFilter("all")}
className={activeFilter === "all" ? "px-5 py-2.5 rounded-xl bg-blue-600 text-white" : "px-5 py-2.5 rounded-xl bg-gray-100"}
>
{t("filters.all")}
</button>

{categories.map((category)=>(
<button
key={category.id}
onClick={()=>setActiveFilter(category.id)}
className={activeFilter === category.id ? "px-5 py-2.5 rounded-xl bg-blue-600 text-white" : "px-5 py-2.5 rounded-xl bg-gray-100"}
>
{category.name}
</button>
))}


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
lg:grid-cols-4
gap-6
"

>


<AnimatePresence>


{
filteredCourses.map(
(course,index)=>(


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




<div
className="
h-48
bg-gray-100
"
>


{
course.image &&

<img

src={course.image}

alt={
course.title ??
"Course"
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



<h3
className="
font-bold
text-gray-900
mb-2
"
>

{
course.title
}

</h3>





<p
className="
text-sm
text-gray-500
mb-4
"
>

{
course.description
}

</p>






<div
className="
flex
gap-4
text-xs
text-gray-400
"
>


<span>

<Users
className="
inline
w-4
h-4
"
/>

{" "}

{
course.students_count ?? 0
}

</span>



<span>

<BookOpen
className="
inline
w-4
h-4
"
/>

{" "}

{
course.lectures_count ?? 0
}

</span>


</div>







<div
className="
flex
justify-between
mt-4
pt-4
border-t
"
>


<span>

<Clock
className="
inline
w-4
h-4
"
/>

{" "}

{
course.total_duration_minutes ?? 0
}

</span>




<span
className="
text-lg
font-bold
text-blue-600
"
>

${course.price ?? 0}

</span>


</div>







<Link

to={
`/student/courses/${course.id}/enroll`
}

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


))

}


</AnimatePresence>


</motion.div>




:


<div
className="
text-center
py-20
"
>


<SearchX

className="
mx-auto
w-10
h-10
text-gray-400
"

/>


<h3
className="
mt-4
font-bold
"
>

{
t("search.noResults")
}

</h3>


</div>


}





</div>


</section>


);


}