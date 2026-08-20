import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  GraduationCapIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  GlobeIcon,
  LogOutIcon,
  ClipboardListIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { useAuthStore } from "@/shared/stores/auth-store";

export function TeacherSidebar() {
  const { t, i18n } = useTranslation("teacher");
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      title: t("sidebar.overview"),
      url: "/teacher",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      title: t("sidebar.courses"),
      url: "/teacher/courses",
      icon: BookOpenIcon,
      exact: false,
    },
    {
      title: t("sidebar.exams", "Exams"),
      url: "/teacher/exams",
      icon: ClipboardListIcon,
      exact: false,
    },
  ];

  // const secondaryItems = [
  //   // { title: t("sidebar.notifications"), url: "/teacher/notifications", icon: BellIcon },
  //   // { title: t("sidebar.settings"),      url: "/teacher/settings",      icon: SettingsIcon },
  // ];

  const isActive = (url: string, exact = false) =>
    exact ? location.pathname === url : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      {/* ── Brand header ── */}
      <SidebarHeader className="pb-0 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <Link
            to="/"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            {i18n.language === "ar" ? (
              <ArrowRightIcon className="size-4" />
            ) : (
              <ArrowLeftIcon className="size-4" />
            )}
          </Link>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200">
            <GraduationCapIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm text-blue-600">EduPlatform</span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
              {user?.name ?? "Teacher"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Main navigation ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {t("sidebar.main")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600 data-[active=true]:font-semibold"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleLanguage}
              tooltip={i18n.language === "ar" ? "English" : "العربية"}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <GlobeIcon />
              <span>{i18n.language === "ar" ? "English" : "العربية"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={t("sidebar.logout")}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOutIcon />
              <span>{t("sidebar.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="group-data-[collapsible=icon]:hidden px-2 pt-2 mt-2 border-t border-sidebar-border border-dashed">
          <p className="text-[10px] text-gray-400 text-center">
            EduPlatform © 2025
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
