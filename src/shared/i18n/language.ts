export type AppLanguage = "ar" | "en";

export const getAppLanguage = (): AppLanguage => {
  const value =
    localStorage.getItem("edu-platform-lang") ||
    localStorage.getItem("i18nextLng") ||
    "ar";

  return value.toLowerCase().startsWith("ar") ? "ar" : "en";
};
