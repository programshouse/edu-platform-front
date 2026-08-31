import {useExams} from "../hooks/use-exams";
import {ExamsTable} from "../components/exams-table";

export default function ExamsPage(){
 const {data=[],isLoading}=useExams();

 if(isLoading) return <div>Loading...</div>;

 return (
  <div>
   <h1 className="text-xl font-bold mb-5">إدارة الاختبارات</h1>
   <ExamsTable exams={data}/>
  </div>
 );
}
