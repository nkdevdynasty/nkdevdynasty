"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AuthCard from "@/src/component/auth-card/auth-card";

export default function SignUp() {
  return (
    <AuthCard
      title="Create an Account"
      description="Enter your details to get started"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input type="text" placeholder="John Doe" required />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="example@email.com" required />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" required />
        </div>

        <Button className="w-full">Sign Up</Button>
      </form>

      <Separator className="my-6" />

      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
