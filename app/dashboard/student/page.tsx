// ─── app/dashboard/student/page.tsx ───────────────────────────────────────────
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || !["admin", "student"].includes(session.user.role))
    redirect("/signin");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Enrolled Courses", value: 4 },
          { label: "Completed", value: 2 },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="font-semibold mb-2">My Courses</h2>
        <p className="text-sm text-muted-foreground">
          No courses yet. Browse the catalog to enroll.
        </p>
      </div>
    </div>
  );
}
