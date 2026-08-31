=import {Link} from "react-router-dom";

export function ExamsTable({exams}:any){
 return (
  <table className="w-full border">
   <thead>
    <tr>
     <th>عنوان الاختبار</th>
     <th>الكورس</th>
     <th>الدرجة</th>
     <th>المدة</th>
     <th>المحاولات</th>
     <th>الأسئلة</th>
     <th></th>
    </tr>
   </thead>
   <tbody>
   {exams.map((exam:any)=>(
    <tr key={exam.id}>
     <td>{exam.title}</td>
     <td>{exam.course_title}</td>
     <td>{exam.full_mark}</td>
     <td>{exam.duration} دقيقة</td>
     <td>{exam.max_attempts}</td>
     <td>{exam.questions_count}</td>
     <td>
      <Link to={`/teacher/exams/${exam.id}/results`}>عرض النتائج</Link>
      <br/>
      <Link to={`/teacher/exams/${exam.id}/correction`}>التصحيح</Link>
     </td>
    </tr>
   ))}
   </tbody>
  </table>
 )
}
