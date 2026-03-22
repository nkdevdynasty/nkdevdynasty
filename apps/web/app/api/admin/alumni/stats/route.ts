import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [total, active, recentJoins, batchCounts] = await Promise.all([
    prisma.user.count({ where: { role: "ALUMNI" } }),
    prisma.user.count({ where: { role: "ALUMNI", isActive: true } }),
    prisma.user.findMany({
      where: { role: "ALUMNI" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        company: true,
        createdAt: true,
      },
    }),
    prisma.user.groupBy({
      by: ["year"],
      where: { role: "ALUMNI", year: { not: null } },
      _count: true,
      orderBy: { year: "desc" },
    }),
  ]);

  const batches = batchCounts.map((b: { year: string | null; _count: number }) => ({
    year: b.year,
    count: b._count,
  }));

  return NextResponse.json({ total, active, recentJoins, batches });
}
