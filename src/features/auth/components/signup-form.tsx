import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  User,
  Phone,
  MapPin,
  GraduationCap,
  School,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
} from "lucide-react";

// ─── Constants ───

const GOVERNORATE_KEYS = [
  "cairo",
  "giza",
  "alexandria",
  "dakahlia",
  "sharqia",
  "monufia",
  "qalyubia",
  "beheira",
  "gharbia",
  "kafr_el_sheikh",
  "damietta",
  "port_said",
  "ismailia",
  "suez",
  "north_sinai",
  "south_sinai",
  "beni_suef",
  "fayoum",
  "minya",
  "asyut",
  "sohag",
  "qena",
  "luxor",
  "aswan",
  "red_sea",
  "new_valley",
  "matrouh",
] as const;

const GRADE_KEYS = [
  "grade_1_prep",
  "grade_2_prep",
  "grade_3_prep",
  "grade_1_sec",
  "grade_2_sec",
  "grade_3_sec",
] as const;

// ─── Types ───

type SignupFormValues = {
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
  section: "arabic" | "languages" | "";
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const STEP_FIELDS: Record<number, (keyof SignupFormValues)[]> = {
  1: [
    "firstName",
    "secondName",
    "lastName",
    "dateOfBirth",
    "phone",
    "parentPhone",
    "governorate",
    "address",
  ],
  2: ["grade", "school", "section"],
  3: ["email", "password", "confirmPassword", "acceptTerms"],
};

// ─── Slide animation variants ───

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// ─── Step Indicator ───

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "#3b82f6"
                    : isActive
                      ? "#3b82f6"
                      : "#e5e7eb",
                }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isCompleted || isActive
                    ? "text-white shadow-lg shadow-blue-200/60"
                    : "text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4.5 h-4.5" />
                ) : (
                  <step.icon className="w-4.5 h-4.5" />
                )}
              </motion.div>
              <span
                className={`mt-1.5 text-xs font-medium transition-colors duration-300 ${
                  isCompleted || isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="w-12 sm:w-16 h-0.5 mx-1 mb-5 relative">
                <div className="absolute inset-0 bg-gray-200 rounded-full" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-blue-500 rounded-full origin-start"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ───

export function SignupForm() {
  const { t } = useTranslation("auth");
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      secondName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      parentPhone: "",
      governorate: "",
      address: "",
      grade: "",
      school: "",
      section: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  const passwordValue = watch("password");

  const steps = [
    { label: t("signup.step1Title"), icon: User },
    { label: t("signup.step2Title"), icon: GraduationCap },
    { label: t("signup.step3Title"), icon: Lock },
  ];

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = await trigger(fields);
    if (valid) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (!data.acceptTerms) return;
    setIsSubmitting(true);
    console.log("Signup data:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  const inputBaseClass =
    "w-full pe-4 ps-11 py-3 bg-gray-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400";

  const selectBaseClass =
    "w-full pe-4 ps-11 py-3 bg-gray-50/80 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white transition-all duration-200 appearance-none cursor-pointer";

  const getInputClass = (fieldName: keyof SignupFormValues) =>
    `${inputBaseClass} ${errors[fieldName] ? "border-red-300 bg-red-50/30" : "border-gray-200"}`;

  const getSelectClass = (fieldName: keyof SignupFormValues) =>
    `${selectBaseClass} ${errors[fieldName] ? "border-red-300 bg-red-50/30 text-gray-900" : "border-gray-200"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {t("signup.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-gray-500"
        >
          {t("signup.subtitle")}
        </motion.p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative overflow-hidden min-h-[360px] sm:px-2">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {/* ───────── Step 1: Basic Information ───────── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Name Row: First + Second + Last */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.firstName")}
                    </label>
                    <div className="relative">
                      <User className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        {...register("firstName", {
                          required: t("errors.firstNameRequired"),
                        })}
                        placeholder={t("signup.firstNamePlaceholder")}
                        className={getInputClass("firstName")}
                        id="signup-first-name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Second Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.secondName")}
                    </label>
                    <div className="relative">
                      <User className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        {...register("secondName", {
                          required: t("errors.secondNameRequired"),
                        })}
                        placeholder={t("signup.secondNamePlaceholder")}
                        className={getInputClass("secondName")}
                        id="signup-second-name"
                      />
                    </div>
                    {errors.secondName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.secondName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.lastName")}
                    </label>
                    <div className="relative">
                      <User className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        {...register("lastName", {
                          required: t("errors.lastNameRequired"),
                        })}
                        placeholder={t("signup.lastNamePlaceholder")}
                        className={getInputClass("lastName")}
                        id="signup-last-name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Birth + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.dateOfBirth")}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register("dateOfBirth", {
                          required: t("errors.dateOfBirthRequired"),
                        })}
                        className={`${getInputClass("dateOfBirth")} ps-4!`}
                        id="signup-dob"
                      />
                    </div>
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.phone")}
                    </label>
                    <div className="relative">
                      <Phone className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        {...register("phone", {
                          required: t("errors.phoneRequired"),
                          pattern: {
                            value: /^[0-9+\-\s()]{8,20}$/,
                            message: t("errors.phoneInvalid"),
                          },
                        })}
                        placeholder={t("signup.phonePlaceholder")}
                        className={getInputClass("phone")}
                        id="signup-phone"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Parent Phone + Governorate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Parent Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.parentPhone")}
                    </label>
                    <div className="relative">
                      <Phone className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        {...register("parentPhone", {
                          required: t("errors.parentPhoneRequired"),
                          pattern: {
                            value: /^[0-9+\-\s()]{8,20}$/,
                            message: t("errors.parentPhoneInvalid"),
                          },
                        })}
                        placeholder={t("signup.parentPhonePlaceholder")}
                        className={getInputClass("parentPhone")}
                        id="signup-parent-phone"
                      />
                    </div>
                    {errors.parentPhone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.parentPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Governorate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("signup.governorate")}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        {...register("governorate", {
                          required: t("errors.governorateRequired"),
                        })}
                        className={getSelectClass("governorate")}
                        id="signup-governorate"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t("signup.governoratePlaceholder")}
                        </option>
                        {GOVERNORATE_KEYS.map((key) => (
                          <option key={key} value={key}>
                            {t(`governorates.${key}`)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.governorate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.governorate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.address")}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute inset-s-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      {...register("address", {
                        required: t("errors.addressRequired"),
                      })}
                      placeholder={t("signup.addressPlaceholder")}
                      className={getInputClass("address")}
                      id="signup-address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ───────── Step 2: Academic Information ───────── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-5"
              >
                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.grade")}
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      {...register("grade", {
                        required: t("errors.gradeRequired"),
                      })}
                      className={getSelectClass("grade")}
                      id="signup-grade"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {t("signup.gradePlaceholder")}
                      </option>
                      {GRADE_KEYS.map((key) => (
                        <option key={key} value={key}>
                          {t(`grades.${key}`)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.grade && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.grade.message}
                    </p>
                  )}
                </div>

                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.school")}
                  </label>
                  <div className="relative">
                    <School className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      {...register("school", {
                        required: t("errors.schoolRequired"),
                      })}
                      placeholder={t("signup.schoolPlaceholder")}
                      className={getInputClass("school")}
                      id="signup-school"
                    />
                  </div>
                  {errors.school && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.school.message}
                    </p>
                  )}
                </div>

                {/* Section: Arabic / Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("signup.section")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["arabic", "languages"] as const).map((value) => {
                      const isSelected = watch("section") === value;
                      return (
                        <label
                          key={value}
                          className={`relative flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/60 text-blue-700 shadow-sm"
                              : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          } ${errors.section ? "border-red-300" : ""}`}
                        >
                          <input
                            type="radio"
                            value={value}
                            {...register("section", {
                              required: t("errors.sectionRequired"),
                            })}
                            className="sr-only"
                          />
                          <BookOpen className="w-4.5 h-4.5" />
                          <span className="font-medium text-sm">
                            {t(
                              `signup.section${value.charAt(0).toUpperCase() + value.slice(1)}`,
                            )}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3.5 inset-e-3.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {errors.section && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.section.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ───────── Step 3: Login Information ───────── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      {...register("email", {
                        required: t("errors.emailRequired"),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t("errors.emailInvalid"),
                        },
                      })}
                      placeholder={t("signup.emailPlaceholder")}
                      className={getInputClass("email")}
                      id="signup-email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: t("errors.passwordRequired"),
                        minLength: {
                          value: 8,
                          message: t("errors.passwordMin"),
                        },
                      })}
                      placeholder={t("signup.passwordPlaceholder")}
                      className={`${getInputClass("password")} pe-11!`}
                      id="signup-password"
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
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("signup.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: t("errors.confirmPasswordRequired"),
                        validate: (value) =>
                          value === passwordValue ||
                          t("errors.passwordsMismatch"),
                      })}
                      placeholder={t("signup.confirmPasswordPlaceholder")}
                      className={`${getInputClass("confirmPassword")} pe-11!`}
                      id="signup-confirm-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div>
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      {...register("acceptTerms", {
                        required: t("errors.termsRequired"),
                      })}
                      id="accept-terms"
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="accept-terms"
                      className="text-sm text-gray-600 cursor-pointer select-none leading-snug"
                    >
                      {t("signup.terms")}{" "}
                      <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                        {t("signup.termsLink")}
                      </span>{" "}
                      {t("signup.and")}{" "}
                      <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                        {t("signup.privacyLink")}
                      </span>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Navigation Buttons ─── */}
        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={goBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:bg-gray-250 transition-all duration-200"
              id="signup-back"
            >
              <ArrowLeft className="w-4.5 h-4.5 rtl:rotate-180" />
              {t("signup.back")}
            </motion.button>
          )}

          {currentStep < 3 ? (
            <motion.button
              type="button"
              onClick={goNext}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200/60 hover:shadow-xl hover:shadow-blue-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              id="signup-next"
            >
              {t("signup.next")}
              <ArrowRight className="w-4.5 h-4.5 rtl:rotate-180" />
            </motion.button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              id="signup-submit"
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200/60 hover:shadow-xl hover:shadow-blue-300/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("signup.submitting")}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {t("signup.submit")}
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Login Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center mt-8 text-sm text-gray-500"
      >
        {t("signup.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("signup.loginLink")}
        </Link>
      </motion.p>
    </motion.div>
  );
}
