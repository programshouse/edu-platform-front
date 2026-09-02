import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen,
  ClipboardList,
  TrendingUp,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { coursesApi } from "@/features/courses/api/courses-api";


const FEATURES = [
  { icon: BookOpen,      ar: "وصول كامل للمحاضرات",       en: "Full lecture access" },
  { icon: ClipboardList, ar: "اختبارات وتقييمات",          en: "Tests & assessments" },
  { icon: TrendingUp,    ar: "متابعة تقدمك في التعلم",    en: "Track your progress" },
];


export function EnrollCoursePage() {

  const { courseId } = useParams();
  const navigate     = useNavigate();

  const [course,    setCourse]    = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled,  setEnrolled]  = useState(false);


  // ── Load course details ──────────────────────────────────
  useEffect(() => {

    if (!courseId) return;

    (async () => {
      try {
        const res = await coursesApi.details(courseId);
        setCourse(res?.data ?? res);
      } catch {
        toast.error("فشل تحميل بيانات الكورس");
      } finally {
        setLoading(false);
      }
    })();

  }, [courseId]);


  // ── Subscribe ────────────────────────────────────────────
  async function handleEnroll() {

    if (!courseId) return;

    try {

      setEnrolling(true);

      const res = await coursesApi.subscribe(courseId);

      setEnrolled(true);

      toast.success(
        res?.message || "تم الاشتراك في الكورس بنجاح 🎉",
        { duration: 3000 }
      );

      // go to course details after 1.5 s
      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1500);

    } catch (err: any) {

      const msg =
        err?.response?.data?.message ||
        "حدث خطأ أثناء الاشتراك";

      // 409 = already subscribed
      if (err?.response?.status === 409) {
        toast.info(msg || "أنت مشترك بالفعل في هذا الكورس");
        setTimeout(() => navigate(`/courses/${courseId}`), 1200);
      } else {
        toast.error(msg);
      }

    } finally {
      setEnrolling(false);
    }

  }


  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }


  // ── Page ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          عرض تفاصيل الكورس
        </Link>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2"
        >

          {/* Image */}
          <div className="h-[360px] md:h-auto bg-gray-100">
            {course?.image ? (
              <img
                src={course.image}
                alt={course?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-8xl">
                🎓
              </div>
            )}
          </div>


          {/* Details */}
          <div className="p-8 flex flex-col justify-between">

            <div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {course?.title || "اسم الكورس"}
              </h1>

              {course?.description && (
                <p className="text-gray-500 leading-7 text-sm mb-6">
                  {course.description}
                </p>
              )}

              {/* Feature list */}
              <div className="space-y-3 mb-8">
                {FEATURES.map(({ icon: Icon, ar }) => (
                  <div
                    key={ar}
                    className="flex items-center gap-3 bg-blue-50 rounded-xl p-3.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{ar}</span>
                  </div>
                ))}
              </div>

            </div>


            <div>

              {/* Price */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 text-sm">سعر الكورس</span>
                <span className="text-2xl font-bold text-blue-600">
                  {course?.price ?? 0} $
                </span>
              </div>

              {/* Enroll button */}
              <button
                onClick={handleEnroll}
                disabled={enrolling || enrolled}
                className="
                  w-full py-4 rounded-2xl font-bold text-lg
                  bg-blue-600 hover:bg-blue-700 text-white
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-colors flex items-center justify-center gap-2
                "
              >
                {enrolling && <Loader2 className="w-5 h-5 animate-spin" />}
                {enrolled  ? "تم الاشتراك ✓" : enrolling ? "جاري التسجيل..." : "اشترك الآن"}
              </button>

            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}
