import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Mail,
  Phone,
  Pencil,
  BookOpen,
  Star,
  Trophy,
} from "lucide-react";

import { EditProfileModal } from "./edit-profile-modal";



interface StudentShape {

  id?:number;

  fullName?:string;

  email?:string;

  phone?:string;

  parentPhone?:string;

  dateOfBirth?:string;

  governorate?:number;

  address?:string;

  grade?:number;

  school?:string;

  section?:string;

  registeredAt?:string;


  stats?:{

    courses?:number;

    points?:number;

    rank?:number;

  };

}




interface ProfileHeroProps {

 student:StudentShape;

}





export function ProfileHero({
student
}:ProfileHeroProps){


const {t}=useTranslation("profile");


const [isModalOpen,setIsModalOpen]=useState(false);





const fullName =
student.fullName || "User";



const email =
student.email || "";



const phone =
student.phone || "";



const registeredAt =
student.registeredAt || "";



const courses =
student.stats?.courses ?? 0;



const points =
student.stats?.points ?? 0;



const rank =
student.stats?.rank ?? 0;





const initials =
fullName

.split(" ")

.map(word=>word.charAt(0))

.join("")

.substring(0,2)

.toUpperCase();







const stats=[


{

icon:BookOpen,

value:courses,

label:t("hero.stats.courses"),

color:"text-blue-600",

bg:"bg-blue-50",

ring:"ring-blue-100"

},


{

icon:Star,

value:points.toLocaleString(),

label:t("hero.stats.points"),

color:"text-amber-600",

bg:"bg-amber-50",

ring:"ring-amber-100"

},


{

icon:Trophy,

value:
rank > 0 ? `#${rank}` : "-",

label:t("hero.stats.rank"),

color:"text-emerald-600",

bg:"bg-emerald-50",

ring:"ring-emerald-100"

}


];







return (

<>


<div className="
relative
overflow-hidden
">


<div className="
absolute
inset-0
bg-linear-to-br
from-blue-700
via-blue-600
to-indigo-700
"/>



<div className="
relative
container
mx-auto
px-4
py-10
lg:py-14
">


<div className="
flex
flex-col
sm:flex-row
items-center
gap-6
">





{/* Avatar */}


<motion.div

initial={{
opacity:0,
scale:.85
}}

animate={{
opacity:1,
scale:1
}}

className="
relative
"

>


<div className="
w-32
h-32
rounded-2xl
bg-white/20
ring-4
ring-white/30
flex
items-center
justify-center
"

>


<span className="
text-4xl
font-bold
text-white
">

{initials}

</span>


</div>


<div className="
absolute
bottom-0
right-0
w-5
h-5
bg-emerald-400
rounded-full
ring-2
ring-white
"/>


</motion.div>







{/* Information */}


<div className="
flex-1
text-center
sm:text-start
">


<h1 className="
text-3xl
font-bold
text-white
">

{fullName}

</h1>





<div className="
flex
flex-col
sm:flex-row
gap-4
mt-3
text-blue-100
text-sm
">


{
email &&

<span className="
flex
items-center
gap-2
">

<Mail className="w-4 h-4"/>

{email}

</span>

}





{
phone &&

<span className="
flex
items-center
gap-2
">

<Phone className="w-4 h-4"/>

{phone}

</span>

}






{
registeredAt &&

<span className="
flex
items-center
gap-2
">

<CalendarDays className="w-4 h-4"/>

{registeredAt}

</span>

}



</div>


</div>







<button

onClick={()=>setIsModalOpen(true)}

className="
flex
items-center
gap-2
px-5
py-2.5
rounded-xl
bg-white/20
text-white
font-semibold
"

>

<Pencil className="w-4 h-4"/>

{t("hero.editProfile")}

</button>




</div>









{/* Stats */}


<div className="
grid
grid-cols-3
gap-3
mt-8
">


{

stats.map(
(item,index)=>{


const Icon=item.icon;


return (

<div

key={index}

className="
bg-white/10
rounded-2xl
p-4
flex
flex-col
items-center
"

>


<div className={`
w-10
h-10
rounded-xl
${item.bg}
flex
items-center
justify-center
`}>

<Icon
className={`
w-5
h-5
${item.color}
`}
/>


</div>



<p className="
text-xl
font-bold
text-white
mt-2
">

{item.value}

</p>



<p className="
text-xs
text-blue-100
">

{item.label}

</p>


</div>

)


}

)

}



</div>






</div>


</div>







<EditProfileModal

isOpen={isModalOpen}

onClose={()=>
setIsModalOpen(false)
}

student={{

fullName:
student.fullName || "",

email:
student.email || "",

phone:
student.phone || "",

parentPhone:
student.parentPhone || "",

dateOfBirth:
student.dateOfBirth || "",

governorate:
student.governorate || 0,

address:
student.address || "",

grade:
student.grade || 0,

school:
student.school || "",

section:
student.section || ""

}}


/>





</>

)

}