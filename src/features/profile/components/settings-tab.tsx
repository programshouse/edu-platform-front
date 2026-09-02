import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { studentApi } from "@/features/student/api/student-api";


interface StudentSettings {

  id?: number;

  fullName: string;

  email: string;

  phone: string;

  parentPhone: string;

  dateOfBirth: string;

  governorate: number;

  address: string;

  grade: number;

  school: string;

  section: string;

}


interface Props {

  student: StudentSettings;

  onProfileUpdated: () => void;

}



export function SettingsTab({
  student,
  onProfileUpdated
}: Props) {


const [loading, setLoading] = useState(false);

const [passwordLoading, setPasswordLoading] = useState(false);


const [message, setMessage] = useState("");

const [error, setError] = useState("");


const [showPassword, setShowPassword] = useState(false);



const [form, setForm] = useState({

  full_name: student.fullName || "",

  email: student.email || "",

  phone: student.phone || "",

  parent_phone: student.parentPhone || "",

  dob: student.dateOfBirth || "",

  governorate_id: String(student.governorate || ""),

  address: student.address || "",

  grade_id: String(student.grade || ""),

  school: student.school || "",

  department_name: student.section || "",

});





const [password, setPassword] = useState({

  current_password: "",

  password: "",

  password_confirmation: ""

});






const updateField = (
  key: string,
  value: string
) => {

  setForm(prev => ({
    ...prev,
    [key]: value
  }));

};





const updatePasswordField = (
  key: string,
  value: string
) => {

  setPassword(prev => ({
    ...prev,
    [key]: value
  }));

};






const handleUpdate = async (
e: React.FormEvent
) => {


e.preventDefault();


try {


setLoading(true);

setError("");



const formData = new FormData();



Object.entries(form).forEach(([key,value]) => {


formData.append(
key,
value
);


});




await studentApi.updateProfile(
formData
);



setMessage(
"Profile updated successfully"
);



onProfileUpdated();



}

catch(err:any){


setError(

err?.response?.data?.message ||

"Update failed"

);


}

finally {


setLoading(false);


}


};







const handlePassword = async (
e:React.FormEvent
)=>{


e.preventDefault();



try{


setPasswordLoading(true);

setError("");



const formData = new FormData();



formData.append(
"current_password",
password.current_password
);



formData.append(
"password",
password.password
);



formData.append(
"password_confirmation",
password.password_confirmation
);




await studentApi.changePassword(
formData
);




setMessage(
"Password changed successfully"
);



setPassword({

current_password:"",

password:"",

password_confirmation:""

});



}

catch(err:any){


setError(

err?.response?.data?.message ||

"Password update failed"

);


}

finally{


setPasswordLoading(false);


}


};





const inputClass = `

w-full

border

border-gray-200

rounded-xl

px-4

py-3

text-sm

outline-none

focus:ring-2

focus:ring-blue-500

`;


return (

<div className="grid lg:grid-cols-2 gap-6">


{/* PROFILE */}

<motion.form

onSubmit={handleUpdate}

className="
bg-white
rounded-2xl
border
p-6
space-y-4
"

>


<h2 className="
font-bold
text-xl
">

تعديل البيانات الشخصية

</h2>



{message &&

<div className="
bg-green-50
text-green-700
p-3
rounded-xl
text-sm
">

{message}

</div>

}



{error &&

<div className="
bg-red-50
text-red-600
p-3
rounded-xl
text-sm
">

{error}

</div>

}






<input

name="full_name"

className={inputClass}

value={form.full_name}

onChange={e =>
updateField(
"full_name",
e.target.value
)
}

placeholder="Full Name"

/>






<input

name="email"

className={inputClass}

value={form.email}

disabled

placeholder="Email"

/>






<input

name="phone"

className={inputClass}

value={form.phone}

onChange={e =>
updateField(
"phone",
e.target.value
)
}

placeholder="Phone"

/>







<input

name="parent_phone"

className={inputClass}

value={form.parent_phone}

onChange={e =>
updateField(
"parent_phone",
e.target.value
)
}

placeholder="Parent Phone"

/>







<input

name="dob"

type="date"

className={inputClass}

value={form.dob}

onChange={e =>
updateField(
"dob",
e.target.value
)
}

/>







<input

name="governorate_id"

className={inputClass}

value={form.governorate_id}

onChange={e =>
updateField(
"governorate_id",
e.target.value
)
}

placeholder="Governorate"

/>







<input

name="address"

className={inputClass}

value={form.address}

onChange={e =>
updateField(
"address",
e.target.value
)
}

placeholder="Address"

/>







<input

name="grade_id"

className={inputClass}

value={form.grade_id}

onChange={e =>
updateField(
"grade_id",
e.target.value
)
}

placeholder="Grade"

/>







<input

name="school"

className={inputClass}

value={form.school}

onChange={e =>
updateField(
"school",
e.target.value
)
}

placeholder="School"

/>







<input

name="department_name"

className={inputClass}

value={form.department_name}

onChange={e =>
updateField(
"department_name",
e.target.value
)
}

placeholder="Department"

/>







<button

disabled={loading}

className="
w-full
bg-blue-600
text-white
rounded-xl
py-3
font-semibold
flex
items-center
justify-center
gap-2
"

>


{

loading ?

<Loader2 className="animate-spin"/>

:

<Save/>

}



حفظ التغييرات


</button>



</motion.form>
{/* PASSWORD */}

<motion.form

onSubmit={handlePassword}

className="
bg-white
rounded-2xl
border
p-6
space-y-4
"

>


<h2 className="
font-bold
text-xl
flex
items-center
gap-2
">

<Lock/>

تغيير كلمة المرور

</h2>






<div className="relative">


<input

name="current_password"

type={
showPassword
?
"text"
:
"password"
}

className={inputClass}

value={
password.current_password
}

onChange={e =>
updatePasswordField(
"current_password",
e.target.value
)
}

placeholder="Current password"

/>



<button

type="button"

onClick={() =>
setShowPassword(!showPassword)
}

className="
absolute
right-3
top-3
"

>


{

showPassword

?

<EyeOff/>

:

<Eye/>

}


</button>


</div>







<input

name="password"

type="password"

className={inputClass}

value={
password.password
}

onChange={e =>
updatePasswordField(
"password",
e.target.value
)
}

placeholder="New password"

/>







<input

name="password_confirmation"

type="password"

className={inputClass}

value={
password.password_confirmation
}

onChange={e =>
updatePasswordField(
"password_confirmation",
e.target.value
)
}

placeholder="Confirm password"

/>







<button

disabled={passwordLoading}

className="
w-full
bg-indigo-600
text-white
rounded-xl
py-3
font-semibold
flex
justify-center
items-center
gap-2
"

>


{

passwordLoading

?

<Loader2 className="animate-spin"/>

:

"تحديث كلمة المرور"

}


</button>



</motion.form>



</div>

);


}