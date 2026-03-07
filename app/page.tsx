import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <Link href="/signin">
        <Button>Go to Sign In</Button>
      </Link>
    </main>
  );
}
