"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthCard from "@/src/component/auth-card/auth-card"


export default function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email to receive a reset link"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="example@email.com" required />
        </div>

        <Button className="w-full">Send Reset Link</Button>
      </form>

      <p className="text-sm text-center mt-6">
        Remember your password?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </AuthCard>
  )
}
