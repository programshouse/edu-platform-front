import { useQuery } from "@tanstack/react-query";
import { testsApi } from "./../api/tests-api";
import {
 ClipboardList
} from "lucide-react";


export function TestsTab(){


const {
 data,
 isLoading
}=useQuery({

 queryKey:[
  "student-tests"
 ],

 queryFn:
 testsApi.getStudentTests

});



const tests =
 data?.data ?? [];




if(isLoading){

return (
<div className="py-20 text-center">
Loading tests...
</div>
)

}



if(tests.length===0){

return (

<div className="text-center py-20">


<ClipboardList
className="
mx-auto
w-10
h-10
text-indigo-400
"
/>


<h3 className="mt-4 font-bold">
لم تجر اختبارات بعد
</h3>


<p className="text-gray-400">
أكمل محاضرات دوراتك لفتح الاختبارات
</p>


</div>

)

}





return (

<div className="grid md:grid-cols-2 gap-5">


{
tests.map((test:any)=>(


<div
key={test.id}
className="
bg-white
rounded-2xl
border
p-5
shadow-sm
"
>


<h3 className="font-bold">

{
test.course_title
}

</h3>


<p className="text-gray-500 mt-2">

{
test.lecture_title ??
"اختبار دورة"

}

</p>



<div className="mt-4 flex justify-between">


<span>
الدرجة:
{
test.student_mark ??
"--"
}
</span>



<span>
المحاولات:
{
test.student_attempts
}
</span>


</div>



<button

className="
mt-5
w-full
bg-blue-600
text-white
py-3
rounded-xl
"

>

ابدأ الاختبار

</button>



</div>


))

}


</div>

)


}