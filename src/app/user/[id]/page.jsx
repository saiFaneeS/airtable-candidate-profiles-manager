"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  User,
  Globe,
  Calendar,
  Mail,
  MapPin,
  Clock,
  Award,
  Star,
  Video,
  ExternalLink,
  Hash,
  TrendingUp,
} from "lucide-react";
import Airtable from "airtable";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"; // Add this import if you have a Textarea component

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      const base = new Airtable({
        apiKey:
          "patxXaUUP8Gq7p4d1.e5686590bdaefa8f09a99c4b0ab197b65561f1f3243fff28c2fdafc527692712",
      }).base("app8Pvtc8HMJZpuw0");

      try {
        const record = await base("Candidates").find(id);
        setCandidate(record);
      } catch (err) {
        console.error("Error fetching candidate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // You can add logic to send feedback to your backend or Airtable here
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

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

  const parseList = (listString) => {
    if (!listString) return [];
    return listString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400/50 text-amber-400" />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  // Helper to get embeddable video URL (supports YouTube)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // YouTube link
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Add more platforms as needed
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted  w-64"></div>
          <div className="h-4 bg-muted  w-48"></div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Candidate not found
          </h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fields = candidate.fields;
  const photoUrl = fields.Photo?.[0]?.url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-muted/50 border">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Candidates
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Header Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/10 border">
              <CardContent className="">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {photoUrl ? (
                    <img
                      src={photoUrl || "/placeholder.svg"}
                      alt={fields["Candidate Name"] || "Candidate"}
                      className="w-36 h-36 -full object-cover border-4 border-primary/20 shadow-lg"
                    />
                  ) : (
                    <div
                      className={`w-36 h-36 shrink-0 flex items-center justify-center text-white font-bold text-3xl border-4 border-primary/20 shadow-lg ${getAvatarColor(
                        fields["Candidate Name"]
                      )}`}
                    >
                      {getInitials(fields["Candidate Name"])}
                    </div>
                  )}
                  <div className="text-center md:text-left flex-grow">
                    <h1 className="text-4xl font-bold text-foreground mb-3">
                      {fields["Candidate Name"] || "Unknown Candidate"}
                    </h1>
                    <p className="text-xl text-primary font-semibold mb-4">
                      {fields["Current Role"] || "Position not specified"}
                    </p>

                    {/* Profile Summary */}
                    {fields["Profile Summary"]?.value && (
                      <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                        {fields["Profile Summary"].value}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-6 text-muted-foreground">
                      {fields.Location && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-primary" />
                          <span>{fields.Location}</span>
                        </div>
                      )}
                      {fields["Experience (Years)"] && (
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-primary" />
                          <span>
                            {fields["Experience (Years)"]} years experience
                          </span>
                        </div>
                      )}
                      {fields.Email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 mr-2 text-primary" />
                          <span>{fields.Email}</span>
                        </div>
                      )}
                      {fields.Created && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-primary" />
                          <span>Joined {formatDate(fields.Created)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Card className="border-0 shadow-lg border">
              <CardContent className="">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-muted -lg border">
                    <TabsTrigger
                      value="about"
                      className="flex items-center -md"
                    >
                      <User className="w-4 h-4 mr-2" />
                      About
                    </TabsTrigger>
                    <TabsTrigger
                      value="experience"
                      className="flex items-center -md"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Experience
                    </TabsTrigger>
                    <TabsTrigger
                      value="education"
                      className="flex items-center -md"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Education
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-8 space-y-8">
                    {/* Introduction Videos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fields["Intro Video"] && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                            <Video className="w-5 h-5 mr-2 text-primary" />
                            Introduction Video
                          </h3>
                          <div className="relative w-full h-0 pb-[56.25%] -xl overflow-hidden shadow-lg">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={fields["Intro Video"]}
                              title="Introduction Video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {fields["Intro Video Link"] && (
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                            <Video className="w-5 h-5 mr-2 text-primary" />
                            Video Call Link
                          </h3>
                          <div className="relative w-full h-0 pb-[56.25%] -xl overflow-hidden shadow-lg">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src={getEmbedUrl(fields["Intro Video Link"])}
                              title="Video Call"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {fields.Skills && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-foreground flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                            Skills
                          </h3>
                          {fields["Skill Count"] && (
                            <Badge
                              variant="secondary"
                              className="flex items-center"
                            >
                              <Hash className="w-3 h-3 mr-1" />
                              {fields["Skill Count"]} skills
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {parseList(fields.Skills).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Strengths */}
                    {fields["Key Strengths"] && (
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          Key Strengths
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {parseList(fields["Key Strengths"]).map(
                            (strength, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="px-4 py-2 text-sm font-medium border-emerald-200 text-emerald-700 bg-emerald-50"
                              >
                                {strength}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Achievements */}
                    {fields["Key Achievements"] && (
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          Key Achievements
                        </h3>
                        <div className="space-y-4">
                          {parseList(fields["Key Achievements"]).map(
                            (achievement, index) => (
                              <div
                                key={index}
                                className="flex items-start p-4 bg-muted/30 -lg"
                              >
                                <Award className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                                <span className="text-foreground leading-relaxed">
                                  {achievement}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="experience" className="mt-8 space-y-8">
                    {/* Work History */}
                    {fields["Work History"] && (
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          Work History
                        </h3>
                        <Card className="p-6 bg-muted/30">
                          <p className="text-foreground leading-relaxed">
                            {fields["Work History"]}
                          </p>
                        </Card>
                      </div>
                    )}

                    {/* Current Role */}
                    {(fields["Current Role"] || fields["Current Company"]) && (
                      <div className="border border-border -lg p-6 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="flex items-center mb-2">
                          <Badge className="mr-3">Current</Badge>
                          <h3 className="text-xl font-semibold text-foreground">
                            {fields["Current Role"]}{" "}
                            {fields["Current Company"] &&
                              `at ${fields["Current Company"]}`}
                          </h3>
                        </div>
                        {fields["Current Dates"] && (
                          <p className="text-muted-foreground">
                            {fields["Current Dates"]}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Previous Role */}
                    {(fields["Previous Role"] ||
                      fields["Previous Company"]) && (
                      <div className="border border-border -lg p-6 bg-muted/20">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {fields["Previous Role"]}{" "}
                          {fields["Previous Company"] &&
                            `at ${fields["Previous Company"]}`}
                        </h3>
                        <div className="flex gap-4 text-muted-foreground text-sm">
                          {fields["Previous Dates"] && (
                            <span>{fields["Previous Dates"]}</span>
                          )}
                          {fields["Previous Location"] && (
                            <>
                              <span>•</span>
                              <span>{fields["Previous Location"]}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="education" className="mt-8">
                    {fields.Education && (
                      <div className="border border-border -lg p-6 bg-muted/20">
                        <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                          {fields.Education}
                        </h3>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manager Rating */}
            {fields["Manager Rating"] && (
              <Card className="border-0 shadow-lg border">
                <CardContent className="">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Manager Rating
                  </h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">
                      {renderStarRating(fields["Manager Rating"])}
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      {fields["Manager Rating"]}
                    </span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                  <Progress
                    value={(fields["Manager Rating"] / 5) * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            )}

            {/* Role & Availability */}
            <Card className="border-0 shadow-lg border">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Role & Availability
                </h3>
                {fields["Preferred Role"] && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Preferred Role:
                    </p>
                    <p className="font-medium text-foreground">
                      {fields["Preferred Role"]}
                    </p>
                  </div>
                )}
                {fields.Availability && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Availability:
                    </p>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      <p className="font-medium text-foreground">
                        {fields.Availability}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-lg border">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Contact
                </h3>
                {fields["Calendly Link"] ? (
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <a
                      href={fields["Calendly Link"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Meeting Link
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Additional Information
                </h3>
                {fields.Languages && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Languages:
                    </p>
                    <p className="font-medium text-foreground">
                      {fields.Languages}
                    </p>
                  </div>
                )}
                {fields.Certifications && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Certifications:
                    </p>
                    <p className="font-medium text-foreground">
                      {fields.Certifications}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="border-0 shadow-lg">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Feedback
                </h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Leave your feedback about this candidate..."
                    rows={3}
                    className="resize-none"
                  />
                  <Button type="submit" disabled={!feedback.trim() || feedbackSubmitted}>
                    Submit
                  </Button>
                  {feedbackSubmitted && (
                    <p className="text-green-600 text-sm mt-2">Feedback submitted!</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
