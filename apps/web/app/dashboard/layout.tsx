import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/signin");

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">
              Dashboard
            </span>
            <span className="text-muted-foreground/20">/</span>
            <span className="text-sm font-bold capitalize">
              {session.user.role} Portal
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 bg-muted/10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
