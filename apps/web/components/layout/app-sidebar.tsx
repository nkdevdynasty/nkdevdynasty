"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Network,
  Calendar,
  LogOut,
  Settings,
  Shield,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  items?: { title: string; href: string }[];
}

export function AppSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const role = user.role.toLowerCase();

  const navLinks: Record<string, NavItem[]> = {
    admin: [
      { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Users", href: "/dashboard/admin/users", icon: Users },
      { title: "System", href: "/dashboard/admin/events", icon: Shield },
    ],
    student: [
      { title: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
      {
        title: "My Courses",
        href: "/dashboard/student/courses",
        icon: BookOpen,
      },
      {
        title: "Schedule",
        href: "/dashboard/student/schedule",
        icon: Calendar,
      },
    ],
    alumni: [
      { title: "Network", href: "/dashboard/alumni", icon: LayoutDashboard },
      { title: "Directory", href: "/dashboard/alumni/network", icon: Network },
      { title: "Events", href: "/dashboard/alumni/events", icon: Calendar },
    ],
  };

  const links = navLinks[role] || [];

  return (
    <Sidebar collapsible="icon" className="border-r-2">
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-3 font-black text-xl tracking-tighter text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
            NK
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            NKDevDynasty
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 space-y-1 mt-2">
            {links.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.href}
                  className="h-11 rounded-xl data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all hover:bg-muted"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-bold text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-muted/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 rounded-xl hover:bg-muted transition-colors data-[state=open]:bg-muted border border-transparent data-[state=open]:border-muted-foreground/10"
            >
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 text-left group-data-[collapsible=icon]:hidden ml-2 overflow-hidden">
                <span className="text-sm font-black truncate">{user.name}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                  {user.role}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl p-2 shadow-xl border-2"
          >
            <div className="px-2 py-1.5 text-xs font-black text-muted-foreground uppercase tracking-widest border-b mb-1">
              My Account
            </div>
            <DropdownMenuItem
              asChild
              className="rounded-lg h-10 font-bold cursor-pointer"
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg h-10 font-bold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/signin" })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
