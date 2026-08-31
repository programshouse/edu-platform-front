import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { coursesApi } from "@/features/courses/api/courses-api";

export function StudentEnrollPage() {

  const { courseId } = useParams();

  const navigate = useNavigate();

  const [course,setCourse] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [enrolling,setEnrolling] = useState(false);
  const [message,setMessage] = useState("");



  useEffect(()=>{

    async function fetchCourse(){

      try{

        const res = await coursesApi.details(courseId!);

        setCourse(res?.data || res);

      }catch(error){

        console.log(error);

      }finally{

        setLoading(false);

      }

    }


    if(courseId)
      fetchCourse();


  },[courseId]);




  async function enroll(){

    try{

      setEnrolling(true);

      const res = await coursesApi.subscribe(courseId!);


      setMessage(
        res?.message ||
        "تم الاشتراك في الكورس بنجاح"
      );


      setTimeout(()=>{

        navigate(`/student/courses/${courseId}`);

      },1200);



    }catch(error:any){

      setMessage(
        error?.response?.data?.message ||
        "حدث خطأ أثناء الاشتراك"
      );


    }finally{

      setEnrolling(false);

    }

  }



  if(loading){

    return (
      <div className="p-10 text-center">
        جاري تحميل بيانات الكورس...
      </div>
    )

  }




return (

<div className="min-h-screen bg-gray-50 py-12">

<div className="max-w-5xl mx-auto px-4">


<div className="bg-white rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2">


{/* Image */}

<div className="bg-gray-100 min-h-[350px]">

{
course?.image ?

<img
src={course.image}
className="w-full h-full object-cover"
/>

:

<div className="flex items-center justify-center h-full text-6xl">
🎓
</div>

}

</div>




{/* Content */}

<div className="p-8 text-right">


<h1 className="text-3xl font-bold mb-4">

{course?.title || "الكورس"}

</h1>



<p className="text-gray-500 mb-6">

{course?.description ||
"ابدأ تعلم هذا الكورس واحصل على جميع المحتوى التعليمي"}

</p>



<div className="space-y-3 mb-8">


<div className="bg-gray-50 p-4 rounded-xl">

📚 محتوى كامل للكورس

</div>



<div className="bg-gray-50 p-4 rounded-xl">

🎯 اختبارات وتقييمات

</div>



<div className="bg-gray-50 p-4 rounded-xl">

🏆 شهادة إتمام

</div>



</div>



<div className="flex justify-between mb-6">


<span className="text-gray-500">
السعر
</span>


<span className="text-primary text-2xl font-bold">

{course?.price || 0} $

</span>


</div>



<button

onClick={enroll}

disabled={enrolling}

className="
w-full
bg-primary
text-white
py-4
rounded-2xl
font-bold
text-lg
disabled:opacity-50
"

>

{
enrolling
?
"جاري التسجيل..."
:
"اشترك الآن"
}


</button>



{
message &&

<div className="mt-5 bg-green-50 text-green-700 p-3 rounded-xl text-center">

{message}

</div>

}



</div>


</div>


</div>


</div>


)

}