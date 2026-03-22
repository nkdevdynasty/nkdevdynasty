"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4 max-w-md p-8">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="text-muted-foreground">
          Something went wrong during sign in.
        </p>
        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-left">
            <p className="text-sm font-mono text-red-800">{error}</p>
          </div>
        )}
        <Link href="/signin">
          <Button>Try Again</Button>
        </Link>
      </div>
    </div>
  );
}
