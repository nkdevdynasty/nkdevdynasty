import { NextRequest, NextResponse } from "next/server";
import { createUser, listUsers, listGroups, checkToken } from "@/lib/authentik";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

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

  try {
    const { username, name, email, password, role } = await req.json();

    // Debug: Check Token permissions
    try {
      await checkToken();
    } catch (e) {
      console.error(
        "[Authentik] Token validation failed. Check your AUTHENTIK_API_TOKEN.",
      );
    }

    // Try multiple ways to find the group
    let group = null;

    // 1. Try search
    const searchResults = await listGroups(role);
    group = searchResults.results.find(
      (g: any) => g.name.toLowerCase() === role.toLowerCase(),
    );

    if (!group) {
      // 2. Try full list
      console.log(
        `[Authentik] '${role}' not found in search results. Fetching all groups...`,
      );
      const allGroups = await listGroups();
      group = allGroups.results.find(
        (g: any) => g.name.toLowerCase() === role.toLowerCase(),
      );
    }

    if (!group) {
      // 3. Last resort: If groups are [] but we know they exist, the token is definitely restricted.
      return NextResponse.json(
        {
          error: `Authentik API returned no groups for '${role}'.`,
          details:
            "Your API Token likely does not have the 'core.view_group' permission.",
          remedy:
            "In Authentik UI: Go to the Service Account -> Permissions -> Add 'view_group' to the token.",
        },
        { status: 400 },
      );
    }

    // 1. Create in Authentik
    let authentikUser;
    try {
      authentikUser = await createUser({
        username,
        name,
        email,
        password,
        groupUuid: group.pk,
        role,
      });
    } catch (error: any) {
      if (error.message.includes("unique")) {
        return NextResponse.json(
          {
            error: "Username or Email already exists in Authentik.",
            details: error.message,
          },
          { status: 400 },
        );
      }
      throw error;
    }

    if (!authentikUser.pk) {
      return NextResponse.json(
        { error: "Failed to create user in Authentik", details: authentikUser },
        { status: 500 },
      );
    }

    // 2. Create in Prisma
    const prismaUser = await prisma.user.create({
      data: {
        authentikId: authentikUser.pk.toString(),
        email: email,
        name: name,
        role: role.toUpperCase() as Role,
        groups: [role],
        isActive: true,
      },
    });

    return NextResponse.json({ authentikUser, prismaUser }, { status: 201 });
  } catch (error: any) {
    console.error("User creation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
