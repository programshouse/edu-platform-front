import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  GraduationCap,
  Menu,
  X,
  Globe,
  UserCircle,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";

import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";
import { authApi } from "@/features/auth/api/auth-api";
import { toast } from "sonner";


export function PublicLayout() {

  const { t, i18n } = useTranslation("common");

  const [isMobileMenuOpen,setIsMobileMenuOpen] =
    useState(false);

  const location = useLocation();

  const navigate = useNavigate();


  const user = useAuthStore(
    (state)=>state.user
  );


  const logout = useAuthStore(
    (state)=>state.logout
  );


  // FIX ROLE CHECK
  const role =
    user?.role?.toLowerCase();


  const isInstructor =
    role === "instructor" ||
    role === "teacher";


  const isStudent =
    role === "student";


  const isLoggedIn =
    !!user;



  const navLinks = [

    {
      href:"/",
      label:t("nav.home")
    },

    {
      href:"/courses",
      label:t("nav.courses")
    },

    {
      href:"/about",
      label:t("nav.about")
    },

    {
      href:"/contact",
      label:t("nav.contact")
    },

  ];



  const toggleLanguage =()=>{

    const newLang =
      i18n.language==="ar"
      ?"en"
      :"ar";

    i18n.changeLanguage(newLang);

  };



  const handleLogout = async()=>{

    try{

      await authApi.logout();

    }
    catch(error){

      console.error(error);

    }
    finally{

      logout();

      setIsMobileMenuOpen(false);

      toast.success(
        t("nav.logout")
      );

      navigate(
        "/login",
        {
          replace:true
        }
      );

    }

  };



return (

<div className="min-h-screen flex flex-col">


<header
className="
sticky
top-0
z-50
w-full
bg-white/80
backdrop-blur-lg
border-b
"
>


<div className="
container
mx-auto
px-4
sm:px-6
lg:px-8
">


<div className="
flex
h-16
items-center
justify-between
">


{/* LOGO */}

<Link
to="/"
className="
flex
items-center
gap-2
"
>

<div
className="
w-9
h-9
rounded-lg
bg-blue-600
flex
items-center
justify-center
"
>

<GraduationCap
className="
w-5
h-5
text-white
"
/>

</div>


<span
className="
text-xl
font-bold
text-blue-600
"
>

EduPlatform

</span>


</Link>





{/* DESKTOP NAV */}

<nav
className="
hidden
md:flex
items-center
gap-1
"
>

{
navLinks.map(link=>(

<Link

key={link.href}

to={link.href}

className={cn(

"px-4 py-2 text-sm rounded-lg",

location.pathname===link.href

?
"text-blue-600 bg-blue-50"

:

"text-gray-600 hover:text-blue-600"

)}

>

{link.label}

</Link>

))

}

</nav>





{/* ACTIONS */}

<div
className="
hidden
md:flex
items-center
gap-2
"
>


<button

onClick={toggleLanguage}

className="
flex
items-center
gap-1
px-3
py-2
text-sm
"

>

<Globe
className="
w-4
h-4
"
/>

{
i18n.language==="ar"
?
t("language.en")
:
t("language.ar")
}

</button>





{
isLoggedIn ? (

<>


{/* Instructor Dashboard */}

{
isInstructor && (

<Link

to="/teacher"

className={cn(

"flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg",

location.pathname.startsWith("/teacher")

?
"text-blue-600 bg-blue-50"

:

"text-gray-600 hover:text-blue-600"

)}

>

<LayoutDashboardIcon
className="w-4 h-4"
/>

{t("nav.dashboard")}

</Link>

)

}






{/* Student Profile */}

{
isStudent && (

<Link

to="/profile"

className="
flex
items-center
gap-1
px-3
py-2
"

>

<UserCircle
className="w-4 h-4"
/>

{t("nav.profile")}

</Link>

)

}





<button

onClick={handleLogout}

className="
flex
items-center
gap-1
text-red-600
px-3
py-2
"

>

<LogOutIcon
className="w-4 h-4"
/>

{t("nav.logout")}

</button>


</>


)

:

(

<>

<Link
to="/login"
className="px-4 py-2"
>

{t("nav.login")}

</Link>


<Link

to="/register"

className="
px-5
py-2
bg-blue-600
text-white
rounded-lg
"

>

{t("nav.register")}

</Link>


</>

)

}



</div>





{/* MOBILE BUTTON */}

<button

className="
md:hidden
"

onClick={()=>
setIsMobileMenuOpen(
!isMobileMenuOpen
)
}

>

{
isMobileMenuOpen

?

<X/>

:

<Menu/>

}

</button>



</div>


</div>


</header>




<main className="flex-1">

<Outlet/>

</main>



</div>

);

}