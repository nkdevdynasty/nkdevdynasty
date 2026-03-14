"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthCard from "@/components/auth-card/auth-card";

export default function SignIn() {
  const { status } = useSession();

  function handleSignIn() {
    signIn("authentik", { callbackUrl: "/dashboard" }, { prompt: "login" });
  }

  return (
    <AuthCard title="Welcome Back" description="Sign in to your account">
      <div className="space-y-4">
        <Button
          className="w-full cursor-pointer"
          onClick={handleSignIn}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Checking..." : "Continue with Authentik"}
        </Button>

        <Separator />

        <p className="text-xs text-center text-muted-foreground">
          You will be redirected to the login page
        </p>
      </div>
    </AuthCard>
  );
}
