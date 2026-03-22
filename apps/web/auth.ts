import NextAuth from "next-auth";
import { prisma } from "./lib/prisma";
import { Role } from "@prisma/client";

type AuthentikProfile = {
  sub: string;
  email?: string;
  name?: string;
  groups?: string[];
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    {
      id: "authentik",
      name: "Authentik",
      type: "oidc",
      issuer: process.env.AUTHENTIK_ISSUER_URL!,
      clientId: process.env.AUTHENTIK_CLIENT_ID!,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid email profile" },
      },

      profile(profile: AuthentikProfile) {
        const groups = profile.groups ?? [];

        const role = groups.includes("admin")
          ? "admin"
          : groups.includes("alumni")
            ? "alumni"
            : "student";

        return {
          id: profile.sub,
          name: profile.name ?? "",
          email: profile.email ?? "",
          role,
          groups,
          accessToken: "",
          authentikId: profile.sub,
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.role = user.role;
        token.groups = user.groups;
        token.authentikId = user.authentikId;
      }

      if (account) {
        token.accessToken = account.access_token ?? "";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role ?? "student";
        session.user.groups = token.groups ?? [];
        session.user.accessToken = token.accessToken ?? "";
        session.user.authentikId = token.authentikId ?? "";
      }

      return session;
    },
  },

  events: {
    async signIn({ user, profile }) {
      const authentikProfile = profile as AuthentikProfile;

      if (!authentikProfile?.sub || !user.email) return;

      const groups = authentikProfile.groups ?? [];

      const role: Role = groups.includes("admin")
        ? Role.ADMIN
        : groups.includes("alumni")
          ? Role.ALUMNI
          : Role.STUDENT;

      try {
        await prisma.user.upsert({
          where: { authentikId: authentikProfile.sub },

          create: {
            authentikId: authentikProfile.sub,
            email: user.email,
            name: user.name ?? "",
            role,
            groups,
            isActive: true,
            lastLogin: new Date(),
          },

          update: {
            email: user.email,
            name: user.name ?? "",
            role,
            groups,
            isActive: true,
            lastLogin: new Date(),
          },
        });

        console.log(`✅ User saved: ${user.email} as ${role}`);
      } catch (error) {
        console.error("❌ Failed to save user:", error);
      }
    },

    async signOut() {},
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});
