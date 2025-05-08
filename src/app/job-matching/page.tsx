"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Job } from "@/lib/types";
import { toast } from "sonner";
import { Sparkles, BriefcaseIcon, MapPinIcon, SearchIcon, ArrowRightIcon, CheckCircleIcon, DollarSign, CalendarIcon, Building } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function JobMatching() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const savedJobs = useAppStore((state) => state.savedJobs);
  const saveJob = useAppStore((state) => state.saveJob);
  const removeJob = useAppStore((state) => state.removeJob);
  const addJobApplication = useAppStore((state) => state.addJobApplication);

  const activeResume = resumes.find(r => r.id === activeResumeId);

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [datePosted, setDatePosted] = useState("anytime");
  const [viewMode, setViewMode] = useState("matches");
  const [searchingJobs, setSearchingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const matchedJobs = savedJobs.filter(job => job.matchScore && job.matchScore >= 70);
  const goodFitJobs = savedJobs.filter(job => job.matchScore && job.matchScore >= 50 && job.matchScore < 70);
  const otherJobs = savedJobs.filter(job => !job.matchScore || job.matchScore < 50);

  const handleSearch = () => {
    if (!activeResume) {
      toast.error("Please select a resume first");
      return;
    }

    setSearchingJobs(true);

    // Simulate job search with timeout
    setTimeout(() => {
      // In a real app, we would call an external API to search for jobs
      toast.success(`Found jobs matching "${searchQuery || activeResume.personalInfo.jobTitle || "your profile"}"`);
      setSearchingJobs(false);
    }, 2000);
  };

  const handleApplyToJob = (job: Job) => {
    if (!activeResumeId) {
      toast.error("Please select a resume first");
      return;
    }

    addJobApplication({
      jobId: job.id,
      resumeId: activeResumeId,
      status: "Applied",
      dateApplied: new Date().toISOString(),
      company: job.company,
      position: job.title,
    });

    toast.success(`Applied to ${job.title} at ${job.company}`);
  };

  // Function to get match score color based on percentage
  const getMatchScoreColor = (score: number | undefined) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  // Function to get progress color based on percentage
  const getProgressColor = (score: number | undefined) => {
    if (!score) return "bg-gray-300";
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-green-600";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Matching</h1>
          <p className="text-muted-foreground">
            Find jobs that match your resume and apply with one click
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <Input
            placeholder="Job title, keyword, or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button
            onClick={handleSearch}
            disabled={searchingJobs}
          >
            {searchingJobs ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="location" className="text-sm font-medium block mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="jobType" className="text-sm font-medium block mb-1">
                  Job Type
                </label>
                <Select
                  value={jobType}
                  onValueChange={setJobType}
                >
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="datePosted" className="text-sm font-medium block mb-1">
                  Date Posted
                </label>
                <Select
                  value={datePosted}
                  onValueChange={setDatePosted}
                >
                  <SelectTrigger id="datePosted">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Any time</SelectItem>
                    <SelectItem value="today">Past 24 hours</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setLocation("");
                    setJobType("all");
                    setDatePosted("anytime");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Resume Match Score</CardTitle>
              <CardDescription>
                How well your resume matches job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Great Match (90%+)</span>
                  <span className="text-sm text-green-500">Apply Now</span>
                </div>
                <Progress value={100} className="h-2 bg-gray-100 dark:bg-gray-800">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                </Progress>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Good Match (70-89%)</span>
                  <span className="text-sm text-green-600">Strong Candidate</span>
                </div>
                <Progress value={80} className="h-2 bg-gray-100 dark:bg-gray-800">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: "80%" }}></div>
                </Progress>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Potential Match (50-69%)</span>
                  <span className="text-sm text-amber-500">Consider Applying</span>
                </div>
                <Progress value={60} className="h-2 bg-gray-100 dark:bg-gray-800">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }}></div>
                </Progress>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Low Match (Below 50%)</span>
                  <span className="text-sm text-red-500">Needs Improvement</span>
                </div>
                <Progress value={30} className="h-2 bg-gray-100 dark:bg-gray-800">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "30%" }}></div>
                </Progress>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          {!selectedJob ? (
            <>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="mb-4">
                  <TabsTrigger value="matches">Best Matches</TabsTrigger>
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="matches" className="space-y-4">
                  {matchedJobs.length > 0 ? (
                    <>
                      <h2 className="text-lg font-semibold mb-2">Great Matches</h2>
                      {matchedJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onViewDetails={() => setSelectedJob(job)}
                          onApply={() => handleApplyToJob(job)}
                          onSave={() => {}}
                        />
                      ))}

                      {goodFitJobs.length > 0 && (
                        <>
                          <h2 className="text-lg font-semibold mb-2 mt-6">Good Fits</h2>
                          {goodFitJobs.map((job) => (
                            <JobCard
                              key={job.id}
                              job={job}
                              onViewDetails={() => setSelectedJob(job)}
                              onApply={() => handleApplyToJob(job)}
                              onSave={() => {}}
                            />
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No job matches found</h3>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find any jobs that match your resume. Try adjusting your filters or search criteria.
                      </p>
                      <Button onClick={handleSearch}>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Find Jobs
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                  {savedJobs.length > 0 ? (
                    savedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={() => setSelectedJob(job)}
                        onApply={() => handleApplyToJob(job)}
                        onSave={() => {}}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                      <p className="text-muted-foreground mb-4">
                        Use the search bar to find jobs that match your skills and experience.
                      </p>
                      <Button onClick={handleSearch}>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Search Jobs
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="space-y-4">
                  {savedJobs.length > 0 ? (
                    savedJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        saved
                        onViewDetails={() => setSelectedJob(job)}
                        onApply={() => handleApplyToJob(job)}
                        onSave={() => removeJob(job.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved jobs</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't saved any jobs yet. Save jobs to apply to them later.
                      </p>
                      <Button onClick={() => setViewMode("all")}>
                        <ArrowRightIcon className="mr-2 h-4 w-4" />
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // Job Details View
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      {selectedJob.company}
                      <span className="mx-2">•</span>
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {selectedJob.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    {selectedJob.matchScore && (
                      <div className={`text-sm font-bold ${getMatchScoreColor(selectedJob.matchScore)}`}>
                        {selectedJob.matchScore}% Match
                      </div>
                    )}
                    {selectedJob.salary && (
                      <div className="text-sm text-muted-foreground mt-1 flex items-center justify-end">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {selectedJob.salary}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex">
                        <span className="text-muted-foreground mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedJob.matchScore && selectedJob.matchScore >= 50 && (
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md">
                    <h3 className="font-medium mb-2 flex items-center text-green-700 dark:text-green-400">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Why You're a Good Match
                    </h3>
                    <ul className="text-sm space-y-1 text-green-700 dark:text-green-400">
                      <li>• Your {activeResume?.skills.slice(0, 3).map(s => s.name).join(", ")} skills align with the job requirements</li>
                      <li>• Your {activeResume?.experiences[0]?.position} experience at {activeResume?.experiences[0]?.company} is relevant</li>
                      <li>• Your resume includes 80% of the keywords mentioned in the job description</li>
                    </ul>
                  </div>
                )}

                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Posted: {selectedJob.datePosted ? formatDate(new Date(selectedJob.datePosted)) : "Recently"}
                  <span className="mx-2">•</span>
                  Source: {selectedJob.source || "Job Board"}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Back to Jobs
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline"
                    onClick={() => {
                      window.open(selectedJob.url, "_blank");
                    }}
                  >
                    View Original
                  </Button>
                  <Button onClick={() => handleApplyToJob(selectedJob)}>
                    Apply Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({
  job,
  saved = false,
  onViewDetails,
  onApply,
  onSave
}: {
  job: Job,
  saved?: boolean,
  onViewDetails: () => void,
  onApply: () => void,
  onSave: () => void
}) {
  // Get match score color
  const getMatchColor = (score: number | undefined) => {
    if (!score) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (score >= 70) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 50) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6">
        <div className="md:col-span-3 lg:col-span-5 p-4 md:p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-lg hover:text-primary cursor-pointer" onClick={onViewDetails}>
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center">
                <Building className="h-3 w-3 mr-1" />
                {job.company}
                <span className="mx-2">•</span>
                <MapPinIcon className="h-3 w-3 mr-1" />
                {job.location}
              </p>
            </div>
            {job.matchScore && (
              <Badge className={getMatchColor(job.matchScore)}>
                {job.matchScore}% Match
              </Badge>
            )}
          </div>

          <p className="text-sm line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">
                {req.split(' ').slice(0, 3).join(' ')}
                {req.split(' ').length > 3 ? '...' : ''}
              </Badge>
            ))}
            {job.requirements.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Posted: {job.datePosted ? formatDate(new Date(job.datePosted)) : "Recently"}
            {job.salary && (
              <>
                <span className="mx-2">•</span>
                <DollarSign className="h-3 w-3 mr-1" />
                {job.salary}
              </>
            )}
            {job.source && (
              <>
                <span className="mx-2">•</span>
                via {job.source}
              </>
            )}
          </div>
        </div>

        <div className="md:border-l flex md:flex-col justify-end md:justify-center items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900">
          <Button onClick={onApply} size="sm" className="w-full">
            Apply
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={onSave}>
            {saved ? "Unsave" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={onViewDetails}>
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
