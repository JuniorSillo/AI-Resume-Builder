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
import { Resume, PersonalInfo, Experience, Education, Skill, Project, Certificate, Language } from "@/lib/types";

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [previewMode, setPreviewMode] = useState(false);

  const router = useRouter();
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yOffset = margin;

    // Helper function to check for page overflow
    const checkPageOverflow = (additionalHeight: number) => {
      if (yOffset + additionalHeight > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
      }
    };

    // Helper function to add wrapped text
    const addWrappedText = (text: string, x: number, fontSize: number, maxWidth: number, align: 'left' | 'center' = 'left') => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      checkPageOverflow(lines.length * fontSize * 0.5);
      lines.forEach((line: string) => {
        const xPos = align === 'center' ? (pageWidth - doc.getTextWidth(line)) / 2 : x;
        doc.text(line, xPos, yOffset);
        yOffset += fontSize * 0.4;
      });
    };

    // Set default font
    doc.setFont(activeResume?.templateFont || "helvetica", "normal");

    // Add Header (Personal Info)
    if (activeResume?.personalInfo) {
      // Name (centered, bold, large)
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      const fullName = `${activeResume.personalInfo.firstName || ""} ${activeResume.personalInfo.lastName || ""}`.trim();
      addWrappedText(fullName || "Name", margin, 16, maxWidth, 'center');
      yOffset += 4;

      // Contact Info (single line, centered)
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      const contactParts = [
        activeResume.personalInfo.phone || "",
        activeResume.personalInfo.email || "",
        activeResume.personalInfo.linkedIn ? `linkedin.com/in/${activeResume.personalInfo.linkedIn}` : "",
        activeResume.personalInfo.github ? `github.com/${activeResume.personalInfo.github}` : "",
      ].filter(Boolean);
      const contactText = contactParts.join(" | ");
      addWrappedText(contactText || "No contact info", margin, 10, maxWidth, 'center');
      yOffset += 8;
    }

    // Add Summary
    if (activeResume?.personalInfo?.summary) {
      checkPageOverflow(20);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(activeResume?.templateColor || "#000000");
      addWrappedText("Summary", margin, 12, maxWidth);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
      yOffset += 4;
      addWrappedText(activeResume.personalInfo.summary, margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Experience
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Experience", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.experiences?.length) {
      activeResume.experiences.forEach((exp) => {
        checkPageOverflow(40);
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        addWrappedText(`${exp.position || "Position"} at ${exp.company || "Company"}`, margin, 11, maxWidth);
        doc.setFont(undefined, "normal");
        yOffset += 2;
        const dateText = exp.current ? `${exp.startDate || "Start"} - Present` : `${exp.startDate || "Start"} - ${exp.endDate || "End"}`;
        addWrappedText(dateText, margin, 10, maxWidth);
        yOffset += 2;
        if (exp.location) {
          addWrappedText(exp.location, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (exp.description) {
          addWrappedText(exp.description, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (exp.highlights?.length) {
          exp.highlights.forEach((highlight) => {
            checkPageOverflow(10);
            addWrappedText(`• ${highlight}`, margin + 5, 10, maxWidth - 5);
            yOffset += 2;
          });
        }
        yOffset += 4;
      });
    } else {
      addWrappedText("No experience listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Education
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Education", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.education?.length) {
      activeResume.education.forEach((edu) => {
        checkPageOverflow(20);
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        addWrappedText(edu.institution || "Institution", margin, 11, maxWidth);
        doc.setFont(undefined, "normal");
        yOffset += 2;
        const degreeLine = `${edu.degree || "Degree"}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}`;
        addWrappedText(degreeLine, margin, 10, maxWidth);
        yOffset += 2;
        addWrappedText(`${edu.startDate || "Start"} - ${edu.endDate || "End"}`, margin, 10, maxWidth);
        yOffset += 4;
      });
    } else {
      addWrappedText("No education listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Skills
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Technical Skills", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.skills?.length) {
      const skillsByCategory: Record<string, Skill[]> = {};
      activeResume.skills.forEach((skill) => {
        const category = skill.category || "Other";
        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
        }
        skillsByCategory[category].push(skill);
      });
      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        checkPageOverflow(15);
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        addWrappedText(category, margin, 11, maxWidth);
        doc.setFont(undefined, "normal");
        yOffset += 2;
        const skillsText = skills.map((skill) => skill.name).join(", ");
        addWrappedText(skillsText || "No skills listed", margin, 10, maxWidth);
        yOffset += 4;
      });
    } else {
      addWrappedText("No skills listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Projects
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Projects", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.projects?.length) {
      activeResume.projects.forEach((project) => {
        checkPageOverflow(30);
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        const projectLine = `${project.name || "Project"} ${project.technologies?.length ? `(${project.technologies.join(", ")})` : ""}`;
        addWrappedText(projectLine, margin, 11, maxWidth);
        doc.setFont(undefined, "normal");
        yOffset += 2;
        if (project.description) {
          addWrappedText(project.description, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (project.url) {
          addWrappedText(`URL: ${project.url}`, margin, 10, maxWidth);
          yOffset += 2;
        }
        yOffset += 4;
      });
    } else {
      addWrappedText("No projects listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Certifications
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Certifications", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.certificates?.length) {
      activeResume.certificates.forEach((cert) => {
        checkPageOverflow(20);
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        addWrappedText(`${cert.name || "Certificate"} - ${cert.issuer || "Issuer"}`, margin, 11, maxWidth);
        doc.setFont(undefined, "normal");
        yOffset += 2;
        addWrappedText(`Issued: ${cert.issueDate || "Unknown"}`, margin, 10, maxWidth);
        yOffset += 4;
      });
    } else {
      addWrappedText("No certifications listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Languages
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    addWrappedText("Languages", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    yOffset += 4;

    if (activeResume?.languages?.length) {
      const languagesText = activeResume.languages
        .map((lang) => `${lang.name} (${lang.proficiency})`)
        .join(", ");
      addWrappedText(languagesText || "No languages listed", margin, 10, maxWidth);
    } else {
      addWrappedText("No languages listed", margin, 10, maxWidth);
    }
    yOffset += 8;

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
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
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
