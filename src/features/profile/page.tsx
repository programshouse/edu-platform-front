import { useState } from "react";
import { useTranslation } from "react-i18next";
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
} from "lucide-react";
import { ProfileHero } from "./components/profile-hero";
import { ProfileTabs, type ProfileTab } from "./components/profile-tabs";
import { CoursesTab } from "./components/courses-tab";
import { TestsTab } from "./components/tests-tab";
import { AssignmentsTab } from "./components/assignments-tab";
import { SettingsTab } from "./components/settings-tab";
import { Footer } from "@/features/landing/components/footer";

// ─── Mock Student (same fields as signup form) ───────────────────────────────

const mockStudent = {
  firstName: "Ahmed",
  secondName: "Mohamed",
  lastName: "Hassan",
  dateOfBirth: "2005-06-15",
  phone: "+20 100 123 4567",
  parentPhone: "+20 111 987 6543",
  governorate: "cairo",
  address: "12 Tahrir Square, Downtown",
  grade: "grade_2_sec",
  school: "Nasr City Secondary School",
  section: "arabic" as const,
  email: "ahmed.hassan@example.com",
  registeredAt: "January 10, 2025",
  stats: {
    courses: 4,
    points: 3280,
    rank: 12,
  },
};

// ─── Mock Courses ────────────────────────────────────────────────────────────

const mockCourses = [
  {
    id: 0,
    title: "Professional Web Development",
    description:
      "Learn to build modern, responsive web applications using React, Node.js, and cutting-edge frameworks",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=340&fit=crop",
    progress: 72,
    status: "active" as const,
    expiresAt: "July 30, 2026",
  },
  {
    id: 1,
    title: "UI/UX Design Mastery",
    description:
      "Master user experience design principles and create stunning interfaces with Figma & Adobe XD",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
    progress: 45,
    status: "active" as const,
    expiresAt: "June 15, 2026",
  },
  {
    id: 2,
    title: "Data Analysis with Python",
    description:
      "Discover the power of data analysis with Python, Pandas, and advanced visualization techniques",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
    progress: 100,
    status: "expired" as const,
    expiresAt: "December 10, 2025",
  },
  {
    id: 3,
    title: "Mobile App Development",
    description:
      "Build cross-platform iOS & Android applications with React Native from scratch",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=340&fit=crop",
    progress: 18,
    status: "active" as const,
    expiresAt: "August 30, 2026",
  },
];

// ─── Mock Tests ──────────────────────────────────────────────────────────────

const mockTests = [
  {
    id: 0,
    title: "HTML & CSS Practical Test",
    courseName: "Professional Web Development",
    courseId: 0,
    lectureIndex: 0,
    grade: 88,
    totalScore: 100,
    status: "passed" as const,
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 1,
    title: "JavaScript Fundamentals Quiz",
    courseName: "Professional Web Development",
    courseId: 0,
    lectureIndex: 3,
    grade: 55,
    totalScore: 100,
    status: "failed" as const,
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 2,
    title: "UX Principles Quiz",
    courseName: "UI/UX Design Mastery",
    courseId: 1,
    lectureIndex: 0,
    grade: null,
    totalScore: 100,
    status: "inProgress" as const,
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 3,
    title: "Python Basics Quiz",
    courseName: "Data Analysis with Python",
    courseId: 2,
    lectureIndex: 0,
    grade: 92,
    totalScore: 100,
    status: "passed" as const,
    attempts: 2,
    maxAttempts: 3,
  },
];

// ─── Mock Assignments ────────────────────────────────────────────────────────

const mockAssignments = [
  {
    id: 0,
    title: "Build a Landing Page",
    courseName: "Professional Web Development",
    courseId: 0,
    lectureIndex: 0,
    deadline: "May 15, 2026",
    status: "graded" as const,
    grade: 95,
    totalGrade: 100,
    feedback:
      "Excellent work! The layout is clean and responsive. Minor issue with the mobile menu animation — consider using a smoother transition.",
  },
  {
    id: 1,
    title: "Build a Full-Stack CRUD App",
    courseName: "Professional Web Development",
    courseId: 0,
    lectureIndex: 8,
    deadline: "June 20, 2026",
    status: "submitted" as const,
    grade: null,
    totalGrade: 100,
    feedback: null,
  },
  {
    id: 2,
    title: "Design a Mobile App UI",
    courseName: "UI/UX Design Mastery",
    courseId: 1,
    lectureIndex: 5,
    deadline: "April 28, 2026",
    status: "notSubmitted" as const,
    grade: null,
    totalGrade: 100,
    feedback: null,
  },
  {
    id: 3,
    title: "Data Cleaning Challenge",
    courseName: "Data Analysis with Python",
    courseId: 2,
    lectureIndex: 3,
    deadline: "November 5, 2025",
    status: "late" as const,
    grade: 60,
    totalGrade: 100,
    feedback:
      "Submitted 3 days late. The analysis was mostly correct but lacked proper documentation.",
  },
];

// ─── Personal Info Tab ───────────────────────────────────────────────────────

function PersonalTab() {
  const { t } = useTranslation("profile");
  const { t: tAuth } = useTranslation("auth");

  const fullName = `${mockStudent.firstName} ${mockStudent.secondName} ${mockStudent.lastName}`;

  const groups = [
    {
      color: "blue",
      fields: [
        { icon: User, label: t("personal.fullName"), value: fullName },
        { icon: Mail, label: t("personal.email"), value: mockStudent.email },
        {
          icon: CalendarDays,
          label: t("personal.dateOfBirth"),
          value: mockStudent.dateOfBirth,
        },
      ],
    },
    {
      color: "violet",
      fields: [
        { icon: Phone, label: t("personal.phone"), value: mockStudent.phone },
        {
          icon: Phone,
          label: t("personal.parentPhone"),
          value: mockStudent.parentPhone,
        },
      ],
    },
    {
      color: "emerald",
      fields: [
        {
          icon: MapPin,
          label: t("personal.governorate"),
          value: tAuth(`governorates.${mockStudent.governorate}`),
        },
        {
          icon: MapPin,
          label: t("personal.address"),
          value: mockStudent.address,
        },
      ],
    },
    {
      color: "amber",
      fields: [
        {
          icon: GraduationCap,
          label: t("personal.grade"),
          value: tAuth(`grades.${mockStudent.grade}`),
        },
        {
          icon: School,
          label: t("personal.school"),
          value: mockStudent.school,
        },
        {
          icon: BookOpen,
          label: t("personal.section"),
          value: tAuth(
            `signup.section${mockStudent.section.charAt(0).toUpperCase() + mockStudent.section.slice(1)}`,
          ),
        },
      ],
    },
    {
      color: "gray",
      fields: [
        {
          icon: CalendarDays,
          label: t("personal.registered"),
          value: mockStudent.registeredAt,
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
      className=" space-y-4 grid gap-x-4 grid-cols-1 md:grid-cols-2"
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
                    {value}
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

  return (
    <>
      <ProfileHero student={mockStudent} />
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
              {activeTab === "personal" && <PersonalTab />}
              {activeTab === "courses" && <CoursesTab courses={mockCourses} />}
              {activeTab === "tests" && <TestsTab tests={mockTests} />}
              {activeTab === "assignments" && (
                <AssignmentsTab assignments={mockAssignments} />
              )}
              {activeTab === "settings" && (
                <SettingsTab student={mockStudent} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </>
  );
}
