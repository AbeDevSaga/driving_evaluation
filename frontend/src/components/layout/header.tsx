"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { BreadcrumbTitle } from "@/features/template/component/breadCrumb/BreadCrumb";
import { useSession } from "next-auth/react";

interface HeaderProps {
  title?: string;
}


 

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();

  const notificationCount = 3;
  const userData = {
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "",
    avatar: session?.user?.profile_image ?? undefined,
  };

  return (
    <header className="flex z-30 sticky shadow-md top-0 border h-20 shrink-0 items-center gap-2 px-4 rounded-xl bg-sidebar text-sidebar-foreground m-2 mb-0">
      <SidebarTrigger className="-ml-1" />

      <BreadcrumbTitle title={title} />

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        <NavUser user={userData} />
      </div>
    </header>
  );
}