import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

type TokenRequest = {
  code: string;
};

type AuthentikTokenResponse = {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

export async function POST(req: Request) {
  try {
    const { code }: TokenRequest = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 },
      );
    }

    const tokenResponse = await fetch(
      "http://authentikserver-ugwog0sockwwkc8g0gscsg0s.89.167.10.11.sslip.io/application/o/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.AUTHENTIK_CLIENT_ID!,
          client_secret: process.env.AUTHENTIK_CLIENT_SECRET!,
          code,
          redirect_uri: "http://localhost:3000/callback",
        }),
      },
    );

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch token from Authentik" },
        { status: 500 },
      );
    }

    const data: AuthentikTokenResponse = await tokenResponse.json();

    const decoded = jwt.decode(data.id_token) as JwtPayload | null;

    console.log("Decoded ID Token:", decoded);

    return NextResponse.json({
      access_token: data.access_token,
      id_token: data.id_token,
      decoded,
    });
  } catch (error) {
    console.error("Auth callback error:", error);

    return NextResponse.json(
      { error: "Internal authentication error" },
      { status: 500 },
    );
  }
}
