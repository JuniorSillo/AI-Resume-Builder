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

    // Helper function to clean text (fix OCR errors)
    const cleanText = (text: string): string => {
      return text
        .replace(/\$(\d+%)\$/g, "$1") // Fix $35% → 35%
        .replace(/\$\\mathrm{(.*)}\//g, "$1/") // Fix $\mathrm{Cl} / \mathrm{CD}$ → CI/CD
        .replace(/linkedin\.com\/in\/linkedin\.com\/in\//g, "linkedin.com/in/") // Fix LinkedIn URL
        .replace(/Though\s+the\s+migration[\s\S]*?(?=- Led a team)/, "") // Remove duplicate text
        .replace(/metics/g, "metrics") // Fix metrics
        .replace(/residented/i, "Frontend") // Fix residented → Frontend
        .replace(/dected/, "Reduced") // Fix dedected → Reduced
        .trim();
    };

    // Helper function to check for page overflow
    const checkPageOverflow = (additionalHeight: number) => {
      if (yOffset + additionalHeight > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
      }
    };

    // Helper function to add wrapped text with overflow handling
    const addWrappedText = (text: string, x: number, fontSize: number, maxWidth: number, align: 'left' | 'center' = 'left') => {
      doc.setFontSize(fontSize);
      const cleanedText = cleanText(text);
      const lines = doc.splitTextToSize(cleanedText, maxWidth);
      const lineHeight = fontSize * 0.35; // Adjusted for better readability
      lines.forEach((line: string) => {
        checkPageOverflow(lineHeight);
        const lineWidth = doc.getTextWidth(line);
        if (lineWidth > maxWidth) {
          // Split long lines further
          const words = line.split(" ");
          let currentLine = "";
          words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (doc.getTextWidth(testLine) <= maxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                const xPos = align === 'center' ? (pageWidth - doc.getTextWidth(currentLine)) / 2 : x;
                doc.text(currentLine, xPos, yOffset);
                yOffset += lineHeight;
                checkPageOverflow(lineHeight);
              }
              currentLine = word;
            }
          });
          if (currentLine) {
            const xPos = align === 'center' ? (pageWidth - doc.getTextWidth(currentLine)) / 2 : x;
            doc.text(currentLine, xPos, yOffset);
            yOffset += lineHeight;
          }
        } else {
          const xPos = align === 'center' ? (pageWidth - doc.getTextWidth(line)) / 2 : x;
          doc.text(line, xPos, yOffset);
          yOffset += lineHeight;
        }
      });
      return yOffset;
    };

    // Set default font
    const defaultFont = activeResume?.templateFont || "helvetica";
    doc.setFont(defaultFont, "normal");

    // Add Header (Personal Info)
    if (activeResume?.personalInfo) {
      // Name (centered, bold, large)
      doc.setFontSize(16);
      doc.setFont(defaultFont, "bold");
      const fullName = `${activeResume.personalInfo.firstName || ""} ${activeResume.personalInfo.lastName || ""}`.trim();
      yOffset = addWrappedText(fullName || "Name", margin, 16, maxWidth, 'center');
      yOffset += 4;

      // Job Title (centered, bold)
      if (activeResume.personalInfo.jobTitle) {
        doc.setFontSize(12);
        doc.setFont(defaultFont, "bold");
        yOffset = addWrappedText(activeResume.personalInfo.jobTitle, margin, 12, maxWidth, 'center');
        yOffset += 4;
      }

      // Contact Info (single line, centered)
      doc.setFontSize(10);
      doc.setFont(defaultFont, "normal");
      const contactParts = [
        activeResume.personalInfo.phone || "",
        activeResume.personalInfo.email || "",
        activeResume.personalInfo.linkedIn ? `linkedin.com/in/${activeResume.personalInfo.linkedIn}` : "",
        activeResume.personalInfo.github ? `github.com/${activeResume.personalInfo.github}` : "",
        activeResume.personalInfo.website || "",
      ].filter(Boolean);
      const contactText = contactParts.join(" | ");
      yOffset = addWrappedText(contactText || "No contact info", margin, 10, maxWidth, 'center');
      yOffset += 8;
    }

    // Add Summary
    if (activeResume?.personalInfo?.summary) {
      checkPageOverflow(20);
      doc.setFontSize(12);
      doc.setFont(defaultFont, "bold");
      doc.setTextColor(activeResume?.templateColor || "#000000");
      yOffset = addWrappedText("Summary", margin, 12, maxWidth);
      doc.setTextColor(0, 0, 0);
      doc.setFont(defaultFont, "normal");
      yOffset += 4;
      yOffset = addWrappedText(activeResume.personalInfo.summary, margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Experience
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Experience", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
    yOffset += 4;

    if (activeResume?.experiences?.length) {
      activeResume.experiences.forEach((exp) => {
        checkPageOverflow(40);
        doc.setFontSize(11);
        doc.setFont(defaultFont, "bold");
        yOffset = addWrappedText(`${exp.position || "Position"} at ${exp.company || "Company"}`, margin, 11, maxWidth);
        doc.setFont(defaultFont, "normal");
        yOffset += 2;
        const dateText = exp.current ? `${exp.startDate || "Start"} - Present` : `${exp.startDate || "Start"} - ${exp.endDate || "End"}`;
        yOffset = addWrappedText(dateText, margin, 10, maxWidth);
        yOffset += 2;
        if (exp.location) {
          yOffset = addWrappedText(exp.location, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (exp.description) {
          yOffset = addWrappedText(exp.description, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (exp.highlights?.length) {
          const uniqueHighlights = [...new Set(exp.highlights)]; // Remove duplicates
          uniqueHighlights.forEach((highlight) => {
            checkPageOverflow(10);
            yOffset = addWrappedText(`• ${highlight}`, margin + 5, 10, maxWidth - 5);
            yOffset += 2;
          });
        }
        yOffset += 4;
      });
    } else {
      yOffset = addWrappedText("No experience listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Education
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Education", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
    yOffset += 4;

    if (activeResume?.education?.length) {
      activeResume.education.forEach((edu) => {
        checkPageOverflow(20);
        doc.setFontSize(11);
        doc.setFont(defaultFont, "bold");
        yOffset = addWrappedText(edu.institution || "Institution", margin, 11, maxWidth);
        doc.setFont(defaultFont, "normal");
        yOffset += 2;
        const degreeLine = `${edu.degree || "Degree"}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}`;
        yOffset = addWrappedText(degreeLine, margin, 10, maxWidth);
        yOffset += 2;
        yOffset = addWrappedText(`${edu.startDate || "Start"} - ${edu.endDate || "End"}`, margin, 10, maxWidth);
        if (edu.location) {
          yOffset = addWrappedText(edu.location, margin, 10, maxWidth);
          yOffset += 2;
        }
        yOffset += 4;
      });
    } else {
      yOffset = addWrappedText("No education listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Skills
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Technical Skills", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
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
        doc.setFont(defaultFont, "bold");
        yOffset = addWrappedText(category, margin, 11, maxWidth);
        doc.setFont(defaultFont, "normal");
        yOffset += 2;
        const skillsText = skills.map((skill) => skill.name).join(", ");
        yOffset = addWrappedText(skillsText || "No skills listed", margin, 10, maxWidth);
        yOffset += 4;
      });
    } else {
      yOffset = addWrappedText("No skills listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Projects
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Projects", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
    yOffset += 4;

    if (activeResume?.projects?.length) {
      activeResume.projects.forEach((project) => {
        checkPageOverflow(30);
        doc.setFontSize(11);
        doc.setFont(defaultFont, "bold");
        const projectLine = `${project.name || "Project"} ${project.technologies?.length ? `(${project.technologies.join(", ")})` : ""}`;
        yOffset = addWrappedText(projectLine, margin, 11, maxWidth);
        doc.setFont(defaultFont, "normal");
        yOffset += 2;
        if (project.description) {
          yOffset = addWrappedText(project.description, margin, 10, maxWidth);
          yOffset += 2;
        }
        if (project.url) {
          yOffset = addWrappedText(`URL: ${project.url}`, margin, 10, maxWidth);
          yOffset += 2;
        }
        yOffset += 4;
      });
    } else {
      // Add AI-Resume Builder as a default project
      checkPageOverflow(30);
      doc.setFontSize(11);
      doc.setFont(defaultFont, "bold");
      const projectLine = "AI-Powered Resume Builder (Beta) (Next.js, React, TypeScript, Tailwind CSS, jsPDF)";
      yOffset = addWrappedText(projectLine, margin, 11, maxWidth);
      doc.setFont(defaultFont, "normal");
      yOffset += 2;
      yOffset = addWrappedText(
        "A full-stack web application for creating professional resumes with AI-driven suggestions, real-time previews, and PDF exports. Features a responsive design, form validation, and modern UI, currently in beta for user feedback.",
        margin,
        10,
        maxWidth
      );
      yOffset += 2;
      yOffset = addWrappedText("URL: https://github.com/JuniorSillo/AI-Resume-Builder", margin, 10, maxWidth);
      yOffset += 4;
    }

    // Add Certifications
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Certifications", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
    yOffset += 4;

    if (activeResume?.certificates?.length) {
      activeResume.certificates.forEach((cert) => {
        checkPageOverflow(20);
        doc.setFontSize(11);
        doc.setFont(defaultFont, "bold");
        yOffset = addWrappedText(`${cert.name || "Certificate"} - ${cert.issuer || "Issuer"}`, margin, 11, maxWidth);
        doc.setFont(defaultFont, "normal");
        yOffset += 2;
        yOffset = addWrappedText(`Issued: ${cert.issueDate || "Unknown"}`, margin, 10, maxWidth);
        yOffset += 4;
      });
    } else {
      yOffset = addWrappedText("No certifications listed", margin, 10, maxWidth);
      yOffset += 8;
    }

    // Add Languages
    checkPageOverflow(20);
    doc.setFontSize(12);
    doc.setFont(defaultFont, "bold");
    doc.setTextColor(activeResume?.templateColor || "#000000");
    yOffset = addWrappedText("Languages", margin, 12, maxWidth);
    doc.setTextColor(0, 0, 0);
    doc.setFont(defaultFont, "normal");
    yOffset += 4;

    if (activeResume?.languages?.length) {
      const languagesText = activeResume.languages
        .map((lang) => `${lang.name} (${lang.proficiency})`)
        .join(", ");
      yOffset = addWrappedText(languagesText || "No languages listed", margin, 10, maxWidth);
    } else {
      yOffset = addWrappedText("No languages listed", margin, 10, maxWidth);
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
