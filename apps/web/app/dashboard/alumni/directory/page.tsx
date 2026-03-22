"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AlumniUser = {
  id: string;
  name: string;
  email: string;
  year: string | null;
  major: string | null;
  company: string | null;
  location: string | null;
  skills: string[];
};

export default function AlumniDirectory() {
  const [users, setUsers] = useState<AlumniUser[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAlumni();
  }, [page, selectedYear]);

  function fetchAlumni(searchQuery?: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery || search) params.set("search", searchQuery ?? search);
    if (selectedYear) params.set("year", selectedYear);
    params.set("page", String(page));
    params.set("limit", "12");

    fetch(`/api/alumni/directory?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setYears(data.years || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function handleSearch() {
    setPage(1);
    fetchAlumni(search);
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Alumni Directory
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and connect with {total} alumni from Saraswati Vidya Mandira.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Search by name, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Batches</option>
          {years.map((y) => (
            <option key={y} value={y}>
              Class of {y}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading alumni...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No alumni found. Try a different search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Link key={user.id} href={`/dashboard/alumni/${user.id}`}>
              <Card className="border-2 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2">
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {user.name}
                      </h3>
                      {user.year && (
                        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" /> Class of{" "}
                          {user.year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {user.company && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user.company}</span>
                      </p>
                    )}
                    {user.location && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user.location}</span>
                      </p>
                    )}
                  </div>

                  {user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {user.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
