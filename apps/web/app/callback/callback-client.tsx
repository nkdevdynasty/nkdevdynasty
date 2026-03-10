"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return;

    async function exchangeToken() {
      try {
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        console.log("Token Response:", data);

        router.push("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/signin");
      }
    }

    exchangeToken();
  }, [searchParams, router]);

  return <div>Processing login...</div>;
}
