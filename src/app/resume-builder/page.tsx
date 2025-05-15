"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, FileDown, Eye, Share2, Stars } from "lucide-react";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeAnalysis } from "@/components/resume/ResumeAnalysis";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

// Define interfaces for resume data
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  website?: string;
  location?: string;
  jobTitle?: string;
  summary?: string;
}

interface Experience {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

interface Project {
  title?: string;
  description?: string;
}

interface Resume {
  id: string;
  title?: string;
  personalInfo: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
}

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [previewMode, setPreviewMode] = useState(false);

  const router = useRouter();
  const resumes = useAppStore((state: { resumes: Resume[] }) => state.resumes);
  const activeResumeId = useAppStore((state: { activeResumeId: string }) => state.activeResumeId);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const tabs = [
    { id: "personal-info", label: "Personal Info", component: <PersonalInfoForm /> },
    { id: "experience", label: "Experience", component: <ExperienceForm /> },
    { id: "education", label: "Education", component: <EducationForm /> },
    { id: "skills", label: "Skills", component: <SkillsForm /> },
    { id: "projects", label: "Projects", component: <ProjectsForm /> },
    { id: "template", label: "Template", component: <TemplateSelector /> },
    { id: "analysis", label: "AI Analysis", component: <ResumeAnalysis /> },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    } else {
      setPreviewMode(true);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleExport = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Add Personal Info
    if (activeResume?.personalInfo) {
      doc.setFontSize(16);
      const fullName = `${activeResume.personalInfo.firstName || ""} ${activeResume.personalInfo.lastName || ""}`.trim();
      doc.text(fullName || "Name", 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      doc.text(activeResume.personalInfo.email || "Email", 20, yOffset);
      yOffset += 8;
      doc.text(activeResume.personalInfo.phone || "Phone", 20, yOffset);
      yOffset += 8;
      doc.text(activeResume.personalInfo.location || "Location", 20, yOffset);
      yOffset += 8;
      doc.text(activeResume.personalInfo.jobTitle || "Job Title", 20, yOffset);
      yOffset += 12;
      if (activeResume.personalInfo.summary) {
        doc.text("Summary", 20, yOffset);
        yOffset += 8;
        doc.text(activeResume.personalInfo.summary, 20, yOffset, { maxWidth: 170 });
        yOffset += 20;
      }
    }

    // Add Experience
    if (activeResume?.experience?.length) {
      doc.setFontSize(14);
      doc.text("Experience", 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      activeResume.experience.forEach((exp) => {
        doc.text(`${exp.title || "Position"} at ${exp.company || "Company"}`, 20, yOffset);
        yOffset += 7;
        doc.text(`${exp.startDate || "Start"} - ${exp.endDate || "Present"}`, 20, yOffset);
        yOffset += 7;
        doc.text(exp.description || "", 20, yOffset, { maxWidth: 170 });
        yOffset += 15;
      });
      yOffset += 10;
    }

    // Add Education
    if (activeResume?.education?.length) {
      doc.setFontSize(14);
      doc.text("Education", 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      activeResume.education.forEach((edu) => {
        doc.text(`${edu.degree || "Degree"}, ${edu.institution || "Institution"}`, 20, yOffset);
        yOffset += 7;
        doc.text(`${edu.startDate || "Start"} - ${edu.endDate || "End"}`, 20, yOffset);
        yOffset += 15;
      });
      yOffset += 10;
    }

    // Add Skills
    if (activeResume?.skills?.length) {
      doc.setFontSize(14);
      doc.text("Skills", 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      doc.text(activeResume.skills.join(", "), 20, yOffset, { maxWidth: 170 });
      yOffset += 20;
    }

    // Add Projects
    if (activeResume?.projects?.length) {
      doc.setFontSize(14);
      doc.text("Projects", 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      activeResume.projects.forEach((project) => {
        doc.text(project.title || "Project", 20, yOffset);
        yOffset += 7;
        doc.text(project.description || "", 20, yOffset, { maxWidth: 170 });
        yOffset += 15;
      });
    }

    // Save the PDF
    doc.save(`${activeResume?.title || "resume"}.pdf`);
  };

  if (previewMode) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <ResumePreview />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {activeResume?.title || "My Resume"}
              </CardTitle>
              <CardDescription>
                Complete each section to create your professional resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 w-full max-w-full overflow-auto grid grid-cols-3 md:grid-cols-7">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="px-3 py-2">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="p-1">
                    {tab.component}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTabIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                {currentTabIndex === tabs.length - 1 ? "Preview" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stars className="mr-2 h-5 w-5 text-blue-500" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI assistant is analyzing your resume and has some suggestions:
              </p>

              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                  <p className="text-sm font-medium">Add more quantifiable achievements</p>
                  <p className="text-xs text-muted-foreground">
                    Including specific metrics will make your resume stand out.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                  <p className="text-sm font-medium">Consider adding certifications</p>
                  <p className="text-xs text-muted-foreground">
                    Certifications can boost your credibility in your field.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-900">
                  <p className="text-sm Novembre font-medium text-blue-700 dark:text-blue-400">
                    Try the "Modern" template
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">
                    Based on your industry, this template has a 92% success rate.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-sm" onClick={() => setPreviewMode(true)}>
                <Eye className="mr-2 h-4 w-4" /> Preview Resume
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Resume Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tabs.map((tab, index) => (
                  <div key={tab.id} className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                        index <= currentTabIndex ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentTabIndex ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        index === currentTabIndex ? "font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
