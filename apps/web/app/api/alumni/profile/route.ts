import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only alumni and admin can edit alumni profiles
  const role = session.user.role;
  if (role !== "alumni" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Only allow updating profile fields (not role, email, name, etc.)
  const allowedFields = [
    "bio",
    "company",
    "location",
    "skills",
    "year",
    "major",
    "phone",
    "linkedinUrl",
    "githubUrl",
    "portfolioUrl",
    "resumeUrl",
    "cgpa",
    "grade",
    "projectName",
    "projectUrl",
    "placementInfo",
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // Basic validation
  if (updateData.cgpa !== undefined) {
    const cgpa = Number(updateData.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      return NextResponse.json(
        { error: "CGPA must be between 0 and 10" },
        { status: 400 }
      );
    }
    updateData.cgpa = cgpa;
  }

  if (updateData.year !== undefined && updateData.year !== null) {
    const year = String(updateData.year);
    if (year && !/^\d{4}$/.test(year)) {
      return NextResponse.json(
        { error: "Year must be a 4-digit number like 2024" },
        { status: 400 }
      );
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Profile update failed:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
