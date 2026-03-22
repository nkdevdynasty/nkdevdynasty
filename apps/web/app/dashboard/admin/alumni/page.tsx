import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, GraduationCap, ArrowRight } from "lucide-react";

export default async function AdminAlumniPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/signin");

  // Fetch stats directly (simple, no extra API call needed for server component)
  const [total, active, batchCounts, recentJoins] = await Promise.all([
    prisma.user.count({ where: { role: "ALUMNI" } }),
    prisma.user.count({ where: { role: "ALUMNI", isActive: true } }),
    prisma.user.groupBy({
      by: ["year"],
      where: { role: "ALUMNI", year: { not: null } },
      _count: true,
      orderBy: { year: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "ALUMNI" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        company: true,
        createdAt: true,
      },
    }),
  ]);

  const batches = batchCounts.map((b) => ({
    year: b.year,
    count: b._count,
  }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Alumni Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of all alumni across batches.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Total Alumni
              </p>
              <p className="text-4xl font-black mt-1">{total}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Active
              </p>
              <p className="text-4xl font-black mt-1">{active}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <UserCheck size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Batches
              </p>
              <p className="text-4xl font-black mt-1">{batches.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <GraduationCap size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Breakdown */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4 text-center">
                No alumni with graduation year set.
              </p>
            ) : (
              <div className="space-y-2">
                {batches.map((batch) => (
                  <Link
                    key={batch.year}
                    href={`/dashboard/admin/alumni/batch/${batch.year}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold">
                          Class of {batch.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-bold">
                          {batch.count} alumni
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Joins */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Recently Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentJoins.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4 text-center">
                No alumni yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentJoins.map((user) => (
                  <Link key={user.id} href={`/dashboard/alumni/${user.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right">
                        {user.year && (
                          <p className="text-xs font-bold text-muted-foreground">
                            Class of {user.year}
                          </p>
                        )}
                        {user.company && (
                          <p className="text-xs text-muted-foreground">
                            {user.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Link to full directory */}
      <div className="flex justify-center">
        <Link href="/dashboard/alumni/directory">
          <Button variant="outline" size="lg" className="font-bold">
            <Users className="h-4 w-4 mr-2" /> View Full Alumni Directory
          </Button>
        </Link>
      </div>
    </div>
  );
}
