"use client"; // add this at top of layout
import { signOut } from "next-auth/react";

// ─── LogoutButton (client component) ─────────────────────────────────────────
export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin", redirect: true })}
      className="block w-full text-left px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors mt-auto"
    >
      Logout
    </button>
  );
}
