
import { useParams } from "react-router-dom";

export function ExamResultsPage(){
  const {id}=useParams();

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full">
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">نتائج الاختبار</h1>
            <p className="text-muted-foreground mt-1">عرض درجات ومحاولات الطلاب</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary">
            Exam #{id}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {["عدد الطلاب","متوسط الدرجات","أعلى درجة"].map((x)=>(
            <div key={x} className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">{x}</p>
              <p className="text-3xl font-bold mt-2">--</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border overflow-hidden">
          <div className="p-4 font-semibold bg-gray-50">Student Results</div>
          <div className="p-10 text-center text-gray-500">
            سيتم ربط بيانات النتائج من API
          </div>
        </div>
      </div>
    </div>
  );
}
