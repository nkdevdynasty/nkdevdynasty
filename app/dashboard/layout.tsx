import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/src/common/logout";

// ─── DashboardLayout (server component) ─────── //
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/signin");

  const role = session.user.role;
  const name = session.user.name;

  const navLinks = {
    admin: [
      { href: "/dashboard/admin", label: "Overview" },
      { href: "/dashboard/admin/users", label: "Manage Users" },
      { href: "/dashboard/admin/events", label: "Audit Log" },
    ],
    student: [
      { href: "/dashboard/student", label: "Overview" },
      { href: "/dashboard/student/courses", label: "My Courses" },
    ],
    alumni: [
      { href: "/dashboard/alumni", label: "Overview" },
      { href: "/dashboard/alumni/network", label: "Network" },
      { href: "/dashboard/alumni/events", label: "Events" },
    ],
  };

  const links = navLinks[role] ?? [];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-sidebar border-r flex flex-col p-4 gap-2">
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {role}
          </p>
          <p className="font-semibold truncate">{name}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <LogoutButton />
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
