import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/auth-store";
import { APP_CONFIG } from "@/shared/config/constants";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={APP_CONFIG.auth.loginPath} replace />;
  }

  return <>{children}</>;
}
