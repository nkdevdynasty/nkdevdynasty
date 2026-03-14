import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User as PrismaUser, Role } from "@prisma/client";
import {
  Mail,
  MoreVertical,
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Database,
} from "lucide-react";

// Explicit Type for our User with all fields from Prisma
type UserWithProfile = PrismaUser;

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  let users: UserWithProfile[] = [];
  let error: string | null = null;

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Database error:", e);
    error =
      "Could not fetch users. Your database might not be ready or the 'users' table is missing.";
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all registered users in the system.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
            <Database size={14} />
            <span>Development Mode</span>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
            Add New User
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-8 rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-center space-y-3">
          <AlertCircle className="mx-auto text-red-500" size={40} />
          <h2 className="text-lg font-semibold text-red-900">
            Database Connection Issue
          </h2>
          <p className="text-red-700 max-w-md mx-auto">{error}</p>
          <div className="pt-4 flex flex-col gap-2 items-center">
            <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">
              Run this command to fix:
            </p>
            <code className="bg-white px-4 py-2 rounded border border-red-200 text-sm text-red-600 font-mono shadow-sm">
              make setup
            </code>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                    <th className="p-4 font-semibold">User Details</th>
                    <th className="p-4 font-semibold">Role & Status</th>
                    <th className="p-4 font-semibold">Academic Profile</th>
                    <th className="p-4 font-semibold">Professional Info</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Database
                            className="text-muted-foreground/30"
                            size={48}
                          />
                          <p className="text-muted-foreground italic">
                            No users found. Run 'make seed' to add dummy data.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isDummy =
                        u.authentikId.startsWith("dummy-") ||
                        u.authentikId.includes("-1") ||
                        u.authentikId.includes("-2");

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-muted/5 transition-colors group"
                        >
                          {/* User Column */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {u.name.charAt(0)}
                                </div>
                                {isDummy && (
                                  <span
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-white rounded-full"
                                    title="Generated Dummy Data"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-foreground leading-none">
                                    {u.name}
                                  </p>
                                  {isDummy && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase">
                                      Dummy
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Mail size={12} />
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role & Status Column */}
                          <td className="p-4">
                            <div className="space-y-1.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                  u.role === Role.ADMIN
                                    ? "bg-orange-100 text-orange-800 border-orange-200"
                                    : u.role === Role.ALUMNI
                                      ? "bg-purple-100 text-purple-800 border-purple-200"
                                      : "bg-green-100 text-green-800 border-green-200"
                                }`}
                              >
                                {u.role}
                              </span>
                              <div
                                className={`flex items-center gap-1.5 text-[11px] ${u.isActive ? "text-green-600" : "text-red-600"}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-600" : "bg-red-600"}`}
                                />
                                {u.isActive ? "Account Active" : "Suspended"}
                              </div>
                            </div>
                          </td>

                          {/* Academic Info Column */}
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-foreground font-medium">
                                <GraduationCap
                                  size={14}
                                  className="text-muted-foreground"
                                />
                                <span>{u.major || "Not set"}</span>
                              </div>
                              <p className="text-xs text-muted-foreground pl-5">
                                {u.year || "Year missing"}
                              </p>
                            </div>
                          </td>

                          {/* Professional Info Column */}
                          <td className="p-4">
                            {u.role === Role.ALUMNI ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-foreground font-medium">
                                  <Briefcase
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                  <span>{u.company || "Self-employed"}</span>
                                </div>
                                <p className="text-xs text-muted-foreground pl-5">
                                  {u.location || "Global"}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic pl-1">
                                {u.role === Role.ADMIN
                                  ? "System Administrator"
                                  : "Current Student"}
                              </span>
                            )}
                          </td>

                          {/* Actions Column */}
                          <td className="p-4 text-right">
                            <button className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground group-hover:text-foreground">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
