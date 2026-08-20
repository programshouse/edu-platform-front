import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ─── Translation Resources ───
import arCommon from "./locales/ar/common.json";
import arLanding from "./locales/ar/landing.json";
import arCourses from "./locales/ar/courses.json";
import arAbout from "./locales/ar/about.json";
import arContact from "./locales/ar/contact.json";
import arAuth from "./locales/ar/auth.json";
import arProfile from "./locales/ar/profile.json";
import arTeacher from "./locales/ar/teacher.json";
import arTeacherCourses from "./locales/ar/teacherCourses.json";
import arTeacherExams from "./locales/ar/teacherExams.json";
import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enCourses from "./locales/en/courses.json";
import enAbout from "./locales/en/about.json";
import enContact from "./locales/en/contact.json";
import enAuth from "./locales/en/auth.json";
import enProfile from "./locales/en/profile.json";
import enTeacher from "./locales/en/teacher.json";
import enTeacherCourses from "./locales/en/teacherCourses.json";
import enTeacherExams from "./locales/en/teacherExams.json";

const resources = {
  ar: {
    common: arCommon,
    landing: arLanding,
    courses: arCourses,
    about: arAbout,
    contact: arContact,
    auth: arAuth,
    profile: arProfile,
    teacher: arTeacher,
    teacherCourses: arTeacherCourses,
    teacherExams: arTeacherExams,
  },
  en: {
    common: enCommon,
    landing: enLanding,
    courses: enCourses,
    about: enAbout,
    contact: enContact,
    auth: enAuth,
    profile: enProfile,
    teacher: enTeacher,
    teacherCourses: enTeacherCourses,
    teacherExams: enTeacherExams,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    fallbackLng: "ar",
    defaultNS: "common",
    ns: ["common", "landing", "courses", "about", "contact", "auth", "profile", "teacher", "teacherCourses", "teacherExams"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "edu-platform-lang",
    },
  });

// ─── Direction Sync ───
const updateDocumentDirection = (lang: string) => {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  document.documentElement.style.fontFamily =
    lang === "ar"
      ? '"Almarai", "Segoe UI", Tahoma, sans-serif'
      : '"Inter", "Segoe UI", Tahoma, sans-serif';
};

// Set initial direction
updateDocumentDirection(i18n.language);

// Listen for language changes
i18n.on("languageChanged", updateDocumentDirection);

export default i18n;
