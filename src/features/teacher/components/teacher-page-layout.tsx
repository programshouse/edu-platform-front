import * as React from "react";
import { SidebarInset, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import { TeacherSidebar } from "./teacher-sidebar";

interface TeacherPageLayoutProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function TeacherPageLayout({
  title,
  subtitle,
  headerActions,
  headerContent,
  children,
}: TeacherPageLayoutProps) {
  return (
    <>
      <TeacherSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SidebarTrigger className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" />
            <Separator orientation="vertical" className="h-5" />
            
            {headerContent ? (
              headerContent
            ) : (
              <div className="flex flex-col min-w-0">
                {title && (
                  <h1 className="text-sm font-semibold leading-tight text-foreground truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs text-muted-foreground hidden sm:block truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {headerActions && (
            <div className="shrink-0 flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </header>

        {children}
      </SidebarInset>
    </>
  );
}
