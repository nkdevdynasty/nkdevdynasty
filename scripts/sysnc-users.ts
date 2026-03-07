// scripts/sync-users.ts
// run with: npx ts-node scripts/sync-users.ts

// This script syncs users from Authentik to the local database using Prisma.

import { prisma } from "../lib/prisma";

const AUTHENTIK_URL = process.env.AUTHENTIK_URL!;
const TOKEN = process.env.AUTHENTIK_API_TOKEN!;

async function syncUsers() {
  const res = await fetch(`${AUTHENTIK_URL}/api/v3/core/users/`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();

  for (const user of data.results) {
    if (!user.email) continue; // skip service accounts

    const groups: string[] =
      user.groups_obj?.map((g: { name: string }) => g.name) || [];
    const role = groups.includes("admin")
      ? "ADMIN"
      : groups.includes("alumni")
        ? "ALUMNI"
        : "STUDENT";

    await prisma.user.upsert({
      where: { authentikId: String(user.pk) },
      create: {
        authentikId: String(user.pk),
        email: user.email,
        name: user.name,
        role,
        groups,
        isActive: user.is_active,
      },
      update: {
        email: user.email,
        name: user.name,
        role,
        groups,
        isActive: user.is_active,
      },
    });
    console.log(`✅ Synced: ${user.email} as ${role}`);
  }

  console.log("🎉 Sync complete");
  await prisma.$disconnect();
}

syncUsers().catch(console.error);
