export interface Exam {
  id:number;
  course_id:number;
  course_title:string;
  lecture_title?:string|null;
  title:string;
  full_mark:number;
  duration:string;
  max_attempts:number;
  questions_count:number;
}
