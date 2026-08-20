import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, GraduationCapIcon, BookOpenIcon, FlaskConicalIcon } from "lucide-react";
import { useAuthStore } from "@/shared/stores/auth-store";
import type { User } from "@/shared/stores/auth-store";

// ─── Types ───

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// ─── Component ───

// ─── Mock users for dev preview ───
const DEV_USERS: { label: string; labelAr: string; icon: React.ElementType; color: string; user: User; path: string }[] = [
  {
    label: "Login as Teacher",
    labelAr: "دخول كمعلم",
    icon: GraduationCapIcon,
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    path: "/teacher",
    user: {
      id: "dev-teacher-1",
      name: "أ. محمد أحمد",
      email: "teacher@eduplatform.dev",
      role: "teacher",
    },
  },
  {
    label: "Login as Student",
    labelAr: "دخول كطالب",
    icon: BookOpenIcon,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    path: "/profile",
    user: {
      id: "dev-student-1",
      name: "سارة عمر",
      email: "student@eduplatform.dev",
      role: "student",
    },
  },
];

export function LoginForm() {
  const { t } = useTranslation("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devLoading, setDevLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    console.log("Login data:", data);
    // TODO: Replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  const handleDevLogin = async (entry: (typeof DEV_USERS)[0]) => {
    setDevLoading(entry.user.role);
    await new Promise((resolve) => setTimeout(resolve, 600));
    login(entry.user, "dev-access-token", "dev-refresh-token");
    navigate(entry.path);
    setDevLoading(null);
  };

  const inputBaseClass =
    "w-full pe-4 ps-11 py-3.5 bg-gray-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400";

  const getInputClass = (fieldName: keyof LoginFormValues) =>
    `${inputBaseClass} ${errors[fieldName] ? "border-red-300 bg-red-50/30" : "border-gray-200"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {t("login.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-gray-500"
        >
          {t("login.subtitle")}
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("login.email")}
          </label>
          <div className="relative">
            <Mail className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              {...register("email", {
                required: t("errors.emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("errors.emailInvalid"),
                },
              })}
              placeholder={t("login.emailPlaceholder")}
              className={getInputClass("email")}
              id="login-email"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {t("login.password")}
            </label>
            <button
              type="button"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {t("login.forgotPassword")}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: t("errors.passwordRequired"),
              })}
              placeholder={t("login.passwordPlaceholder")}
              className={`${getInputClass("password")} pe-11!`}
              id="login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("rememberMe")}
            id="remember-me"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="text-sm text-gray-600 cursor-pointer select-none"
          >
            {t("login.rememberMe")}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="login-submit"
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200/60 hover:shadow-xl hover:shadow-blue-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("login.submitting")}
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              {t("login.submit")}
            </>
          )}
        </button>
      </motion.form>

      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center mt-8 text-sm text-gray-500"
      >
        {t("login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("login.signUpLink")}
        </Link>
      </motion.p>

      {/* ─── Dev Preview Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-8"
      >
        {/* Divider */}
        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-amber-200" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
            <FlaskConicalIcon className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 whitespace-nowrap">
              Dev Preview
            </span>
          </div>
          <div className="flex-1 h-px bg-amber-200" />
        </div>

        <p className="text-center text-xs text-gray-400 mb-3">
          Quick access — no password needed
        </p>

        <div className="grid grid-cols-2 gap-3">
          {DEV_USERS.map((entry) => (
            <button
              key={entry.user.role}
              type="button"
              id={`dev-login-${entry.user.role}`}
              disabled={devLoading !== null}
              onClick={() => handleDevLogin(entry)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${entry.color}`}
            >
              {devLoading === entry.user.role ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <entry.icon className="w-5 h-5" />
              )}
              <div className="text-center">
                <p className="text-xs font-semibold leading-tight">{entry.label}</p>
                <p className="text-xs opacity-70 leading-tight">{entry.labelAr}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
