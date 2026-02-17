"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AuthCard from "@/src/component/auth-card/auth-card"

export default function SignIn() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="example@email.com" required />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" required />
        </div>

        <Button className="w-full">Sign In</Button>
      </form>

      <div className="flex justify-between text-sm mt-4">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>

        <Link href="/signup" className="text-primary hover:underline">
          Create account
        </Link>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <Link href="/logout" className="text-muted-foreground hover:underline text-sm">
          Logout (Demo)
        </Link>
      </div>
    </AuthCard>
  )
}
