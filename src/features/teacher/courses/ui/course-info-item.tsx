import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface CourseInfoItemProps {
  icon: React.ElementType;
  label: string;
  value: ReactNode;
  className?: string;
}

export function CourseInfoItem({ icon: Icon, label, value, className }: CourseInfoItemProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0 text-blue-500" />
        <span>{label}</span>
      </div>
      <div className="text-base font-medium text-foreground ps-5.5">
        {value}
      </div>
    </div>
  );
}
