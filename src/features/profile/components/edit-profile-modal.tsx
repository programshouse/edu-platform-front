import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";

// ─── Shared Constants (same as signup form) ────────────────────────────────

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

// ─── Types ─────────────────────────────────────────────────────────────────

interface StudentData {
  firstName: string;
  secondName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  parentPhone: string;
  governorate: string;
  address: string;
  grade: string;
  school: string;
  section: "arabic" | "english" | "languages";
  email: string;
}

// ─── Edit Modal ─────────────────────────────────────────────────────────────

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData;
}

export function EditProfileModal({ isOpen, onClose, student }: EditProfileModalProps) {
  const { t } = useTranslation("profile");
  const tAuth = useTranslation("auth").t;

  const [data, setData] = useState<StudentData>(student);

  const set = (field: keyof StudentData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const selectCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">{t("modal.title")}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["firstName", "secondName", "lastName"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t(`modal.${field}`)}</label>
                    <input
                      type="text"
                      value={data[field]}
                      onChange={(e) => set(field, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>

              {/* Date of Birth + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.dateOfBirth")}</label>
                  <input
                    type="date"
                    value={data.dateOfBirth}
                    onChange={(e) => set("dateOfBirth", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.phone")}</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Parent Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.parentPhone")}</label>
                  <input
                    type="tel"
                    value={data.parentPhone}
                    onChange={(e) => set("parentPhone", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.email")}</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Governorate + Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.governorate")}</label>
                  <div className="relative">
                    <select
                      value={data.governorate}
                      onChange={(e) => set("governorate", e.target.value)}
                      className={selectCls}
                    >
                      {GOVERNORATE_KEYS.map((key) => (
                        <option key={key} value={key}>{tAuth(`governorates.${key}`)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.address")}</label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) => set("address", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Grade + School */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.grade")}</label>
                  <div className="relative">
                    <select
                      value={data.grade}
                      onChange={(e) => set("grade", e.target.value)}
                      className={selectCls}
                    >
                      {GRADE_KEYS.map((key) => (
                        <option key={key} value={key}>{tAuth(`grades.${key}`)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("modal.school")}</label>
                  <input
                    type="text"
                    value={data.school}
                    onChange={(e) => set("school", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t("modal.section")}</label>
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
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {t("modal.cancel")}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("modal.save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Password Form ──────────────────────────────────────────────────────────

interface PasswordFormProps {
  labels: {
    current: string;
    new: string;
    confirm: string;
    update: string;
    hint: string;
  };
  onSubmit?: (data: { current: string; new: string; confirm: string }) => Promise<unknown> | unknown;
}

export function PasswordForm({ labels, onSubmit }: PasswordFormProps) {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [values, setValues] = useState({ current: "", new: "", confirm: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields: { key: keyof typeof show; label: string }[] = [
    { key: "current", label: labels.current },
    { key: "new", label: labels.new },
    { key: "confirm", label: labels.confirm },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setValues({ current: "", new: "", confirm: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
          <div className="relative">
            <input
              type={show[key] ? "text" : "password"}
              value={values[key]}
              onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
              required
              minLength={key === "current" ? undefined : 8}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pe-10"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => ({ ...prev, [key]: !prev[key] }))}
              className="absolute inset-y-0 inset-e-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400">{labels.hint}</p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : labels.update}
      </button>
    </form>
  );
}

