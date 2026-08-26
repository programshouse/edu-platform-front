import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getCategories } from "./api/categories-api";


type Category = {
  id: number;
  name: string;
  image: string | null;
};



export function CoursesPreview() {

  const { t } = useTranslation("landing");

  const navigate = useNavigate();



  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "landing",
      "categories",
    ],

    queryFn: getCategories,

  });



  const categories: Category[] =
    Array.isArray(data)
      ? data
      : data?.data ?? [];




  return (

    <section
      className="
        py-20
        bg-white
      "
    >

      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >


        {/* Header */}

        <div
          className="
            text-center
            mb-12
          "
        >

          <span
            className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-blue-50
              text-blue-600
              text-sm
              font-semibold
              mb-4
            "
          >

            {
              t(
                "courses.badge",
                {
                  defaultValue:"الدورات المميزة"
                }
              )
            }

          </span>



          <h2
            className="
              text-3xl
              md:text-5xl
              font-extrabold
              text-gray-900
            "
          >

            اختر المسار الذي يناسبك

          </h2>



          <p
            className="
              mt-4
              text-gray-500
              text-lg
            "
          >

            مجموعة متنوعة من الدورات التدريبية في أحدث المجالات التقنية

          </p>


        </div>





        {
          isLoading && (

            <div
              className="
                text-center
                text-gray-500
              "
            >
              Loading...
            </div>

          )
        }




        {
          isError && (

            <div
              className="
                text-center
                text-red-500
              "
            >
              Failed to load categories
            </div>

          )
        }





        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >



          {
            categories.map((category)=>(


              <motion.div

                key={category.id}


                initial={{
                  opacity:0,
                  y:20
                }}


                whileInView={{
                  opacity:1,
                  y:0
                }}


                viewport={{
                  once:true
                }}


                whileHover={{
                  y:-8
                }}


                onClick={() =>
                  navigate("/courses")
                }


                className="
                  cursor-pointer
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  hover:shadow-xl
                  transition-all
                  p-6
                  text-center
                "

              >




                {
                  category.image ? (

                    <img

                      src={category.image}

                      alt={`${category.id} - ${category.name}`}

                      className="
                        w-full
                        aspect-square
                        rounded-xl
                        object-cover
                        mb-5
                      "

                    />


                  ) : (

                    <div

                      className="
                        w-full
                        aspect-square
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        mb-5
                        text-4xl
                        font-bold
                      "

                    >

                      {
                        category.name.charAt(0)
                      }

                    </div>


                  )

                }





                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-800
                  "
                >

                  {
                    category.name
                  }

                </h3>


              </motion.div>


            ))
          }


        </div>



      </div>


    </section>

  );

}