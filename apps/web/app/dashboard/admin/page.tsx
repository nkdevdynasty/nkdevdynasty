import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Users,
  GraduationCap,
  Briefcase,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "STUDENT").length,
      icon: GraduationCap,
      color: "text-green-600",
      bg: "bg-green-50/50",
    },
    {
      label: "Alumni",
      value: users.filter((u) => u.role === "ALUMNI").length,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50/50",
    },
    {
      label: "Active Now",
      value: users.filter((u) => u.isActive).length,
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50/50",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back,{" "}
            <span className="text-foreground font-semibold">
              {session.user.name}
            </span>
            . Here is your system overview.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="shadow-sm">
          <Link href="/dashboard/admin/users">
            Manage Users <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="border-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <span className="text-green-600 font-bold">+2.1%</span> from
                last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <Card className="lg:col-span-2 border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4 border-b">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">
                Recent Registrations
              </CardTitle>
              <CardDescription>
                Latest members to join the network.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {users.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  className="p-5 flex items-center justify-between hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {u.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold leading-none">{u.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={u.role === "ADMIN" ? "destructive" : "secondary"}
                      className="font-bold text-[10px] uppercase"
                    >
                      {u.role}
                    </Badge>
                    <p className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-muted/5 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link href="/dashboard/admin/users">View Full Directory</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-2 shadow-sm h-fit">
          <CardHeader className="bg-muted/20 pb-4 border-b">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              System Status
            </CardTitle>
            <CardDescription>Real-time infrastructure health.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Database connectivity</p>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
                    Stable
                  </p>
                </div>
                <span className="text-xs font-bold font-mono">98%</span>
              </div>
              <Progress value={98} className="h-2 bg-muted shadow-inner" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Authentik authentication</p>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />{" "}
                    Synced 2m ago
                  </p>
                </div>
                <span className="text-xs font-bold font-mono">100%</span>
              </div>
              <Progress value={100} className="h-2 bg-muted shadow-inner" />
            </div>

            <div className="rounded-xl bg-muted/30 p-4 border border-dashed border-muted-foreground/20">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Server Load
              </p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-primary/20 rounded-full" />
                <div className="h-10 w-1 bg-primary/40 rounded-full" />
                <div className="h-6 w-1 bg-primary/30 rounded-full" />
                <div className="h-12 w-1 bg-primary rounded-full" />
                <div className="h-8 w-1 bg-primary/50 rounded-full" />
                <div className="h-4 w-1 bg-primary/20 rounded-full" />
                <p className="text-xs font-bold ml-2">Minimal (12%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
