/**
 * Instructor Courses API layer.
 *
 * Real backend only - no mock/static data.
 *
 * API:
 * GET    /instructor/courses
 * GET    /courses/:id/details
 * POST   /store-course
 * POST   /courses/:id/edit-course
 * DELETE /courses/:id/delete-course
 */

import { axiosInstance, parseApiError } from "@/shared/api";
import type { PaginatedResponse } from "@/shared/api";

import type {
  Course,
  CoursesQueryParams,
  CreateCoursePayload,
  UpdateCoursePayload,
  ToggleCourseStatusPayload,
} from "../types";


const BASE = "/instructor/courses";



// ─────────────────────────────────────────────
// Fetch Instructor Courses
// ─────────────────────────────────────────────

export async function fetchCourses(
  params: Partial<CoursesQueryParams> = {}
): Promise<PaginatedResponse<Course>> {

  try {

    const { data } = await axiosInstance.get<any>(
      BASE,
      {
        params:{
          page: params.page,
          pageSize: params.pageSize,
          search: params.search || undefined,
          status: params.status || undefined,

          priceMin:
            params.priceMin !== ""
              ? params.priceMin
              : undefined,

          priceMax:
            params.priceMax !== ""
              ? params.priceMax
              : undefined,

          dateFrom:
            params.dateFrom || undefined,

          dateTo:
            params.dateTo || undefined,
        }
      }
    );



    if(Array.isArray(data?.data)){

      return {

        data:data.data.map(normalizeCourse),

        meta:{
          page:1,
          pageSize:data.data.length,
          total:data.data.length,
          totalPages:1,
        }

      };

    }



    return data;



  }catch(err){

    throw parseApiError(err);

  }

}




// ─────────────────────────────────────────────
// Get Single Course Details
// ─────────────────────────────────────────────

export async function fetchCourse(
  id:string
):Promise<Course>{


  try{


    const {data}=

      await axiosInstance.get<{data:any}>(

        `/courses/${id}/details`

      );



    return normalizeCourse(data.data);



  }catch(err){


    throw parseApiError(err);


  }


}






// ─────────────────────────────────────────────
// Create Course
// ─────────────────────────────────────────────

export async function createCourse(
  payload:CreateCoursePayload
):Promise<Course>{


try{


const formData =
buildFormData(payload);



const {data}=

await axiosInstance.post<{data:Course}>(

"/store-course",

formData,

{

headers:{

"Content-Type":
"multipart/form-data"

}

}

);



return normalizeCourse(data.data);



}catch(err){

throw parseApiError(err);

}


}






// ─────────────────────────────────────────────
// Update Course
// ─────────────────────────────────────────────

export async function updateCourse(
payload:UpdateCoursePayload
):Promise<Course>{


try{


const {
id,
...courseData
}=payload;



const formData =
buildFormData(
courseData as CreateCoursePayload
);



const {data}=

await axiosInstance.post<{data:Course}>(

`/courses/${id}/edit-course`,

formData,

{

headers:{

"Content-Type":
"multipart/form-data"

}

}

);



return normalizeCourse(data.data);



}catch(err){

throw parseApiError(err);

}


}







// ─────────────────────────────────────────────
// Delete Course
// ─────────────────────────────────────────────

export async function deleteCourse(
id:string
):Promise<void>{


try{


await axiosInstance.delete(

`/courses/${id}/delete-course`

);



}catch(err){

throw parseApiError(err);

}


}








// ─────────────────────────────────────────────
// Toggle Course Status
// ─────────────────────────────────────────────

export async function toggleCourseStatus(

payload:ToggleCourseStatusPayload

):Promise<Course>{


try{


const {data}=

await axiosInstance.patch<{data:Course}>(

`${BASE}/${payload.id}/status`,

{

status:payload.status

}

);



return normalizeCourse(data.data);



}catch(err){

throw parseApiError(err);

}


}









// ─────────────────────────────────────────────
// Normalize API Course
// ─────────────────────────────────────────────

function normalizeCourse(
raw:any
):Course{


return {


id:String(raw.id),



title:

raw.title ??

"",



description:

raw.description ??

"",



coverImage:

raw.image ??

raw.coverImage ??

null,



categoryId:

raw.category_id ??

raw.categoryId ??

undefined,



categoryName:

raw.category_name ??

raw.categoryName ??

"",



price:

Number(
raw.price ?? 0
),



level:

raw.level ??

"beginner",



accessDurationDays:

Number(

raw.access_duration_days ??

raw.accessDurationDays ??

0

),



totalDurationMinutes:

Number(

raw.total_duration_minutes ??

raw.totalDurationMinutes ??

0

),



startDate:

raw.start_date ??

raw.startDate ??

"",



endDate:

raw.end_date ??

raw.endDate ??

"",



lecturesCount:

Number(

raw.lectures_count ??

raw.lecturesCount ??

0

),



enrolledStudentsCount:

Number(

raw.students_count ??

raw.enrolledStudentsCount ??

0

),



status:

raw.status ??

"active",




allowSeparateLectures:

raw.lectures_can_be_purchased_separately === 1 ||

raw.lectures_can_be_purchased_separately === true ||

raw.allowSeparateLectures === true,




createdAt:

raw.created_at ??

raw.createdAt ??

"",



updatedAt:

raw.updated_at ??

raw.updatedAt ??

"",


};


}









// ─────────────────────────────────────────────
// Build Form Data
// ─────────────────────────────────────────────

function buildFormData(

payload:Partial<CreateCoursePayload>

):FormData{


const fd = new FormData();



if(payload.titleEn !== undefined)

fd.append(
"title_en",
payload.titleEn
);



if(payload.titleAr !== undefined)

fd.append(
"title_ar",
payload.titleAr
);



if(payload.descriptionEn !== undefined)

fd.append(
"description_en",
payload.descriptionEn
);



if(payload.descriptionAr !== undefined)

fd.append(
"description_ar",
payload.descriptionAr
);



if(payload.categoryId !== undefined)

fd.append(
"category_id",
String(payload.categoryId)
);



if(payload.price !== undefined)

fd.append(
"price",
String(payload.price)
);



if(payload.level !== undefined)

fd.append(
"level",
payload.level
);



if(payload.accessDurationDays !== undefined)

fd.append(

"access_duration_days",

String(payload.accessDurationDays)

);



if(payload.totalDurationMinutes !== undefined)

fd.append(

"total_duration_minutes",

String(payload.totalDurationMinutes)

);



if(payload.startDate !== undefined)

fd.append(

"start_date",

payload.startDate

);



if(payload.endDate !== undefined && payload.endDate !== "")

fd.append(

"end_date",

payload.endDate

);



if(payload.allowSeparateLectures !== undefined)

fd.append(

"lectures_can_be_purchased_separately",

payload.allowSeparateLectures
? "1"
: "0"

);



if(payload.coverImage instanceof File)

fd.append(

"image",

payload.coverImage

);



return fd;


}