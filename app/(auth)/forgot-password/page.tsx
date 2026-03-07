"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCard from "@/src/component/auth-card/auth-card";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Triggers Authentik recovery email via your API route
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not send reset link. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        description="A reset link has been sent"
      >
        <p className="text-sm text-muted-foreground text-center">
          If an account exists for <strong>{email}</strong>, you will receive a
          password reset link shortly.
        </p>
        <p className="text-sm text-center mt-4">
          <Link href="/signin" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email to receive a reset link"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-sm text-center mt-6">
        Remember your password?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
