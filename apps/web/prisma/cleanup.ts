import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 Starting thorough cleanup of dummy data...");

  // Delete users by multiple patterns to be 100% sure
  const { count } = await prisma.user.deleteMany({
    where: {
      OR: [
        { authentikId: { startsWith: "dummy-" } },
        { email: { endsWith: "@university.edu" } },
        { name: { startsWith: "Dummy User" } },
      ],
      // SAFETY: Never delete the real admin
      NOT: {
        email: "sujit@binarysquad.org",
      },
    },
  });

  console.log(`✅ Successfully removed ${count} users from the database.`);
  console.log("🛡️  Real user accounts were protected.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
