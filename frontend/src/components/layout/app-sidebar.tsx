"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Car,
  Settings,
  FileText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation items - update these based on your app's needs
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Evaluations",
    url: "/evaluations",
    icon: ClipboardCheck,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: Car,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="py-10">
        <SidebarMenu>
          <SidebarMenuItem>
              <Link href="/dashboard" className="flex items-center flex-col gap-2">
                <div className="flex aspect-square p-3 group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:size-8  items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        LOGO                  
                </div>
                <div className="grid flex-1 group-data-[collapsible=icon]:hidden text-center gap-1 text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Driving Evaluation
                  </span>
                  <span className="truncate text- text-muted-foreground">
                    Management System
                  </span>
                </div>
              </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
      <SidebarGroup className="px-10 group-data-[collapsible=icon]:px-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

         
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

