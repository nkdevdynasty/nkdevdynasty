// ─── app/dashboard/admin/page.tsx ─────────────────────────────────────────────
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { listUsers, getEvents } from "@/lib/authentik";

type AuthentikUser = {
  pk: string;
  name: string;
  email: string;
  is_active: boolean;
  groups_obj?: { name: string }[];
};

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  const [users, events] = await Promise.all([listUsers(), getEvents(1)]);

  const byRole = (role: string) =>
    users.results.filter((u: AuthentikUser) =>
      u.groups_obj?.some((g) => g.name === role),
    ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.count },
          { label: "Students", value: byRole("student") },
          { label: "Alumni", value: byRole("alumni") },
          { label: "Recent Events", value: events.count },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent users table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Users</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.results.slice(0, 10).map((u: AuthentikUser) => (
                <tr key={u.pk} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        u.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
