import type { ReactNode } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Saraswati Vidya Mandir
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          height={100}
          width={100}
          src="/images/building_2.jpg"
          alt="College image"
          className="w-full h-full object-cover absolute inset-0 opacity-90"
        />
      </div>
    </div>
  );
}
