import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Lock, Save, ChevronDown, Loader2 } from "lucide-react";
import { PasswordForm } from "./edit-profile-modal";
import { authApi } from "@/features/auth/api/auth-api";

// ─── Constants ─────────────────────────────────────────────────────────────

const GOVERNORATE_KEYS = [
  "cairo", "giza", "alexandria", "dakahlia", "sharqia", "monufia",
  "qalyubia", "beheira", "gharbia", "kafr_el_sheikh", "damietta",
  "port_said", "ismailia", "suez", "north_sinai", "south_sinai",
  "beni_suef", "fayoum", "minya", "asyut", "sohag", "qena",
  "luxor", "aswan", "red_sea", "new_valley", "matrouh",
] as const;

const GRADE_KEYS = [
  "grade_1_prep", "grade_2_prep", "grade_3_prep",
  "grade_1_sec", "grade_2_sec", "grade_3_sec",
] as const;

// ─── Props Interface ────────────────────────────────────────────────────────

export interface StudentSettings {
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  phone: string;
  parentPhone: string;
  dateOfBirth: string;
  governorate: string;
  address: string;
  grade: string;
  school: string;
  section: "arabic" | "english" | "languages";
}

interface SettingsTabProps {
  student: StudentSettings;
  onProfileUpdated?: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Settings Tab Component ──────────────────────────────────────────────────

export function SettingsTab({ student, onProfileUpdated }: SettingsTabProps) {
  const { t } = useTranslation("profile");
  const { t: tAuth } = useTranslation("auth");
  const queryClient = useQueryClient();

  const [data, setData] = useState<StudentSettings>(student);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync internal state whenever the fetched student prop updates/refetches
  useEffect(() => {
    if (student) {
      setData(student);
    }
  }, [student]);

  const set = (field: keyof StudentSettings, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  // ── Mutation: Update Profile ───────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => authApi.updateProfile(formData),
    onSuccess: (res) => {
      setSuccessMessage(res?.message || t("settings.updateSuccess", "Profile updated successfully"));
      setErrorMessage(null);
      
      // Invalidate global query cache to force immediate UI refresh across all tabs
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      
      if (onProfileUpdated) {
        onProfileUpdated();
      }
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.message || t("settings.updateError", "Failed to update profile"));
      setSuccessMessage(null);
    },
  });

  // ── Mutation: Change Password ─────────────────────────────────────────────
  const changePasswordMutation = useMutation({
    mutationFn: (formData: FormData) => authApi.changePassword(formData),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    // Appending form values with fallback keys (snake_case and camelCase compatibility)
    formData.append("first_name", data.firstName || "");
    formData.append("second_name", data.secondName || "");
    formData.append("last_name", data.lastName || "");
    formData.append("email", data.email || "");
    formData.append("phone", data.phone || "");
    formData.append("parent_phone", data.parentPhone || "");
    formData.append("date_of_birth", data.dateOfBirth || "");
    formData.append("governorate", data.governorate || "");
    formData.append("address", data.address || "");
    formData.append("grade", data.grade || "");
    formData.append("school", data.school || "");
    formData.append("section", data.section || "");

    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = async (passwordData: { current: string; new: string; confirm: string }) => {
    const formData = new FormData();
    formData.append("current_password", passwordData.current);
    formData.append("new_password", passwordData.new);
    formData.append("new_password_confirmation", passwordData.confirm);

    return changePasswordMutation.mutateAsync(formData);
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const selectCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer";

  const passwordLabels = {
    current: t("settings.currentPassword"),
    new: t("settings.newPassword"),
    confirm: t("settings.confirmPassword"),
    update: t("settings.updatePassword"),
    hint: t("settings.passwordHint"),
  };

  return (
    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-x-4">
      {/* ── Edit Personal Data Form ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">{t("settings.editTitle")}</h2>
        </div>

        {/* Feedback Alert Banners */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleProfileSubmit}>
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["firstName", "secondName", "lastName"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t(`settings.${field}`)}
                </label>
                <input
                  id={`settings-${field}`}
                  type="text"
                  value={data[field] || ""}
                  onChange={(e) => set(field, e.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          {/* Date of Birth + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.dateOfBirth")}
              </label>
              <input
                id="settings-dob"
                type="date"
                value={data.dateOfBirth || ""}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.phone")}
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={data.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Parent Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.parentPhone")}
              </label>
              <input
                id="settings-parent-phone"
                type="tel"
                value={data.parentPhone || ""}
                onChange={(e) => set("parentPhone", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.email")}
              </label>
              <input
                id="settings-email"
                type="email"
                value={data.email || ""}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Governorate + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.governorate")}
              </label>
              <div className="relative">
                <select
                  id="settings-governorate"
                  value={data.governorate || ""}
                  onChange={(e) => set("governorate", e.target.value)}
                  className={selectCls}
                >
                  {GOVERNORATE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {tAuth(`governorates.${key}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.address")}
              </label>
              <input
                id="settings-address"
                type="text"
                value={data.address || ""}
                onChange={(e) => set("address", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Grade + School */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.grade")}
              </label>
              <div className="relative">
                <select
                  id="settings-grade"
                  value={data.grade || ""}
                  onChange={(e) => set("grade", e.target.value)}
                  className={selectCls}
                >
                  {GRADE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {tAuth(`grades.${key}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("settings.school")}
              </label>
              <input
                id="settings-school"
                type="text"
                value={data.school || ""}
                onChange={(e) => set("school", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("settings.section")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["arabic", "languages"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    data.section === value
                      ? "border-blue-500 bg-blue-50/60 text-blue-700"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={data.section === value}
                    onChange={() => set("section", value)}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">
                    {tAuth(`signup.section${value.charAt(0).toUpperCase() + value.slice(1)}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            id="settings-save-btn"
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("settings.saveChanges")}
          </button>
        </form>
      </motion.div>

      {/* ── Change Password Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Lock className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">{t("settings.passwordTitle")}</h2>
        </div>
        <PasswordForm labels={passwordLabels} onSubmit={handlePasswordSubmit} />
      </motion.div>
    </div>
  );
}