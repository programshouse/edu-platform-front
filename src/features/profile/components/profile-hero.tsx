import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarDays, Mail, Phone, Pencil, BookOpen, Star, Trophy } from "lucide-react";
import { EditProfileModal } from "./edit-profile-modal";

interface StudentShape {
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
  section: "arabic" | "languages";
  registeredAt: string;
  stats: {
    courses: number;
    points: number;
    rank: number;
  };
}

interface ProfileHeroProps {
  student: StudentShape;
}

export function ProfileHero({ student }: ProfileHeroProps) {
  const { t } = useTranslation("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullName = `${student.firstName} ${student.secondName} ${student.lastName}`;

  const stats = [
    {
      icon: BookOpen,
      value: student.stats.courses,
      label: t("hero.stats.courses"),
      color: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-100",
    },
    {
      icon: Star,
      value: student.stats.points.toLocaleString(),
      label: t("hero.stats.points"),
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-100",
    },
    {
      icon: Trophy,
      value: `#${student.stats.rank}`,
      label: t("hero.stats.rank"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-100",
    },
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700" />
        <div className="absolute -top-24 -inset-e-24 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -inset-s-16 w-56 h-56 bg-white/5 rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Initials Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl scale-110" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/20 ring-4 ring-white/30 shadow-2xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-white select-none">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-2 -inset-e-2 w-5 h-5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1 min-w-0 text-center sm:text-start"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">{fullName}</h1>
              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-x-5 gap-y-1 mt-2">
                <span className="flex items-center gap-1.5 text-blue-100/80 text-sm">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1.5 text-blue-100/80 text-sm">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {student.phone}
                </span>
                <span className="flex items-center gap-1.5 text-blue-100/80 text-sm">
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                  {t("hero.memberSince")} {student.registeredAt}
                </span>
              </div>
            </motion.div>

            {/* Edit Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button
                id="edit-profile-btn"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                <Pencil className="w-4 h-4" />
                {t("hero.editProfile")}
              </button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-3 gap-3 mt-8"
          >
            {stats.map(({ icon: Icon, value, label, color, bg, ring }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 px-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <div className={`w-9 h-9 rounded-xl ${bg} ${ring} ring-1 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-lg sm:text-xl font-bold text-white leading-tight">{value}</p>
                  <p className="text-xs text-blue-100/70">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={student}
      />
    </>
  );
}
