import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/shared/stores/auth-store";

export function useDirection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return { isRTL, direction: isRTL ? "rtl" : "ltr" } as const;
}

export function useAuth() {
  const { user, isAuthenticated, login, logout, clearAuth } = useAuthStore();
  return { user, isAuthenticated, login, logout, clearAuth };
}
