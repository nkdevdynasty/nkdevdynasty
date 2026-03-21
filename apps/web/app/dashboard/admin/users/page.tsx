import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UsersClient from "./users-client";
import { AlertCircle } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return <UsersClient initialUsers={users} />;
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div className="p-8 rounded-xl border-2 border-dashed border-red-200 bg-red-50 text-center space-y-3">
        <AlertCircle className="mx-auto text-red-500" size={40} />
        <h2 className="text-lg font-semibold text-red-900">
          Database Connection Issue
        </h2>
        <p className="text-red-700 max-w-md mx-auto">
          Could not fetch users. Please ensure your database is running and the
          schema is pushed.
        </p>
      </div>
    );
  }
}
