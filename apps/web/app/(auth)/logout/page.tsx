"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import AuthCard from "@/components/auth-card/auth-card";

export default function Logout() {
  useEffect(() => {
    signOut({ callbackUrl: "/signin", redirect: true });
  }, []);

  return (
    <AuthCard title="Logging out..." description="Please wait">
      <p className="text-sm text-muted-foreground text-center animate-pulse">
        Signing you out...
      </p>
    </AuthCard>
  );
}
