import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  BellIcon,
  CreditCardIcon,
  ClipboardListIcon,
  FileTextIcon,
  CheckCheckIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

type NotifType = "newSubscription" | "assignmentCorrection" | "testReview" | "payment";

interface Notification {
  id: string;
  type: NotifType;
  actor: string;
  courseTitle: string;
  timeAgo: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "newSubscription",     actor: "أحمد محمود",   courseTitle: "React من الصفر",    timeAgo: "5m",  read: false },
  { id: "2", type: "assignmentCorrection", actor: "مريم علي",     courseTitle: "JavaScript المتقدم", timeAgo: "20m", read: false },
  { id: "3", type: "testReview",          actor: "خالد إبراهيم", courseTitle: "Python للمبتدئين",  timeAgo: "1h",  read: false },
  { id: "4", type: "payment",             actor: "سارة حسن",     courseTitle: "تصميم Figma",       timeAgo: "2h",  read: true  },
  { id: "5", type: "newSubscription",     actor: "يوسف كريم",    courseTitle: "CSS Masterclass",   timeAgo: "3h",  read: true  },
  { id: "6", type: "assignmentCorrection", actor: "منى عبدالله",  courseTitle: "React من الصفر",   timeAgo: "5h",  read: true  },
];

const NOTIF_ICONS: Record<NotifType, React.ElementType> = {
  newSubscription:     CreditCardIcon,
  assignmentCorrection: ClipboardListIcon,
  testReview:          FileTextIcon,
  payment:             CreditCardIcon,
};

const NOTIF_STYLE: Record<NotifType, string> = {
  newSubscription:     "bg-blue-50 text-blue-600",
  assignmentCorrection: "bg-amber-50 text-amber-600",
  testReview:          "bg-violet-50 text-violet-600",
  payment:             "bg-emerald-50 text-emerald-600",
};

export function NotificationsPanel() {
  const { t } = useTranslation("teacher");
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-800">{t("notifications.title")}</h2>
          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors">
            <CheckCheckIcon className="size-3.5" />
            {t("notifications.markAllRead")}
          </button>
          <Link
            to="/teacher/notifications"
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("notifications.viewAll")}
            <ExternalLinkIcon className="size-3" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-300">
            <BellIcon className="size-8" />
            <p className="text-sm">{t("notifications.empty")}</p>
          </div>
        ) : (
          MOCK_NOTIFICATIONS.map((notif, idx) => {
            const Icon = NOTIF_ICONS[notif.type];
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/40 transition-colors",
                  !notif.read && "bg-blue-50/30",
                  idx < MOCK_NOTIFICATIONS.length - 1 && "border-b border-gray-50"
                )}
              >
                {/* Icon */}
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", NOTIF_STYLE[notif.type])}>
                  <Icon className="size-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {t(`notifications.types.${notif.type}`)}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {notif.actor} — {notif.courseTitle}
                  </p>
                </div>

                {/* Time + unread dot */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs text-gray-400">{notif.timeAgo}</span>
                  {!notif.read && (
                    <span className="size-2 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
