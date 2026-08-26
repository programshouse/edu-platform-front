import {
  Link
} from "react-router-dom";


import {
  ClockIcon,
  ExternalLinkIcon,
} from "lucide-react";


import {
  useTranslation
} from "react-i18next";


import {
  cn
} from "@/shared/lib/utils";


import {
  useInstructorStatistics
} from "../hooks/use-instructor-statistics";



interface ActivityItem {

  id:string;

  name:string;

  detail:string;

  timeAgo?:string;

  extra?:string;

  status?:
    | "paid"
    | "pending";

}




const AVATAR_COLORS=[

"bg-blue-100 text-blue-700",

"bg-violet-100 text-violet-700",

"bg-emerald-100 text-emerald-700",

"bg-amber-100 text-amber-700",

];





interface ActivityListProps {

 title:string;

 items:ActivityItem[];

 showStatus?:boolean;

 linkTo?:string;

}





function ActivityList({

 title,

 items,

 showStatus,

 linkTo="#"

}:ActivityListProps){


const {t}=useTranslation("teacher");



return (

<div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">


<div className="flex items-center justify-between px-5 py-4 border-b">


<h3 className="text-sm font-semibold">

{title}

</h3>



<Link
to={linkTo}
className="flex items-center gap-1 text-xs text-blue-600"
>

{t("activity.viewAll")}

<ExternalLinkIcon className="size-3"/>

</Link>


</div>





<div>


{
items.length === 0 ?

<div className="p-5 text-sm text-gray-400 text-center">

No data

</div>


:

items.map((item,index)=>(


<div
key={item.id}
className={cn(
"flex items-center gap-3 px-5 py-3",
index < items.length-1 &&
"border-b"
)}
>


<div
className={cn(
"flex size-8 items-center justify-center rounded-full text-xs font-bold",
AVATAR_COLORS[index%4]
)}
>

{item.name.charAt(0)}

</div>





<div className="flex-1">


<p className="text-sm font-medium">

{item.name}

</p>


<p className="text-xs text-gray-400">

{item.detail}

</p>


</div>





<div className="text-xs text-gray-400">


{
item.timeAgo &&

<div className="flex gap-1 items-center">

<ClockIcon className="size-3"/>

{item.timeAgo}

</div>

}



{
item.extra &&

<span className="text-blue-600 font-semibold">

{item.extra}

</span>

}



</div>


</div>


))

}



</div>



</div>

);


}







export function LatestActivity(){


const {t}=useTranslation("teacher");



const {

data,

isLoading

}=useInstructorStatistics();





if(isLoading){

return (

<div className="p-5">

Loading...

</div>

);

}






const subscriptions:ActivityItem[] =

data?.courses?.map((course:any)=>(


{

id:String(course.id),

name:
course.title,


detail:
`${course.active_subscriptions_count} students subscribed`,


timeAgo:
"",

}


)) || [];





const students:ActivityItem[]=[];


const payments:ActivityItem[]=[];







return (

<section>


<h2 className="text-base font-semibold mb-4">

{t("activity.title")}

</h2>





<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">



<ActivityList

title={
t("activity.latestSubscriptions")
}

items={
subscriptions
}

linkTo="/teacher/courses"

/>




<ActivityList

title={
t("activity.latestStudents")
}

items={
students
}

linkTo="/teacher/students"

/>





<ActivityList

title={
t("activity.latestPayments")
}

items={
payments
}

showStatus

linkTo="/teacher/earnings"

/>




</div>



</section>

);


}