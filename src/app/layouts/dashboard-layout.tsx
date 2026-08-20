import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

/**
 * Dashboard Layout — provides the SidebarProvider context.
 * Each role-specific page renders its own <Sidebar> + <SidebarInset>
 * as direct siblings, which is the correct shadcn composition pattern.
 */
export function DashboardLayout() {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
}
