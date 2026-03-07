import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.AUTHENTIK_URL!;
const H = {
  Authorization: `Bearer ${process.env.AUTHENTIK_API_TOKEN!}`,
  "Content-Type": "application/json",
};

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Find user by email
  const usersRes = await fetch(
    `${BASE}/api/v3/core/users/?email=${encodeURIComponent(email)}`,
    { headers: H },
  );
  const users = await usersRes.json();

  if (!users.results?.length) {
    // Return 200 anyway — don't reveal if user exists
    return NextResponse.json({ ok: true });
  }

  const userId = users.results[0].pk;

  // Trigger Authentik recovery email
  await fetch(`${BASE}/api/v3/core/users/${userId}/recovery_email/`, {
    method: "POST",
    headers: H,
  });

  return NextResponse.json({ ok: true });
}
