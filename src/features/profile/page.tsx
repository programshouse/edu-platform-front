import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  School,
  Loader2,
} from "lucide-react";

import { ProfileHero } from "./components/profile-hero";
import { ProfileTabs, type ProfileTab } from "./components/profile-tabs";

import { CoursesTab } from "./components/courses-tab";
import { TestsTab } from "./components/tests-tab";
import { AssignmentsTab } from "./components/assignments-tab";
import { SettingsTab } from "./components/settings-tab";

import { Footer } from "@/features/landing/components/footer";

import { authApi } from "@/features/auth/api/auth-api";
import { studentApi } from "@/features/student/api/student-api";




export interface StudentProfile {

  id:number;

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


  stats:{
    courses:number;
    points:number;
    rank:number;
  };

}




function PersonalTab({
student
}:{
student:StudentProfile
}){

const {t}=useTranslation("profile");


const fields=[

{
icon:User,
label:t("personal.fullName"),
value:student.fullName
},


{
icon:Mail,
label:t("personal.email"),
value:student.email
},


{
icon:Phone,
label:t("personal.phone"),
value:student.phone
},


{
icon:Phone,
label:t("personal.parentPhone"),
value:student.parentPhone
},


{
icon:MapPin,
label:t("personal.address"),
value:student.address
},


{
icon:GraduationCap,
label:t("personal.grade"),
value:student.grade
},


{
icon:School,
label:t("personal.school"),
value:student.school
},


];


return (

<motion.div

initial={{
opacity:0,
y:15
}}

animate={{
opacity:1,
y:0
}}

className="
grid
md:grid-cols-2
gap-4
"

>


{
fields.map((field,index)=>{

const Icon=field.icon;


return (

<div

key={index}

className="
bg-white
rounded-2xl
border
p-5
flex
items-center
gap-4
"

>

<div
className="
w-10
h-10
rounded-xl
bg-blue-50
flex
items-center
justify-center
"
>

<Icon
className="
w-5
h-5
text-blue-600
"
/>

</div>


<div>

<p className="
text-xs
text-gray-400
">

{field.label}

</p>


<p className="
font-semibold
text-gray-900
">

{field.value || "-"}

</p>


</div>


</div>

)

})

}


</motion.div>

)

}





const tabVariants={

hidden:{
opacity:0,
y:10
},

visible:{
opacity:1,
y:0
},

exit:{
opacity:0,
y:-5
}

};







export function ProfilePage(){


const [activeTab,setActiveTab]=useState<ProfileTab>("personal");





const {
data:profileResponse,
isLoading,
isError,
refetch

}=useQuery({

queryKey:[
"studentProfile"
],

queryFn:
authApi.profile

});






const {
data:coursesResponse
}=useQuery({

queryKey:[
"studentCourses"
],

queryFn:
studentApi.getCourses,

enabled:
activeTab==="courses"

});




const {
data:testsResponse
}=useQuery({

queryKey:[
"studentTests"
],

queryFn:
studentApi.getTests,

enabled:
activeTab==="tests"

});





const {
data:homeworkResponse
}=useQuery({

queryKey:[
"studentHomeworks"
],

queryFn:
studentApi.getHomeworks,

enabled:
activeTab==="assignments"

});







const raw =
profileResponse?.data ??
profileResponse;





const student:StudentProfile | undefined = raw
?
{

id:raw.id,

fullName:
raw.full_name ?? "",


email:
raw.email ?? "",


phone:
raw.phone ?? "",


parentPhone:
raw.parent_phone ?? "",


dateOfBirth:
raw.dob ?? "",


governorate:
raw.governorate_id ?? 0,


address:
raw.address ?? "",


grade:
raw.grade_id ?? 0,


school:
raw.school ?? "",


section:
raw.department_name ?? "",



stats:{

courses:
raw.courses_count ?? 0,


points:
raw.points_number ?? 0,


rank:0

}

}

:
undefined;







if(isLoading){

return (

<div
className="
min-h-screen
flex
items-center
justify-center
"
>

<Loader2
className="
animate-spin
text-blue-600
"
/>

</div>

)

}





if(isError || !student){

return (

<div
className="
min-h-screen
flex
flex-col
items-center
justify-center
gap-4
"
>

<p>
Failed loading profile
</p>


<button

onClick={()=>refetch()}

className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
"

>

Retry

</button>


</div>

)

}








return (

<>


<ProfileHero student={student}/>


<ProfileTabs

active={activeTab}

onChange={setActiveTab}

/>



<section
className="
bg-gray-50
py-8
min-h-screen
"
>


<div
className="
container mx-auto px-4
"
>


<AnimatePresence mode="wait">


<motion.div

key={activeTab}

variants={tabVariants}

initial="hidden"

animate="visible"

exit="exit"

>



{
activeTab==="personal" &&

<PersonalTab
student={student}
/>

}




{
activeTab==="courses" &&

<CoursesTab

courses={
coursesResponse?.data ?? []
}

/>

}





{
activeTab==="tests" &&

<TestsTab

tests={
testsResponse?.data ?? []
}

/>

}





{
activeTab==="assignments" &&

<AssignmentsTab

assignments={
homeworkResponse?.data ?? []
}

/>

}





{
activeTab==="settings" &&

<SettingsTab

student={student}

onProfileUpdated={refetch}

/>

}



</motion.div>


</AnimatePresence>


</div>


</section>


<Footer/>


</>

)

}