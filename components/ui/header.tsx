"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb/breadcrumb";

const Header: React.FC = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loginType, setLoginType] = useState<"admin" | "student" | null>(null);

  const handleLoginSelect = (type: "admin" | "student") => {
    setLoginType(type);
    setCommandOpen(false);
    setSheetOpen(true);
  };

  return (
    <header className="bg-orange-500 text-white p-4">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold">NK Dev Dynasty</h1>

        {/* Login Button */}
        <Button
          variant="secondary"
          className="text-orange-500"
          onClick={() => setCommandOpen(true)}
        >
          Login
        </Button>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Select login type..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Login As">
            <CommandItem onSelect={() => handleLoginSelect("admin")}>
              Admin Login
            </CommandItem>
            <CommandItem onSelect={() => handleLoginSelect("student")}>
              Student Login
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Sheet Panel */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {loginType === "admin" ? "Admin Login" : "Student Login"}
            </SheetTitle>
            <SheetDescription>
              Enter your credentials to continue
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 p-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder={
                  loginType === "admin"
                    ? "admin@example.com"
                    : "student@example.com"
                }
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Login Button */}
            <button className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
              Login
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Breadcrumb Section */}
      <div className="mt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <DotIcon className="h-4 w-4 text-white" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/teachers">Teachers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <DotIcon className="h-4 w-4 text-white" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/students">Students</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <DotIcon className="h-4 w-4 text-white" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/rankers">Rankers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <DotIcon className="h-4 w-4 text-white" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/photos">Photos</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <DotIcon className="h-4 w-4 text-white" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;

// "use client"

// import React from "react"
// import Link from "next/link"
// import { DotIcon, Menu } from "lucide-react"

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb/breadcrumb"

// const Header: React.FC = () => {
//   return (
//     <header className="bg-orange-500 text-white px-6 py-4">

//       {/* Top Section: Logo + Menu */}
//       <div className="flex items-center justify-between">

//         {/* Logo */}
//         <h1 className="text-xl font-bold tracking-wide">
//           NK Dev Dynasty
//         </h1>

//         {/* Sheet Menu */}
//         <Sheet>
//           <SheetTrigger asChild>
//             <button className="bg-white text-orange-500 p-2 rounded-md hover:bg-gray-100 transition">
//               <Menu size={20} />
//             </button>
//           </SheetTrigger>

//           <SheetContent side="right" className="w-[350px]">
//             <SheetHeader>
//               <SheetTitle>Admin Login</SheetTitle>
//               <SheetDescription>
//                 Enter your credentials to continue
//               </SheetDescription>
//             </SheetHeader>

//             <div className="flex flex-col gap-5 mt-6 px-4">

//               {/* Email */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-medium">Email</label>
//                 <input
//                   type="email"
//                   placeholder="admin@example.com"
//                   className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               {/* Password */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-medium">Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter password"
//                   className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               {/* Login Button */}
//               <button className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
//                 Login
//               </button>
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Breadcrumb Section */}
//       <div className="mt-6 overflow-x-auto">
//         <Breadcrumb>
//           <BreadcrumbList className="flex items-center gap-2">

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/">Home</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/teachers">Teachers</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/students">Students</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/rankers">Rankers</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/photos">Photos</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbPage>Current Page</BreadcrumbPage>
//             </BreadcrumbItem>

//           </BreadcrumbList>
//         </Breadcrumb>
//       </div>

//     </header>
//   )
// }

// export default Header

// "use client"

// import React from "react"
// import Link from "next/link"
// import { DotIcon, Menu } from "lucide-react"

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb/breadcrumb"

// const Header: React.FC = () => {
//   return (
//     <header className="bg-orange-500 text-white p-4">

//       {/* Top Section: Logo + Sheet */}
//       <div className="flex items-center justify-between">

//         {/* Logo */}
//         <h1 className="text-xl font-bold">
//           NK Dev Dynasty
//         </h1>

//         {/* Sheet Menu */}
//         <Sheet>
//           <SheetTrigger asChild>
//             <button className="bg-white text-orange-500 p-2 rounded-md">
//               <Menu size={20} />
//             </button>
//           </SheetTrigger>

//           <SheetContent side="right">
//   <SheetHeader>
//     <SheetTitle>Admin Login</SheetTitle>
//     <SheetDescription>
//       Enter your credentials to continue
//     </SheetDescription>
//   </SheetHeader>

//   <div className="flex flex-col gap-4 p-6">

//     {/* Email */}
//     <div className="flex flex-col gap-2">
//       <label className="text-sm font-medium">Email</label>
//       <input
//         type="email"
//         placeholder="admin@example.com"
//         className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
//       />
//     </div>

//     {/* Password */}
//     <div className="flex flex-col gap-2">
//       <label className="text-sm font-medium">Password</label>
//       <input
//         type="password"
//         placeholder="Enter password"
//         className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
//       />
//     </div>

//     {/* Login Button */}
//     <button className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
//       Login
//     </button>

//   </div>
// </SheetContent>
//         </Sheet>

//       </div>

//       {/* Breadcrumb Section */}
//       <div className="mt-4">
//         <Breadcrumb>
//           <BreadcrumbList>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/">Home</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/teachers">Teachers</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/students">Students</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/rankers">Rankers</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbLink asChild>
//                 <Link href="/photos">Photos</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>

//             <BreadcrumbSeparator>
//               <DotIcon className="h-4 w-4 text-white" />
//             </BreadcrumbSeparator>

//             <BreadcrumbItem>
//               <BreadcrumbPage>Current Page</BreadcrumbPage>
//             </BreadcrumbItem>

//           </BreadcrumbList>
//         </Breadcrumb>
//       </div>

//     </header>
//   )
// }

// export default Header
