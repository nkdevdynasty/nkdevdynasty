import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User as UserIcon,
  Mail,
  Calendar,
  GraduationCap,
  Code,
  BookOpen,
  Trophy,
  ArrowRight,
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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || !["admin", "student"].includes(session.user.role))
    redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) redirect("/signin");

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Student Portal
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back,{" "}
            <span className="text-foreground font-semibold">
              {user.name.split(" ")[0]}
            </span>
            ! Ready to excel today?
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm font-bold bg-green-50 text-green-700 border-green-200 uppercase tracking-tighter"
        >
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Active {user.role}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border-2 shadow-sm overflow-hidden">
            <div className="h-24 bg-primary/10 w-full" />
            <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {user.major || "Specialist"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.year || "Class of 20XX"}
                </p>
              </div>

              <div className="w-full mt-8 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="p-2 rounded-md bg-muted">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="p-2 rounded-md bg-muted">
                    <GraduationCap
                      size={16}
                      className="text-muted-foreground"
                    />
                  </div>
                  <span>{user.major} Specialist</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="p-2 rounded-md bg-muted">
                    <Calendar size={16} className="text-muted-foreground" />
                  </div>
                  <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="w-full mt-6 pt-6 border-t text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                  Professional Bio
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "
                  {user.bio ||
                    "No bio added yet. Tell us about your academic journey!"}
                  "
                </p>
              </div>

              <Button className="w-full mt-8 font-bold shadow-md shadow-primary/20">
                Edit Public Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 shadow-sm bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-blue-600">
                  Course Load
                </CardDescription>
                <CardTitle className="text-3xl font-black">4 Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-semibold text-blue-700/70">
                  12 Credit Hours Total
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 shadow-sm bg-green-50/30">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-green-600">
                  Academic GPA
                </CardDescription>
                <CardTitle className="text-3xl font-black">3.85</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-semibold text-green-700/70 flex items-center gap-1">
                  <Trophy size={12} /> Dean's List Status
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 shadow-sm bg-purple-50/30">
              <CardHeader className="pb-2">
                <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-purple-600">
                  Attendance
                </CardDescription>
                <CardTitle className="text-3xl font-black">94%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={94} className="h-1.5 bg-purple-100" />
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" /> Technical Skills
                </CardTitle>
                <CardDescription>
                  Verified skills in your profile.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="font-bold">
                Add New
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-4 py-1.5 text-sm font-bold bg-muted hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-8 text-muted-foreground space-y-2">
                    <BookOpen size={40} className="opacity-20" />
                    <p className="text-sm font-medium italic">
                      No skills listed yet. Start building your portfolio!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-xl font-bold">
                Academic Timeline
              </CardTitle>
              <CardDescription>
                Important dates and upcoming milestones.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <Calendar size={32} className="text-primary/40" />
                </div>
                <h3 className="text-lg font-bold">
                  Registration for Next Semester
                </h3>
                <p className="text-muted-foreground max-w-sm mt-2 font-medium">
                  Opens in{" "}
                  <span className="text-foreground font-bold italic text-primary underline underline-offset-4">
                    14 days
                  </span>
                  . Meet with your academic advisor to finalize your
                  prerequisites.
                </p>
                <Button className="mt-8 group font-bold px-8" variant="outline">
                  View Full Schedule{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
