import { NextRequest, NextResponse } from "next/server"; // fix: v5 uses auth() not getServerSession()
import { createUser, listUsers, listGroups } from "@/lib/authentik";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await listUsers());
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { username, name, email, password, role } = await req.json();
  if (!["student", "alumni"].includes(role))
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const groups = await listGroups();
  const group = groups.results.find((g: { name: string }) => g.name === role);
  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 400 });

  const user = await createUser({
    username,
    name,
    email,
    password,
    groupUuid: group.pk,
    role,
  });
  return NextResponse.json(user, { status: 201 });
}
