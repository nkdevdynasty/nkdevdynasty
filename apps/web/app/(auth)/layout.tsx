"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-between p-6 md:p-10 bg-background">
          {/* Header / Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-sm">
                <HomeIcon className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Catalyst
              </span>
            </Link>
          </div>

          {/* Form Section */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Actual Form */}
              <div className="p-6 shadow-xl">{children}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Catalyst. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE (VISUAL PANEL) */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <Image
            src="/images/building_2.jpg"
            alt="College"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </SessionProvider>
  );
}
