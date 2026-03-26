"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
      {/* Colorful blob background — right side only */}
      <div className="absolute inset-y-0 right-0 bottom- w-full -z-10 pointer-events-none">
        <Image
          src="/hero/Waimakariri.png"
          alt=""
          fill
          className="object-contain object-right"
          priority
        />
      </div>

      <div className="max-w-7xl w-full mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-0 items-center">
        {/* LEFT: TEXT BLOCK */}
        <div className="flex flex-col items-start gap-6 py-20 z-10">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-gray-900">
            Connect.
            <br />
            Grow. Give
            <br />
            Back.
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
            Join your college alumni network and stay connected with peers,
            mentors, and opportunities that shape your future.
          </p>

          <Link href="/signin" className="mt-2">
            <Button
              size="lg"
              className="bg-gray-900 text-white hover:bg-gray-700 rounded-md px-7 py-3 text-base font-semibold shadow-none"
            >
              Join Alumni Network
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
