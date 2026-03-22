import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/student": ["admin", "student"],
  "/dashboard/alumni": ["admin", "alumni"],
  "/api/admin": ["admin"],
  "/api/student": ["admin", "student"],
  "/api/alumni": ["admin", "alumni"],
};

function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(route + "/")) return roles;
  }
  return null;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip auth pages and NextAuth internals
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/logout") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/debug") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) return NextResponse.next();

  // req.auth is the session from NextAuth v5
  const session = req.auth;

  if (!session) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = session.user?.role as string;

  if (!requiredRoles.includes(role)) {
    return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-user-role", role);
  headers.set("x-user-id", (session.user?.authentikId as string) || "");

  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
