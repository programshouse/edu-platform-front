import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { User, BookOpen, ClipboardList, FileText, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type ProfileTab = "personal" | "courses" | "tests" | "assignments" | "settings";

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  const { t } = useTranslation("profile");

  const tabs: { id: ProfileTab; icon: React.ElementType; label: string }[] = [
    { id: "personal", icon: User, label: t("tabs.personal") },
    { id: "courses", icon: BookOpen, label: t("tabs.courses") },
    { id: "tests", icon: ClipboardList, label: t("tabs.tests") },
    { id: "assignments", icon: FileText, label: t("tabs.assignments") },
    { id: "settings", icon: Settings, label: t("tabs.settings") },
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-none gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-linear-to-r from-blue-600 to-blue-500 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
