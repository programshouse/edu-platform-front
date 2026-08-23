import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  GraduationCap,
  School,
  BookOpen,
  Loader2,
} from "lucide-react";
import { ProfileHero } from "./components/profile-hero";
import { ProfileTabs, type ProfileTab } from "./components/profile-tabs";
import { CoursesTab } from "./components/courses-tab";
import { TestsTab } from "./components/tests-tab";
import { AssignmentsTab } from "./components/assignments-tab";
import { SettingsTab } from "./components/settings-tab";
import { Footer } from "@/features/landing/components/footer";
import { authApi } from "@/features/auth/api/auth-api";
import { instructorAuthApi } from "@/features/auth/api/instructor-auth-api";
import { useAuthStore } from "@/shared/stores/auth-store";

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface StudentProfile {
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
  registeredAt: string;
  courses?: any[];
  tests?: any[];
  assignments?: any[];
  stats: {
    courses: number;
    points: number;
    rank: number;
  };
}

// ─── Personal Info Tab ───────────────────────────────────────────────────────

function PersonalTab({ student }: { student: StudentProfile }) {
  const { t } = useTranslation("profile");
  const { t: tAuth } = useTranslation("auth");

  const fullName = `${student.firstName || ""} ${student.secondName || ""} ${student.lastName || ""}`.trim();

  const groups = [
    {
      color: "blue",
      fields: [
        { icon: User, label: t("personal.fullName"), value: fullName },
        { icon: Mail, label: t("personal.email"), value: student.email },
        {
          icon: CalendarDays,
          label: t("personal.dateOfBirth"),
          value: student.dateOfBirth,
        },
      ],
    },
    {
      color: "violet",
      fields: [
        { icon: Phone, label: t("personal.phone"), value: student.phone },
        {
          icon: Phone,
          label: t("personal.parentPhone"),
          value: student.parentPhone,
        },
      ],
    },
    {
      color: "emerald",
      fields: [
        {
          icon: MapPin,
          label: t("personal.governorate"),
          value: tAuth(`governorates.${student.governorate}`, { defaultValue: student.governorate }),
        },
        {
          icon: MapPin,
          label: t("personal.address"),
          value: student.address,
        },
      ],
    },
    {
      color: "amber",
      fields: [
        {
          icon: GraduationCap,
          label: t("personal.grade"),
          value: tAuth(`grades.${student.grade}`, { defaultValue: student.grade }),
        },
        {
          icon: School,
          label: t("personal.school"),
          value: student.school,
        },
        {
          icon: BookOpen,
          label: t("personal.section"),
          value: student.section
            ? tAuth(`signup.section${student.section.charAt(0).toUpperCase() + student.section.slice(1)}`, { defaultValue: student.section })
            : "",
        },
      ],
    },
    {
      color: "gray",
      fields: [
        {
          icon: CalendarDays,
          label: t("personal.registered"),
          value: student.registeredAt,
        },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-500" },
    violet: { bg: "bg-violet-50", icon: "text-violet-500" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-500" },
    amber: { bg: "bg-amber-50", icon: "text-amber-500" },
    gray: { bg: "bg-gray-100", icon: "text-gray-400" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 grid gap-x-4 grid-cols-1 md:grid-cols-2"
    >
      {groups.map(({ color, fields }) => {
        const { bg, icon: iconCls } = colorMap[color];
        return (
          <div
            key={color}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50"
          >
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4">
                <div
                  className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4.5 h-4.5 ${iconCls}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Tab Content Variants ────────────────────────────────────────────────────

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ─── Profile Page ────────────────────────────────────────────────────────────

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  const role = useAuthStore((state) => state.user?.role);
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: [role === "teacher" ? "instructorProfile" : "studentProfile"],
    queryFn: role === "teacher" ? instructorAuthApi.profile : authApi.profile,
  });

  // Extract student data from backend response wrapper if necessary (e.g., response.data or response)
  const rawStudent = response?.data || response;
  const student: StudentProfile | undefined = rawStudent
    ? {
        ...rawStudent,
        section: rawStudent.section ?? "arabic",
        registeredAt: rawStudent.registeredAt ?? rawStudent.registered_at ?? "",
        courses: rawStudent.courses ?? [],
        tests: rawStudent.tests ?? [],
        assignments: rawStudent.assignments ?? [],
        stats: {
          courses: rawStudent.stats?.courses ?? rawStudent.courses?.length ?? 0,
          points: rawStudent.stats?.points ?? 0,
          rank: rawStudent.stats?.rank ?? 0,
        },
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">Loading profile data...</p>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">Failed to load profile details.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <ProfileHero student={student} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      <section className="py-8 bg-gray-50/60 min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === "personal" && <PersonalTab student={student} />}
              {activeTab === "courses" && <CoursesTab courses={student?.courses || []} />}
              {activeTab === "tests" && <TestsTab tests={student?.tests || []} />}
              {activeTab === "assignments" && (
                <AssignmentsTab assignments={student?.assignments || []} />
              )}
              {activeTab === "settings" && (
                <SettingsTab student={student} onProfileUpdated={refetch} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </>
  );
}