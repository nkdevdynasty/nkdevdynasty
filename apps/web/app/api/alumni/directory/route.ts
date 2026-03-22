import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const year = url.searchParams.get("year") || "";
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  // Build the where clause
  const where: Record<string, unknown> = { role: "ALUMNI" };

  if (year) {
    where.year = year;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { skills: { has: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        major: true,
        company: true,
        location: true,
        skills: true,
        bio: true,
        cgpa: true,
        grade: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        projectName: true,
        projectUrl: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  // Get distinct years for the filter dropdown
  const years = await prisma.user.findMany({
    where: { role: "ALUMNI", year: { not: null } },
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    years: years.map((y) => y.year).filter(Boolean),
  });
}
