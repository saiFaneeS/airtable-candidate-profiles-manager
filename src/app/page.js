"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Mail,
  MapPin,
  Eye,
  Briefcase,
  Search,
  Filter,
} from "lucide-react";
import Airtable from "airtable";
import Link from "next/link";

const Index = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      const base = new Airtable({
        apiKey:
          "patxXaUUP8Gq7p4d1.e5686590bdaefa8f09a99c4b0ab197b65561f1f3243fff28c2fdafc527692712",
      }).base("app8Pvtc8HMJZpuw0");

      try {
        const fetchedRecords = await base("Candidates").select().firstPage();
        setRecords([...fetchedRecords]);
      } catch (err) {
        console.error("Airtable fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "bg-primary";
    const colors = [
      "bg-primary",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-rose-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Filtered records based on search
  const filteredRecords = records.filter((record) => {
    const fields = record.fields;
    const searchText = search.toLowerCase();
    return (
      (fields["Candidate Name"] || "").toLowerCase().includes(searchText) ||
      (fields.Email || "").toLowerCase().includes(searchText) ||
      (fields.Location || "").toLowerCase().includes(searchText) ||
      (fields["Current Role"] || "").toLowerCase().includes(searchText) ||
      (fields["Current Company"] || "").toLowerCase().includes(searchText) ||
      (fields.Skills || "").toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface  w-64"></div>
          <div className="h-4 bg-surface  w-48"></div>
          <div className="space-y-3 mt-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface "></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-surface">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                All Candidates
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {filteredRecords.length} candidates
              </Badge>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidates..."
                  className="pl-10 pr-3 py-2 rounded border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[200px]"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredRecords.length === 0 ? (
          <Card className="border-0 shadow-elegant bg-gradient-surface">
            <CardContent className="p-16 text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No candidates found
              </h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => {
              const fields = record.fields;
              const photoUrl = fields.Photo?.[0]?.url;

              return (
                <Card
                  key={record.id}
                  className="border h-fit shadow-elegant bg-gradient-surface hover:shadow-glow transition-all duration-300 group cursor-pointer"
                >
                  <CardContent className="">
                    {/* Avatar and Name */}
                    <div className="flex items-center space-x-4 mb-4">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={fields["Candidate Name"] || "Candidate"}
                          className="w-14 h-14 -full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 -full flex items-center justify-center text-white font-semibold ${getAvatarColor(
                            fields["Candidate Name"]
                          )}`}
                        >
                          {getInitials(fields["Candidate Name"])}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg truncate">
                          {fields["Candidate Name"] || "Unknown Candidate"}
                        </h3>
                        <p className="text-primary text-sm font-medium truncate">
                          {fields["Current Role"] || "Position not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Company */}
                    {fields["Current Company"] && (
                      <div className="flex items-center text-text-subtle mb-3">
                        <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {fields["Current Company"]}
                        </span>
                      </div>
                    )}

                    {/* Email */}
                    {fields.Email && (
                      <div className="flex items-center text-text-subtle mb-3">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{fields.Email}</span>
                      </div>
                    )}

                    {/* Location */}
                    {fields.Location && (
                      <div className="flex items-center text-text-subtle mb-4">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {fields.Location}
                        </span>
                      </div>
                    )}

                    {/* Skills Preview */}
                    {fields.Skills && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {fields.Skills.split(",")
                            .slice(0, 3)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-1"
                              >
                                {skill.trim()}
                              </Badge>
                            ))}
                          {fields.Skills.split(",").length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              +{fields.Skills.split(",").length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link href={`/user/${record.id}`} className="block">
                      <Button className="">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
