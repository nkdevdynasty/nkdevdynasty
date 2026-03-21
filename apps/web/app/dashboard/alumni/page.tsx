import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User as UserIcon,
  Mail,
  Briefcase,
  GraduationCap,
  Users,
  MapPin,
  Award,
  Globe,
  ArrowUpRight,
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
            <span className="text-purple-600 font-bold">{user.major}</span>{" "}
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
        {/* Professional Profile Section */}
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
                  {user.year || "Class of 20XX"}
                </p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-black uppercase">
                  {user.company || "Independent Professional"}
                </div>
              </div>

              <Separator className="my-8" />

              <div className="w-full space-y-4 text-left px-2">
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                    <Mail size={18} />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                    <GraduationCap size={18} />
                  </div>
                  <span>{user.major}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                    <MapPin size={18} />
                  </div>
                  <span>{user.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium group">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
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
                  "{user.bio || "Sharing professional journey soon..."}"
                </p>
              </div>

              <Button className="w-full mt-8 bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-200">
                Update Professional Bio
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 shadow-sm flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Network Reach
                </p>
                <p className="text-4xl font-black">142 Peers</p>
                <p className="text-xs font-bold text-purple-600">
                  +12 this month
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                <Users size={28} />
              </div>
            </Card>
            <Card className="border-2 shadow-sm flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Mentorships
                </p>
                <p className="text-4xl font-black">3 Students</p>
                <p className="text-xs font-bold text-green-600">
                  Active Guidance
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                <Globe size={28} />
              </div>
            </Card>
          </div>

          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">
                  Expertise & Endorsements
                </CardTitle>
                <CardDescription>
                  Professional skills shared with the community.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="font-bold border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Manage Skills
              </Button>
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
                      Add your professional skills to help students find
                      mentors.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <CardTitle className="text-xl font-bold text-purple-900 dark:text-purple-400">
                Upcoming Networking Events
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 font-bold hover:bg-purple-50"
              >
                View Calendar
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    title: "Annual Tech Symposium",
                    date: "April 15, 2026",
                    time: "10:00 AM EST",
                    type: "Virtual",
                    attendees: 84,
                  },
                  {
                    title: "Regional Alumni Mixer",
                    date: "May 2, 2026",
                    time: "06:30 PM",
                    type: "In-Person",
                    attendees: 42,
                  },
                ].map((event) => (
                  <div
                    key={event.title}
                    className="p-6 hover:bg-muted/10 transition-colors flex justify-between items-center group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-base">{event.title}</p>
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase py-0 h-4 border-purple-200 text-purple-600"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <Globe size={14} className="text-purple-400" />{" "}
                          {event.date}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <span>{event.time}</span>
                      </p>
                      <p className="text-xs font-bold text-purple-600/70">
                        {event.attendees} peers attending
                      </p>
                    </div>
                    <Button className="font-black px-6 rounded-xl group-hover:scale-105 transition-transform">
                      Register <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-muted/5 text-center border-t">
                <p className="text-xs font-bold text-muted-foreground">
                  Showing 2 of 12 upcoming events
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
