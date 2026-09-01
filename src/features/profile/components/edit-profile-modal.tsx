import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Loader2,
  Save
} from "lucide-react";

import { studentApi } from "@/features/student/api/student-api";


const GOVERNORATE_KEYS = [
  "cairo",
  "giza",
  "alexandria",
  "dakahlia",
  "sharqia",
  "monufia",
];


const GRADE_KEYS = [
  "grade_1_prep",
  "grade_2_prep",
  "grade_3_prep",
  "grade_1_sec",
  "grade_2_sec",
  "grade_3_sec",
];



interface StudentData {

fullName:string;

email:string;

phone:string;

parentPhone:string;

dateOfBirth:string;

governorate:number;

address:string;

grade:number;

school:string;

section:string;

}



interface Props {

isOpen:boolean;

onClose:()=>void;

student:StudentData;

onUpdated?:()=>void;

}




export function EditProfileModal({

isOpen,

onClose,

student,

onUpdated

}:Props){


const {t}=useTranslation("profile");

const tAuth=useTranslation("auth").t;



const [loading,setLoading]=useState(false);

const [error,setError]=useState("");



const [data,setData]=useState<StudentData>(student);



useEffect(()=>{

setData(student);

},[student]);





const updateField=(
key:keyof StudentData,
value:any
)=>{

setData(prev=>({

...prev,

[key]:value

}));

};





const submit=async()=>{


try{


setLoading(true);

setError("");



const formData=new FormData();



formData.append(
"full_name",
data.fullName
);


formData.append(
"email",
data.email
);


formData.append(
"phone",
data.phone
);


formData.append(
"parent_phone",
data.parentPhone
);


formData.append(
"dob",
data.dateOfBirth
);


formData.append(
"governorate_id",
String(data.governorate)
);


formData.append(
"address",
data.address
);


formData.append(
"grade_id",
String(data.grade)
);


formData.append(
"school",
data.school
);


formData.append(
"department_name",
data.section
);




await studentApi.updateProfile(
formData
);



onUpdated?.();


onClose();



}
catch(err:any){


setError(
err?.response?.data?.message ||
"Update failed"
);


}
finally{


setLoading(false);


}


};







const inputCls=

"w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm";



const selectCls=

`${inputCls} appearance-none`;







return (

<AnimatePresence>


{
isOpen &&

<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
p-4
">


<div

onClick={onClose}

className="
absolute
inset-0
bg-black/50
"

/>



<motion.div

initial={{
opacity:0,
scale:.95
}}

animate={{
opacity:1,
scale:1
}}

className="
relative
bg-white
rounded-2xl
w-full
max-w-2xl
p-6
max-h-[90vh]
overflow-y-auto
"

>


<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
font-bold
text-xl
">

{t("modal.title")}

</h2>


<button onClick={onClose}>

<X/>

</button>


</div>






{
error &&

<div className="
bg-red-50
text-red-600
p-3
rounded-xl
mb-4
">

{error}

</div>

}






<div className="
space-y-4
">



<input

className={inputCls}

value={data.fullName}

onChange={
e=>updateField(
"fullName",
e.target.value
)
}

placeholder="Full Name"

/>





<input

className={inputCls}

value={data.email}

disabled

/>





<input

className={inputCls}

value={data.phone}

onChange={
e=>updateField(
"phone",
e.target.value
)
}

/>





<input

className={inputCls}

value={data.parentPhone}

onChange={
e=>updateField(
"parentPhone",
e.target.value
)
}

/>





<input

type="date"

className={inputCls}

value={data.dateOfBirth}

onChange={
e=>updateField(
"dateOfBirth",
e.target.value
)
}

/>





<div className="relative">


<select

className={selectCls}

value={data.governorate}

onChange={
e=>updateField(
"governorate",
Number(e.target.value)
)
}

>


{
GOVERNORATE_KEYS.map((x,i)=>(

<option

key={x}

value={i+1}

>

{tAuth(`governorates.${x}`)}

</option>

))

}


</select>


<ChevronDown className="
absolute
right-3
top-3
w-4
"/>


</div>







<input

className={inputCls}

value={data.address}

onChange={
e=>updateField(
"address",
e.target.value
)
}

/>






<select

className={selectCls}

value={data.grade}

onChange={
e=>updateField(
"grade",
Number(e.target.value)
)
}

>

{
GRADE_KEYS.map((x,i)=>(

<option
key={x}
value={i+1}
>

{tAuth(`grades.${x}`)}

</option>

))

}

</select>







<input

className={inputCls}

value={data.school}

onChange={
e=>updateField(
"school",
e.target.value
)
}

/>






<input

className={inputCls}

value={data.section}

onChange={
e=>updateField(
"section",
e.target.value
)
}

/>





<button

onClick={submit}

disabled={loading}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-semibold
flex
justify-center
gap-2
"

>

{
loading
?
<Loader2 className="animate-spin"/>
:
<Save/>
}

Save

</button>



</div>


</motion.div>


</div>

}


</AnimatePresence>

)

}