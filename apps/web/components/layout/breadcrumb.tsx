"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Map path segments to readable labels
const labels: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  alumni: "Alumni",
  student: "Student",
  users: "Users",
  directory: "Directory",
  profile: "Profile",
  edit: "Edit",
  batch: "Batch",
  settings: "Settings",
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Split path into segments: "/dashboard/admin/alumni" → ["dashboard", "admin", "alumni"]
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = labels[segment] || segment;

        return (
          <span key={href} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="text-muted-foreground/30">/</span>
            )}
            {isLast ? (
              <span className="font-bold text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
