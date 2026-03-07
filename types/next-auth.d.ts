import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

type Role = "admin" | "student" | "alumni";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      groups: string[];
      accessToken: string;
      authentikId: string;
    };
  }

  interface User {
    role: Role;
    groups: string[];
    accessToken: string;
    authentikId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    groups: string[];
    accessToken: string;
    authentikId: string;
  }
}
