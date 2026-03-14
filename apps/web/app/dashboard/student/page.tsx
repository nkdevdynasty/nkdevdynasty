import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User,
  Mail,
  Shield,
  Calendar,
  GraduationCap,
  Code,
} from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || !["admin", "student"].includes(session.user.role))
    redirect("/signin");

  // Fetch detailed user info from DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) redirect("/signin");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user.name.split(" ")[0]}!
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 uppercase">
            Active {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-sm">
                <User size={48} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {user.major || "Undecided"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.year || "New Student"}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-muted-foreground shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap
                  size={18}
                  className="text-muted-foreground shrink-0"
                />
                <span>{user.major} Specialist</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar
                  size={18}
                  className="text-muted-foreground shrink-0"
                />
                <span>
                  Enrolled{" "}
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Bio
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio || "No bio added yet. Tell us about yourself!"}
              </p>
            </div>

            <button className="w-full mt-8 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Code size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Technical Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.length > 0 ? (
                user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills listed.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Course Load",
                value: "4 Courses",
                sub: "12 Credit Hours",
              },
              { label: "GPA", value: "3.8", sub: "Dean's List Status" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-3xl font-bold mt-2">{s.value}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Academic Timeline</h2>
            </div>
            <div className="p-12 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Calendar size={24} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Registration for Next Semester</p>
                <p className="text-sm text-muted-foreground">
                  Opens in 14 days. Ensure your prerequisites are met.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
