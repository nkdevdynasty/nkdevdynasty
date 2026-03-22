"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X } from "lucide-react";

export default function EditAlumniProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state — each field is a simple string or number
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [grade, setGrade] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [placementInfo, setPlacementInfo] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Load current profile on mount
  useEffect(() => {
    fetch("/api/alumni/profile")
      .then((res) => res.json())
      .then((user) => {
        setBio(user.bio || "");
        setPhone(user.phone || "");
        setCompany(user.company || "");
        setLocation(user.location || "");
        setYear(user.year || "");
        setMajor(user.major || "");
        setCgpa(user.cgpa !== null && user.cgpa !== undefined ? String(user.cgpa) : "");
        setGrade(user.grade || "");
        setProjectName(user.projectName || "");
        setProjectUrl(user.projectUrl || "");
        setPlacementInfo(user.placementInfo || "");
        setLinkedinUrl(user.linkedinUrl || "");
        setGithubUrl(user.githubUrl || "");
        setPortfolioUrl(user.portfolioUrl || "");
        setResumeUrl(user.resumeUrl || "");
        setSkills(user.skills || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

  function addSkill() {
    const skill = skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput("");
    }
  }

  function removeSkill(skillToRemove: string) {
    setSkills(skills.filter((s) => s !== skillToRemove));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/alumni/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          phone,
          company,
          location,
          year,
          major,
          cgpa: cgpa ? parseFloat(cgpa) : null,
          grade: grade || null,
          projectName,
          projectUrl,
          placementInfo,
          linkedinUrl,
          githubUrl,
          portfolioUrl,
          resumeUrl,
          skills,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success("Profile updated!");
      router.push("/dashboard/alumni");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/alumni")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Berhampur, Odisha"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional */}
      <Card>
        <CardHeader>
          <CardTitle>Professional</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your current company"
            />
          </div>
          <div>
            <Label htmlFor="placementInfo">Placement Details</Label>
            <Input
              id="placementInfo"
              value={placementInfo}
              onChange={(e) => setPlacementInfo(e.target.value)}
              placeholder="e.g. TCS ION Digital Zone, Berhampur"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Skills</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic */}
      <Card>
        <CardHeader>
          <CardTitle>Academic</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="year">Graduation Year</Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              maxLength={4}
            />
          </div>
          <div>
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="cgpa">CGPA</Label>
            <Input
              id="cgpa"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="9.40"
              type="number"
              step="0.01"
              min="0"
              max="10"
            />
          </div>
          <div>
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="O, A+, A, B+, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Final Year Project */}
      <Card>
        <CardHeader>
          <CardTitle>Final Year Project</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Employee Management System"
            />
          </div>
          <div>
            <Label htmlFor="projectUrl">Project Link</Label>
            <Input
              id="projectUrl"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://myproject.onrender.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social & Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn</Label>
            <Input
              id="linkedinUrl"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub</Label>
            <Input
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="portfolioUrl">Portfolio</Label>
            <Input
              id="portfolioUrl"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://yourportfolio.netlify.app"
            />
          </div>
          <div>
            <Label htmlFor="resumeUrl">Resume Link</Label>
            <Input
              id="resumeUrl"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/file/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Bottom save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
