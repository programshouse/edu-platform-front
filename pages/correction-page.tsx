import {useParams} from "react-router-dom";

export default function CorrectionPage(){
 const {id}=useParams();

 return <div className="text-xl font-bold">
 تصحيح الاختبار رقم {id}
 </div>;
}
