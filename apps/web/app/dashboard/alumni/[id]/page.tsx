import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
  FileText,
} from "lucide-react";

export default async function AlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/signin");

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.role !== "ALUMNI") {
    notFound();
  }

  function Row({ label, value }: { label: string; value: string | null | undefined }) {
    return (
      <tr className="border-b last:border-b-0">
        <td className="py-3 pr-4 text-sm font-semibold text-muted-foreground whitespace-nowrap align-top w-40">
          {label}
        </td>
        <td className="py-3 text-sm">{value || "—"}</td>
      </tr>
    );
  }

  function LinkRow({
    label,
    url,
    icon,
  }: {
    label: string;
    url: string | null | undefined;
    icon: React.ReactNode;
  }) {
    return (
      <tr className="border-b last:border-b-0">
        <td className="py-3 pr-4 text-sm font-semibold text-muted-foreground whitespace-nowrap align-top w-40">
          {label}
        </td>
        <td className="py-3 text-sm">
          {url ? (
            <a
              href={url.startsWith("http") ? url : `https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple-600 hover:underline"
            >
              {icon}
              {url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 50)}
              {url.length > 60 ? "..." : ""}
            </a>
          ) : (
            "—"
          )}
        </td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-3xl mx-auto">
      <Link href="/dashboard/alumni/directory">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-5 pb-4 border-b-2">
        <Avatar className="h-20 w-20 border-2 shadow">
          <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-black">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-extrabold">{user.name}</h1>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <Badge variant="outline" className="font-bold text-xs">
              Class of {user.year || "N/A"}
            </Badge>
            <Badge variant="outline" className="font-bold text-xs">
              {user.major || "Computer Science"}
            </Badge>
            {user.cgpa && (
              <Badge className="bg-purple-100 text-purple-700 font-bold text-xs">
                CGPA {user.cgpa}{user.grade ? ` · Grade ${user.grade}` : ""}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Personal */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
          Personal Information
        </h2>
        <div className="rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <tbody>
              <Row label="Full Name" value={user.name} />
              <Row label="Email" value={user.email} />
              <Row label="Phone" value={user.phone} />
              <Row label="Location" value={user.location} />
              <Row label="Bio" value={user.bio} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
          Academic Details
        </h2>
        <div className="rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <tbody>
              <Row label="Programme" value="BSc Computer Science Honours" />
              <Row label="College" value="Saraswati Degree Vidya Mandira, Berhampur" />
              <Row label="University" value="Berhampur University" />
              <Row label="Batch" value={user.year ? `${Number(user.year) - 3}–${user.year}` : null} />
              <Row label="Graduation Year" value={user.year} />
              <Row
                label="CGPA"
                value={user.cgpa ? `${user.cgpa} / 10${user.grade ? ` (Grade ${user.grade})` : ""}` : null}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
          Professional
        </h2>
        <div className="rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <tbody>
              <Row label="Company" value={user.company} />
              <Row label="Placement" value={user.placementInfo} />
              <tr className="border-b last:border-b-0">
                <td className="py-3 pr-4 text-sm font-semibold text-muted-foreground whitespace-nowrap align-top w-40">
                  Skills
                </td>
                <td className="py-3">
                  {user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs font-bold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm">—</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Project */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
          Final Year Project
        </h2>
        <div className="rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <tbody>
              <Row label="Project Name" value={user.projectName} />
              <LinkRow label="Project Link" url={user.projectUrl} icon={<ExternalLink className="h-3.5 w-3.5" />} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">
          Social & Links
        </h2>
        <div className="rounded-lg border-2 overflow-hidden">
          <table className="w-full">
            <tbody>
              <LinkRow label="LinkedIn" url={user.linkedinUrl} icon={<Linkedin className="h-3.5 w-3.5" />} />
              <LinkRow label="GitHub" url={user.githubUrl} icon={<Github className="h-3.5 w-3.5" />} />
              <LinkRow label="Portfolio" url={user.portfolioUrl} icon={<Globe className="h-3.5 w-3.5" />} />
              <LinkRow label="Resume" url={user.resumeUrl} icon={<FileText className="h-3.5 w-3.5" />} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
