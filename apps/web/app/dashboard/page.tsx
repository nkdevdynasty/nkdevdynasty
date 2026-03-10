import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  if (session.user.role === "admin") redirect("/dashboard/admin");
  if (session.user.role === "student") redirect("/dashboard/student");
  if (session.user.role === "alumni") redirect("/dashboard/alumni");

  redirect("/signin");
}
