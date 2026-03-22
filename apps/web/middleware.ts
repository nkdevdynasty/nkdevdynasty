import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(req: NextRequest) {
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

  // NextAuth v5 uses "authjs" as the cookie prefix, not "next-auth"
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
    salt: req.nextUrl.protocol === "https:"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  if (!token) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (!requiredRoles.includes(token.role as string)) {
    return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
  }

  const headers = new Headers(req.headers);
  headers.set("x-user-role", token.role as string);
  headers.set("x-user-id", (token.authentikId as string) || "");

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
