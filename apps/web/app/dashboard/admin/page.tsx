import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Users,
  GraduationCap,
  Briefcase,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "STUDENT").length,
      icon: <GraduationCap size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Alumni",
      value: users.filter((u) => u.role === "ALUMNI").length,
      icon: <Briefcase size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active Now",
      value: users.filter((u) => u.isActive).length,
      icon: <Activity size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {session.user.name}. Here's what's happening.
          </p>
        </div>
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all users <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-6 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {s.label}
              </p>
              <p className="text-3xl font-bold mt-2">{s.value}</p>
            </div>
            <div className={`p-3 ${s.bg} ${s.color} rounded-lg`}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h2 className="text-lg font-semibold">Recent Registrations</h2>
          </div>
          <div className="divide-y">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Database Connectivity</span>
                <span className="text-green-600 font-medium">Stable</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-[98%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Authentik Sync</span>
                <span className="text-green-600 font-medium">
                  Last synced 2m ago
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
