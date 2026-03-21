import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, setPassword } from "@/lib/authentik";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = (await params).id;
  const { name, email, role, password, isActive } = await req.json();

  try {
    // 1. Update Authentik
    const authentikData: any = {};
    if (name) authentikData.name = name;
    if (email) authentikData.email = email;
    if (isActive !== undefined) authentikData.is_active = isActive;
    if (role) {
      authentikData.attributes = { role };
      // Note: Group switching logic should be here if roles map to groups
    }

    if (Object.keys(authentikData).length > 0) {
      await updateUser(parseInt(id), authentikData);
    }

    if (password) {
      await setPassword(parseInt(id), password);
    }

    // 2. Update Prisma (using authentikId as the identifier)
    const prismaRole = role ? (role.toUpperCase() as Role) : undefined;

    await prisma.user.update({
      where: { authentikId: id },
      data: {
        name: name || undefined,
        email: email || undefined,
        role: prismaRole,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = (await params).id;

  try {
    // 1. Delete from Authentik
    await deleteUser(parseInt(id));

    // 2. Delete from Prisma
    await prisma.user.delete({
      where: { authentikId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
