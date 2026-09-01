import { useTranslation } from "react-i18next";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { platformApi } from "./api/platform-api";


function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);

  const rounded = useTransform(
    motionValue,
    (v) => Math.round(v)
  );


  useEffect(() => {
    if (isInView) {
      animate(
        motionValue,
        value,
        {
          duration: 2,
          ease: "easeOut",
        }
      );
    }
  }, [
    isInView,
    motionValue,
    value,
  ]);


  useEffect(() => {
    const unsubscribe = rounded.on(
      "change",
      (v) => {
        if (ref.current) {
          ref.current.textContent =
            v.toLocaleString() + suffix;
        }
      }
    );

    return unsubscribe;
  }, [
    rounded,
    suffix,
  ]);


  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}



export function StatsSection() {

  const { t } = useTranslation("landing");


  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "platform-statistics",
    ],
    queryFn:
      platformApi.statistics,
  });



  const parseNumber = (
    value?: string
  ) => {
    if (!value) return 0;

    return Number(
      value.replace(/\D/g, "")
    );
  };



  const stats = [
    {
      icon: Users,

      value: parseNumber(
        data?.students_count
      ),

      suffix: "+",

      label:
        t("stats.students"),

      gradient:
        "from-blue-500 to-blue-600",
    },


    {
      icon: BookOpen,

      value: parseNumber(
        data?.courses_count
      ),

      suffix: "+",

      label:
        t("stats.courses"),

      gradient:
        "from-emerald-500 to-emerald-600",
    },


    {
      icon: Clock,

      value: parseNumber(
        data?.total_hours
      ),

      suffix:
        " hours",

      label:
        t("stats.hours"),

      gradient:
        "from-purple-500 to-purple-600",
    },


    {
      icon: TrendingUp,

      value: parseNumber(
        data?.success_rate
      ),

      suffix:
        "%",

      label:
        t("stats.successRate"),

      gradient:
        "from-amber-500 to-orange-500",
    },
  ];



  return (

    <section
      className="
      py-20 
      lg:py-28
      bg-gradient-to-br
      from-gray-900
      via-blue-950
      to-gray-900
      relative
      overflow-hidden
      "
    >


      {/* Background Glow */}

      <div
        className="
        absolute
        inset-0
        pointer-events-none
        "
      >

        <div
          className="
          absolute
          top-1/4
          start-1/4
          w-72
          h-72
          bg-blue-500/10
          rounded-full
          blur-3xl
          "
        />


        <div
          className="
          absolute
          bottom-1/4
          end-1/4
          w-72
          h-72
          bg-purple-500/10
          rounded-full
          blur-3xl
          "
        />

      </div>



      <div
        className="
        container
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        relative
        z-10
        "
      >


        <div
          className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-6
          lg:gap-8
          "
        >


          {stats.map(
            (stat,index)=>(

            <motion.div

              key={index}

              initial={{
                opacity:0,
                y:30
              }}

              whileInView={{
                opacity:1,
                y:0
              }}

              viewport={{
                once:true
              }}

              transition={{
                duration:.5,
                delay:index*.1
              }}

              className="
              group
              relative
              "
            >


              <div
                className="
                bg-white/5
                backdrop-blur-sm
                border
                border-white/10
                rounded-2xl
                p-6
                lg:p-8
                text-center
                hover:bg-white/10
                hover:border-white/20
                transition-all
                duration-300
                "
              >


                <div
                  className={`
                  inline-flex
                  items-center
                  justify-center
                  w-14
                  h-14
                  rounded-xl
                  bg-gradient-to-br
                  ${stat.gradient}
                  mb-4
                  shadow-lg
                  `}
                >

                  <stat.icon
                    className="
                    w-7
                    h-7
                    text-white
                    "
                  />

                </div>



                <div
                  className="
                  text-3xl
                  lg:text-4xl
                  font-extrabold
                  text-white
                  mb-2
                  "
                >

                  <AnimatedCounter

                    value={
                      isLoading
                        ? 0
                        : stat.value
                    }

                    suffix={
                      stat.suffix
                    }

                  />

                </div>



                <p
                  className="
                  text-sm
                  text-blue-200/70
                  font-medium
                  "
                >
                  {stat.label}
                </p>


              </div>


            </motion.div>

          ))}


        </div>


      </div>


    </section>

  );
}