import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/40 to-background">
      {/* Optional Top Branding */}
      <div className="w-full py-6 text-center bg-red-300">
        <h1 className="text-2xl font-bold tracking-tight">🚀 MyAuthApp</h1>
      </div>

      {/* Page Content */}
      <div className="flex flex-1 items-center min-w-7xl justify-center px-4 bg-blue-400">
        {children}
      </div>

      {/* Optional Footer */}
      <div className="py-6 text-center text-sm text-muted-foreground bg-gray-500">
        © {new Date().getFullYear()} MyAuthApp. All rights reserved.
      </div>
    </div>
  );
}
