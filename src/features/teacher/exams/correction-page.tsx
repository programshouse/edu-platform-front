
import { useParams } from "react-router-dom";

export function ExamCorrectionPage(){
 const {id}=useParams();

 return (
  <div className="p-6 md:p-10 bg-gray-50 min-h-full">
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h1 className="text-2xl font-bold">تصحيح الاختبار</h1>
      <p className="text-gray-500 mt-2">مراجعة إجابات الطلاب وتسجيل الدرجات</p>

      <div className="mt-6 border rounded-xl p-8 text-center text-gray-500">
        Exam #{id} correction panel will be connected with API
      </div>
    </div>
  </div>
 );
}
