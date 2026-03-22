import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    hasSession: !!session,
    user: session?.user
      ? {
          name: session.user.name,
          role: session.user.role,
          email: session.user.email?.slice(0, 5) + "...",
        }
      : null,
    env: {
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET (" + process.env.AUTH_SECRET.length + " chars)" : "MISSING",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      AUTH_URL: process.env.AUTH_URL || "MISSING",
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "MISSING",
      AUTHENTIK_ISSUER_URL: process.env.AUTHENTIK_ISSUER_URL ? "SET" : "MISSING",
      AUTHENTIK_CLIENT_ID: process.env.AUTHENTIK_CLIENT_ID
        ? process.env.AUTHENTIK_CLIENT_ID.slice(0, 5) + "... (" + process.env.AUTHENTIK_CLIENT_ID.length + " chars)"
        : "MISSING",
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
    },
  });
}
