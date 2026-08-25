import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { UserRole } from "@/shared/config/constants";


interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}


export function RoleGuard({
  children,
  allowedRoles
}: RoleGuardProps) {


  const user = useAuthStore(
    (state) => state.user
  );


  const role =
    user?.role?.toLowerCase();



  const normalizedAllowedRoles =
    allowedRoles.map(
      (r) => r.toLowerCase()
    );



  const hasPermission =
    role &&
    normalizedAllowedRoles.includes(role);



  if (
    !user ||
    !hasPermission
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }


  return (
    <>
      {children}
    </>
  );

}