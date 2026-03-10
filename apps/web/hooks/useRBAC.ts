import { useSession } from "next-auth/react";

export function useRBAC() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const can = {
    manageUsers: role === "admin",
    accessAdminPanel: role === "admin",
    accessStudentContent: role === "admin" || role === "student",
    accessAlumniContent: role === "admin" || role === "alumni",
    viewAlumniEvents: true,
  };

  return {
    role,
    isAdmin: role === "admin",
    isStudent: role === "student",
    isAlumni: role === "alumni",
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    can,
    session,
  };
}
