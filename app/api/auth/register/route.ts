import { NextRequest, NextResponse } from "next/server";
import { createUser, listGroups } from "@/lib/authentik";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Derive username from email prefix
  const username = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  // Self-registered users default to "student"
  const groups = await listGroups();
  const studentGroup = groups.results.find(
    (g: { name: string }) => g.name === "student",
  );

  if (!studentGroup)
    return NextResponse.json(
      { error: "Student group not found" },
      { status: 500 },
    );

  try {
    const user = await createUser({
      username,
      name,
      email,
      password,
      groupUuid: studentGroup.pk,
      role: "student",
    });
    return NextResponse.json(
      { id: user.pk, email: user.email },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
