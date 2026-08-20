import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Menu,
  X,
  Globe,
  UserCircle,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/auth-store";

export function PublicLayout() {
  const { t, i18n } = useTranslation("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth state
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";
  const isLoggedIn = !!user;

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.courses") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    location.pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language switcher — always visible */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                <Globe className="w-4 h-4" />
                {i18n.language === "ar" ? t("language.en") : t("language.ar")}
              </button>

              {isLoggedIn ? (
                <>
                  {/* Student → Profile link */}
                  {isStudent && (
                    <Link
                      to="/profile"
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        location.pathname === "/profile"
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      )}
                    >
                      <UserCircle className="w-4 h-4" />
                      {t("nav.profile")}
                    </Link>
                  )}

                  {/* Teacher → Dashboard link */}
                  {isTeacher && (
                    <Link
                      to="/teacher"
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        location.pathname.startsWith("/teacher")
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      )}
                    >
                      <LayoutDashboardIcon className="w-4 h-4" />
                      {t("nav.dashboard")}
                    </Link>
                  )}

                  {/* Logout — both roles */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  {/* Guest → Login + Register */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === link.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                {/* Language switcher */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <Globe className="w-4 h-4" />
                  {i18n.language === "ar" ? t("language.en") : t("language.ar")}
                </button>

                {isLoggedIn ? (
                  <>
                    {/* Student → Profile */}
                    {isStudent && (
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg",
                          location.pathname === "/profile"
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <UserCircle className="w-4 h-4" />
                        {t("nav.profile")}
                      </Link>
                    )}

                    {/* Teacher → Dashboard */}
                    {isTeacher && (
                      <Link
                        to="/teacher"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg",
                          location.pathname.startsWith("/teacher")
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <LayoutDashboardIcon className="w-4 h-4" />
                        {t("nav.dashboard")}
                      </Link>
                    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      {t("nav.logout")}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest → Login + Register */}
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg text-center"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-700 rounded-lg text-center"
                    >
                      {t("nav.register")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
