import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Users,
  MapPin,
  Award,
  Globe,
} from "lucide-react";

export default async function AlumniDashboard() {
  const session = await auth();
  if (!session || !["admin", "alumni"].includes(session.user.role))
    redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) redirect("/signin");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-900">
            Alumni Network
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay connected with the {user.major} community.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">
            Membership
          </p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 uppercase">
            {user.role} Member
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm border-t-4 border-t-purple-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center border-4 border-background shadow-sm">
                <User size={48} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {user.year || "Class of 20XX"}
                </p>
                <p className="text-xs text-purple-600 font-semibold mt-1">
                  {user.company || "Open to Opportunities"}
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
                <span>{user.major}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-muted-foreground shrink-0" />
                <span>{user.location || "Location not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase
                  size={18}
                  className="text-muted-foreground shrink-0"
                />
                <span>
                  {user.company ? `At ${user.company}` : "Seeking Roles"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Professional Bio
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{user.bio || "Sharing professional journey soon..."}"
              </p>
            </div>

            <button className="w-full mt-8 py-2.5 px-4 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-sm">
              Update Professional Bio
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expertise Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-purple-600" />
              <h2 className="text-lg font-semibold">Areas of Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.length > 0 ? (
                user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-100"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add your professional skills to help students find mentors.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Network Reach",
                value: "142 peers",
                icon: <Users size={20} className="text-purple-600" />,
              },
              {
                label: "Mentorships",
                value: "3 students",
                icon: <Globe size={20} className="text-purple-600" />,
              },
            ].map((s) => (
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
                <div className="p-2 bg-purple-50 rounded-lg">{s.icon}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-purple-900">
                Upcoming Networking Events
              </h2>
            </div>
            <div className="divide-y">
              {[
                {
                  title: "Annual Tech Symposium",
                  date: "April 15, 2026",
                  type: "Virtual",
                },
                {
                  title: "Regional Alumni Mixer",
                  date: "May 2, 2026",
                  type: "In-Person",
                },
              ].map((event) => (
                <div
                  key={event.title}
                  className="p-4 hover:bg-muted/10 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} • {event.type}
                    </p>
                  </div>
                  <button className="text-xs font-bold text-purple-600 hover:underline">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Calendar icon replacement for this specific file
function Calendar({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
