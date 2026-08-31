import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { coursesApi } from "@/features/courses/api/courses-api";


export function EnrollCoursePage() {

  const { courseId } = useParams();

  const navigate = useNavigate();


  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");



  useEffect(() => {

    async function loadCourse() {

      try {

        const response = await coursesApi.details(courseId as string);

        setCourse(response?.data ?? response);


      } catch (error) {

        console.error("Course details error:", error);

      } finally {

        setLoading(false);

      }

    }


    if (courseId) {
      loadCourse();
    }


  }, [courseId]);





  async function handleEnroll() {


    if (!courseId) return;


    try {

      setEnrolling(true);


      const response = await coursesApi.subscribe(courseId);


      setMessage(
        response?.message ||
        "تم الاشتراك في الكورس بنجاح"
      );


      setTimeout(() => {

        navigate(`/student/courses/${courseId}`);

      }, 1200);



    } catch (error: any) {


      setMessage(
        error?.response?.data?.message ||
        "حدث خطأ أثناء الاشتراك"
      );


    } finally {

      setEnrolling(false);

    }

  }




  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p>
          جاري تحميل بيانات الكورس...
        </p>

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">


      <div className="max-w-6xl mx-auto px-4">


        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">



          {/* Course Image */}

          <div className="h-[400px] bg-gray-100">


            {
              course?.image ?

              <img

                src={course.image}

                alt={course?.title}

                className="w-full h-full object-cover"

              />

              :

              <div className="h-full flex items-center justify-center text-7xl">

                🎓

              </div>

            }


          </div>





          {/* Details */}

          <div className="p-8">



            <h1 className="text-3xl font-bold text-gray-900 mb-4">

              {course?.title || "اسم الكورس"}

            </h1>



            <p className="text-gray-600 leading-8 mb-6">

              {
                course?.description ||
                "اشترك في الكورس واحصل على محتوى تعليمي كامل"
              }

            </p>




            <div className="space-y-3 mb-8">


              <div className="bg-gray-50 rounded-xl p-4">

                ✅ وصول كامل للمحاضرات

              </div>



              <div className="bg-gray-50 rounded-xl p-4">

                ✅ اختبارات وتقييمات

              </div>




              <div className="bg-gray-50 rounded-xl p-4">

                ✅ متابعة تقدمك في التعلم

              </div>



            </div>





            <div className="flex justify-between items-center mb-8">


              <span className="text-gray-500">

                سعر الكورس

              </span>


              <span className="text-2xl font-bold text-primary">

                {course?.price || 0} $

              </span>


            </div>





            <button

              onClick={handleEnroll}

              disabled={enrolling}

              className="
              w-full
              bg-primary
              text-white
              rounded-2xl
              py-4
              font-bold
              text-lg
              hover:opacity-90
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

              <div className="mt-5 rounded-xl bg-green-50 text-green-700 p-4 text-center">

                {message}

              </div>

            }



          </div>


        </div>


      </div>


    </div>

  );

}