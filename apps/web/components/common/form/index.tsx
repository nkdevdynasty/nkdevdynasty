"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AlumniForm() {
  return (
    <div className="flex justify-center px-6 pb-16 py-24">
      <div className="w-full max-w-2xl bg-card p-8 rounded-2xl shadow-xl space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Alumni Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your details to receive your login credentials
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Enter your full name" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="chem">Chemistry</SelectItem>
                <SelectItem value="phy">Physics</SelectItem>
                <SelectItem value="geo">Geography</SelectItem>
                <SelectItem value="botany">Botany</SelectItem>
                <SelectItem value="zoology">Zoology</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Passing Year */}
          <div className="space-y-2">
            <Label>Passing Year</Label>
            <Input type="number" placeholder="e.g. 2022" />
          </div>

          {/* Roll Number (Full Width) */}
          <div className="space-y-2 md:col-span-2">
            <Label>University Roll Number</Label>
            <Input placeholder="Enter your roll number" />
          </div>

          {/* Submit Button (Full Width) */}
          <div className="md:col-span-2">
            <Button className="w-full h-11 text-base">Submit Details</Button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          Your details will be verified before granting access.
        </p>
      </div>
    </div>
  );
}
