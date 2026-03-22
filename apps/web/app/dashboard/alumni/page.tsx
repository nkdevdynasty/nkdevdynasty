import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Mail,
  Briefcase,
  GraduationCap,
  Users,
  MapPin,
  Award,
  Globe,
  Pencil,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function AlumniDashboard() {
  const session = await auth();
  if (!session || !["admin", "alumni"].includes(session.user.role))
    redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) redirect("/signin");

  // Real stats from database
  const totalAlumni = await prisma.user.count({
    where: { role: "ALUMNI" },
  });

  const batchPeers = user.year
    ? await prisma.user.count({
        where: { role: "ALUMNI", year: user.year },
      })
    : 0;

  // Check if profile is incomplete
  const profileFields = [user.bio, user.company, user.location, user.year, user.linkedinUrl];
  const filledFields = profileFields.filter(Boolean).length;
  const isProfileIncomplete = filledFields < 3;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-purple-900 dark:text-purple-400">
            Alumni Network
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back,{" "}
            <span className="text-foreground font-semibold">
              {user.name.split(" ")[0]}
            </span>
            . Stay connected with the{" "}
            <span className="text-purple-600 font-bold">{user.major || "BSc CS"}</span>{" "}
            community.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm font-bold bg-purple-50 text-purple-700 border-purple-200 uppercase tracking-tighter"
        >
          <Globe className="mr-2 h-4 w-4 text-purple-500" />
          {user.role} Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border-2 shadow-sm overflow-hidden border-t-4 border-t-purple-600">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-3xl font-black">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-black">{user.name}</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {user.year ? `Class of ${user.year}` : "Class of 20XX"}
                </p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-black uppercase">
                  {user.company || "Independent Professional"}
                </div>
              </div>

              <Separator className="my-8" />

              <div className="w-full space-y-4 text-left px-2">
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Mail size={18} />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <GraduationCap size={18} />
                  </div>
                  <span>{user.major || "Not set"}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <MapPin size={18} />
                  </div>
                  <span>{user.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Briefcase size={18} />
                  </div>
                  <span className="font-bold">
                    {user.company ? `At ${user.company}` : "Seeking New Roles"}
                  </span>
                </div>
              </div>

              <div className="w-full mt-8 p-4 rounded-xl bg-muted/30 border border-dashed text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Award size={12} className="text-purple-500" /> Professional
                  Bio
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &quot;{user.bio || "Sharing professional journey soon..."}&quot;
                </p>
              </div>

              <Link href="/dashboard/alumni/profile/edit" className="w-full mt-8">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-200">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 shadow-sm flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Total Alumni
                </p>
                <p className="text-4xl font-black">{totalAlumni}</p>
                <p className="text-xs font-bold text-purple-600">
                  Across all batches
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                <Users size={28} />
              </div>
            </Card>
            <Card className="border-2 shadow-sm flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Your Batch
                </p>
                <p className="text-4xl font-black">
                  {batchPeers} {batchPeers === 1 ? "Peer" : "Peers"}
                </p>
                <p className="text-xs font-bold text-green-600">
                  {user.year ? `Class of ${user.year}` : "Set your graduation year"}
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                <GraduationCap size={28} />
              </div>
            </Card>
          </div>

          {/* Profile Completion CTA */}
          {isProfileIncomplete && (
            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardContent className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-800">Complete Your Profile</p>
                  <p className="text-sm text-amber-700">
                    Add your bio, company, location, and social links so your batchmates can find you.
                  </p>
                </div>
                <Link href="/dashboard/alumni/profile/edit">
                  <Button variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                    <Pencil className="h-4 w-4 mr-2" /> Complete Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">
                  Expertise & Skills
                </CardTitle>
                <CardDescription>
                  Professional skills shared with the community.
                </CardDescription>
              </div>
              <Link href="/dashboard/alumni/profile/edit">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  Manage Skills
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="px-4 py-2 text-sm font-bold bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all cursor-default border-purple-100"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="py-8 text-center w-full">
                    <p className="text-sm text-muted-foreground italic">
                      Add your professional skills to help students find mentors.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-xl font-bold">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/dashboard/alumni/directory">
                <Button variant="outline" className="w-full justify-start font-bold">
                  <Users className="h-4 w-4 mr-2" /> Browse Alumni Directory
                </Button>
              </Link>
              <Link href="/dashboard/alumni/profile/edit">
                <Button variant="outline" className="w-full justify-start font-bold">
                  <Pencil className="h-4 w-4 mr-2" /> Edit Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
