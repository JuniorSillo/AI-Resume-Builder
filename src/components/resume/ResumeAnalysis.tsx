"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertTriangle, CheckCircle, Plus, ArrowRight } from "lucide-react";
import { getResumeScore, suggestKeywords } from "@/lib/utils";
import { toast } from "sonner";

export function ResumeAnalysis() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  const resumeScore = activeResume?.score || getResumeScore(JSON.stringify(activeResume));

  function analyzeResume() {
    setAnalyzingResume(true);

    // Simulate AI analysis with a timeout
    setTimeout(() => {
      if (activeResumeId && activeResume) {
        // Update the resume score
        updateResume(activeResumeId, {
          score: Math.min(Math.max(resumeScore + 5, 0), 100), // Increase score but keep within 0-100
        });

        setShowDetailedAnalysis(true);
        setAnalyzingResume(false);
        toast.success("Resume analysis completed");
      } else {
        setAnalyzingResume(false);
        toast.error("Unable to analyze resume");
      }
    }, 2000);
  }

  // Helper function to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  // Helper function to determine progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Check completeness of different resume sections
  const sections = [
    {
      name: "Personal Information",
      complete: !!activeResume?.personalInfo.summary && !!activeResume?.personalInfo.jobTitle,
      score: activeResume?.personalInfo.summary ? 100 : (activeResume?.personalInfo.firstName ? 50 : 0),
      tips: activeResume?.personalInfo.summary ? [] : ["Add a professional summary to increase visibility", "Include your job title for better search matches"]
    },
    {
      name: "Work Experience",
      complete: (activeResume?.experiences?.length || 0) > 0 &&
               activeResume?.experiences?.every(exp => exp.highlights.length > 0),
      score: (activeResume?.experiences?.length || 0) > 1 ?
             (activeResume?.experiences?.every(exp => exp.highlights.length > 2) ? 100 : 75) :
             ((activeResume?.experiences?.length || 0) === 1 ? 50 : 0),
      tips: (activeResume?.experiences?.length || 0) === 0 ?
            ["Add at least one work experience"] :
            (activeResume?.experiences?.some(exp => exp.highlights.length < 3) ?
             ["Add more bullet points to your experiences (aim for 3-5 per role)", "Use quantifiable achievements in your bullet points"] : [])
    },
    {
      name: "Education",
      complete: (activeResume?.education?.length || 0) > 0,
      score: (activeResume?.education?.length || 0) > 0 ?
             (activeResume?.education?.[0]?.description ? 100 : 75) : 0,
      tips: (activeResume?.education?.length || 0) === 0 ?
            ["Add your educational background"] :
            (!activeResume?.education?.[0]?.description ? ["Add details to your education, such as GPA, relevant coursework, or achievements"] : [])
    },
    {
      name: "Skills",
      complete: (activeResume?.skills?.length || 0) >= 5,
      score: (activeResume?.skills?.length || 0) >= 8 ? 100 :
             ((activeResume?.skills?.length || 0) >= 5 ? 75 :
              ((activeResume?.skills?.length || 0) > 0 ? 50 : 0)),
      tips: (activeResume?.skills?.length || 0) < 5 ?
            ["Add at least 5-10 relevant skills", "Organize skills by category for better readability"] : []
    },
    {
      name: "Projects",
      complete: (activeResume?.projects?.length || 0) > 0,
      score: (activeResume?.projects?.length || 0) >= 2 ? 100 :
             ((activeResume?.projects?.length || 0) === 1 ? 75 : 0),
      tips: (activeResume?.projects?.length || 0) === 0 ?
            ["Add at least one project to showcase your work", "Include technologies used in each project"] :
            ((activeResume?.projects?.length || 0) === 1 ? ["Consider adding another project to strengthen your resume"] : [])
    }
  ];

  // Calculate overall completeness
  const overallCompleteness = sections.reduce((acc, section) => acc + section.score, 0) / sections.length;

  // Get job title-specific keywords
  const jobTitle = activeResume?.personalInfo.jobTitle || "";
  const suggestedKeywordsList = suggestKeywords(jobTitle);

  // Check which keywords are already included in the resume
  const resumeText = JSON.stringify(activeResume).toLowerCase();
  const keywordsPresent = suggestedKeywordsList.filter(keyword =>
    resumeText.includes(keyword.toLowerCase())
  );
  const keywordsMissing = suggestedKeywordsList.filter(keyword =>
    !resumeText.includes(keyword.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Resume Score
              <span className={`text-2xl font-bold ${getScoreColor(resumeScore)}`}>
                {resumeScore}%
              </span>
            </CardTitle>
            <CardDescription>
              Your resume's strength based on content and ATS optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={resumeScore} className={`h-2 ${getProgressColor(resumeScore)}`} />

            <div className="mt-4 space-y-2 text-sm">
              {resumeScore < 60 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Your resume needs significant improvement to pass ATS systems</span>
                </div>
              )}
              {resumeScore >= 60 && resumeScore < 80 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Your resume is good but could be improved to increase your chances</span>
                </div>
              )}
              {resumeScore >= 80 && (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Your resume is well-optimized for ATS systems</span>
                </div>
              )}
            </div>

            <Button
              onClick={analyzeResume}
              className="w-full mt-4"
              disabled={analyzingResume}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {analyzingResume ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keyword Optimization</CardTitle>
            <CardDescription>
              Keywords relevant to your job title that should be in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <span className="text-sm font-medium">Present Keywords:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {keywordsPresent.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800">
                    {keyword}
                  </Badge>
                ))}
                {keywordsPresent.length === 0 && (
                  <span className="text-sm text-muted-foreground">No industry keywords detected</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Missing Keywords:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {keywordsMissing.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800">
                    {keyword}
                  </Badge>
                ))}
                {keywordsMissing.length === 0 && (
                  <span className="text-sm text-muted-foreground">All recommended keywords are present</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showDetailedAnalysis && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Detailed Analysis</CardTitle>
            <CardDescription>
              Section-by-section analysis and improvement suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{section.name}</span>
                    <span className={`text-sm font-medium ${getScoreColor(section.score)}`}>
                      {section.score}%
                    </span>
                  </div>
                  <Progress value={section.score} className={`h-1.5 ${getProgressColor(section.score)}`} />

                  {section.tips.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {section.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">AI Recommendations</CardTitle>
          <CardDescription>
            Specific improvements to enhance your resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeResume?.personalInfo.summary ? (
              <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-900">
                <p className="text-sm font-medium">Your professional summary is good</p>
                <p className="text-xs text-muted-foreground">
                  A strong summary helps recruiters quickly understand your value proposition.
                </p>
              </div>
            ) : (
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Add a professional summary</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  A compelling summary highlighting your expertise and career goals will make your resume stand out.
                </p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
                  <Sparkles className="mr-1 h-3 w-3" /> Generate Summary
                </Button>
              </div>
            )}

            {(activeResume?.experiences?.length || 0) > 0 &&
             activeResume?.experiences?.some(exp => exp.highlights.length < 3) && (
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Enhance work experience descriptions</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Add more quantifiable achievements to your bullet points (numbers, percentages, etc.).
                </p>
              </div>
            )}

            {(activeResume?.skills?.length || 0) < 5 && (
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Add more relevant skills</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Include both technical and soft skills relevant to your target position.
                </p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
                  <Sparkles className="mr-1 h-3 w-3" /> Suggest Skills
                </Button>
              </div>
            )}

            {keywordsMissing.length > 0 && (
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Include industry keywords</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Add these keywords naturally throughout your resume to improve ATS matching:
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {keywordsMissing.slice(0, 5).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white dark:bg-slate-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {overallCompleteness >= 80 && (
              <div className="p-3 border rounded-md border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">Your resume is well-optimized</p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Great job! Your resume is comprehensive and well-structured. Continue to tailor it for specific job applications.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
