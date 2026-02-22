"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthCard from "@/src/component/auth-card/auth-card";

export default function Logout() {
  return (
    <AuthCard
      title="Logged Out"
      description="You have been successfully logged out"
    >
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          Thank you for visiting. See you again soon!
        </p>

        <Link href="/signin">
          <Button className="w-full">Sign In Again</Button>
        </Link>
      </div>
    </AuthCard>
  );
}
