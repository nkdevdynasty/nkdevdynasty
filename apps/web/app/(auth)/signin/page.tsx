"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthCard from "@/components/auth-card/auth-card";

export default function SignIn() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = () => {
    signIn("authentik", { callbackUrl: "/dashboard" });
  };

  return (
    <AuthCard title="Welcome Back" description="Sign in to your account">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
            <p className="text-sm font-bold text-red-700">Sign in failed</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        )}

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
