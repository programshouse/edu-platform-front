import {useParams} from "react-router-dom";

export default function ResultsPage(){
 const {id}=useParams();

 return <div className="text-xl font-bold">
 نتائج الاختبار رقم {id}
 </div>;
}
