export const APP_CONFIG = {
  name: "EduPlatform",
  defaultLanguage: "ar" as const,
  supportedLanguages: ["ar", "en"] as const,
  api: {
    baseUrl:
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
    timeout: 15000,
  },
  auth: {
    accessTokenKey: "access_token",
    refreshTokenKey: "refresh_token",
    loginPath: "/login",
    defaultStudentPath: "/dashboard",
    defaultAdminPath: "/admin",
    defaultTeacherPath: "/teacher",
  },
  pagination: {
    defaultPageSize: 10,
  },
} as const;

export type SupportedLanguage = (typeof APP_CONFIG.supportedLanguages)[number];
export type UserRole = "student" | "admin" | "teacher";
