import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default async function BatchPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  const { year } = await params;

  const users = await prisma.user.findMany({
    where: { role: "ALUMNI", year },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      location: true,
      skills: true,
      bio: true,
      linkedinUrl: true,
      githubUrl: true,
      cgpa: true,
    },
  });

  if (users.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin/alumni">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold">Class of {year}</h1>
          <p className="text-muted-foreground text-sm">
            {users.length} alumni in this batch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          // Simple profile completeness check
          const filled = [user.bio, user.company, user.location, user.linkedinUrl, user.githubUrl].filter(Boolean).length;
          const isComplete = filled >= 3;

          return (
            <Link key={user.id} href={`/dashboard/alumni/${user.id}`}>
              <Card className="border-2 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2">
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {user.company && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        {user.company}
                      </p>
                    )}
                    {user.location && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {user.location}
                      </p>
                    )}
                    {user.cgpa && (
                      <Badge variant="outline" className="text-xs">
                        CGPA {user.cgpa}
                      </Badge>
                    )}
                  </div>

                  {user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {user.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
