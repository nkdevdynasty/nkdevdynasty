// ─── app/dashboard/alumni/page.tsx ────────────────────────────────────────────
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AlumniDashboard() {
  const session = await auth();
  if (!session || !["admin", "alumni"].includes(session.user.role))
    redirect("/signin");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Alumni Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Connections", value: 12 },
          { label: "Events", value: 3 },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="font-semibold mb-2">Alumni Network</h2>
        <p className="text-sm text-muted-foreground">
          Connect with fellow alumni and stay updated on events.
        </p>
      </div>
    </div>
  );
}
