"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Link, Printer, Share2 } from "lucide-react";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";

export function ResumePreview() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [viewMode, setViewMode] = useState<"preview" | "ats">("preview");
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "txt">("pdf");

  const handleExport = () => {
    // In a real app, this would use a proper PDF/DOCX generation library
    toast.success(`Exporting resume as ${exportFormat.toUpperCase()}...`);

    // Simulate download
    if (exportFormat === "txt" && activeResume) {
      const resumeText = `
${activeResume.personalInfo.firstName} ${activeResume.personalInfo.lastName}
${activeResume.personalInfo.email} | ${activeResume.personalInfo.phone || ""}
${activeResume.personalInfo.location || ""}
${activeResume.personalInfo.linkedIn ? `LinkedIn: ${activeResume.personalInfo.linkedIn}` : ""}
${activeResume.personalInfo.website ? `Website: ${activeResume.personalInfo.website}` : ""}

PROFESSIONAL SUMMARY
${activeResume.personalInfo.summary || ""}

EXPERIENCE
${activeResume.experiences.map(exp => `
${exp.position} | ${exp.company}
${exp.startDate} - ${exp.current ? "Present" : exp.endDate}
${exp.location || ""}
${exp.description || ""}
${exp.highlights.map(h => `• ${h}`).join("\n")}
`).join("\n")}

EDUCATION
${activeResume.education.map(edu => `
${edu.degree} in ${edu.fieldOfStudy || ""} | ${edu.institution}
${edu.startDate} - ${edu.endDate}
${edu.location || ""}
${edu.description || ""}
`).join("\n")}

SKILLS
${activeResume.skills.map(skill => skill.name).join(", ")}

PROJECTS
${activeResume.projects.map(project => `
${project.name}
${project.description}
Technologies: ${project.technologies.join(", ")}
${project.url ? `URL: ${project.url}` : ""}
`).join("\n")}
`;

      downloadFile(resumeText, `${activeResume.personalInfo.firstName}_${activeResume.personalInfo.lastName}_Resume.txt`, "text/plain");
    } else {
      // For PDF and DOCX, we'd use proper libraries in a real app
      setTimeout(() => {
        toast.info("In a real app, this would generate a properly formatted document");
      }, 1500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    toast.success("Resume link copied to clipboard!");
  };

  if (!activeResume) {
    return (
      <div className="h-[800px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-muted-foreground">No resume selected</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "preview" | "ats")}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="preview">Visual Preview</TabsTrigger>
            <TabsTrigger value="ats">ATS View</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={exportFormat === "pdf" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setExportFormat("pdf")}
            >
              PDF
            </Button>
            <Button
              variant={exportFormat === "docx" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0 border-x"
              onClick={() => setExportFormat("docx")}
            >
              DOCX
            </Button>
            <Button
              variant={exportFormat === "txt" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setExportFormat("txt")}
            >
              TXT
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={handleExport}>
            <FileDown className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "ats" ? (
        <div className="bg-white text-black p-8 border rounded-md shadow-sm font-mono text-sm whitespace-pre-wrap">
          <p>{activeResume.personalInfo.firstName} {activeResume.personalInfo.lastName}</p>
          <p>{activeResume.personalInfo.email} | {activeResume.personalInfo.phone}</p>
          <p>{activeResume.personalInfo.location}</p>
          {activeResume.personalInfo.linkedIn && <p>LinkedIn: {activeResume.personalInfo.linkedIn}</p>}
          {activeResume.personalInfo.website && <p>Website: {activeResume.personalInfo.website}</p>}

          <p className="mt-4 font-bold">PROFESSIONAL SUMMARY</p>
          <p>{activeResume.personalInfo.summary}</p>

          <p className="mt-4 font-bold">EXPERIENCE</p>
          {activeResume.experiences.map((exp, i) => (
            <div key={i} className="mb-2">
              <p>{exp.position} | {exp.company}</p>
              <p>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
              {exp.location && <p>{exp.location}</p>}
              {exp.description && <p>{exp.description}</p>}
              {exp.highlights.map((highlight, j) => (
                <p key={j}>• {highlight}</p>
              ))}
            </div>
          ))}

          <p className="mt-4 font-bold">EDUCATION</p>
          {activeResume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`} | {edu.institution}</p>
              <p>{edu.startDate} - {edu.endDate}</p>
              {edu.location && <p>{edu.location}</p>}
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))}

          <p className="mt-4 font-bold">SKILLS</p>
          <p>{activeResume.skills.map(skill => skill.name).join(", ")}</p>

          {activeResume.projects.length > 0 && (
            <>
              <p className="mt-4 font-bold">PROJECTS</p>
              {activeResume.projects.map((project, i) => (
                <div key={i} className="mb-2">
                  <p>{project.name}</p>
                  <p>{project.description}</p>
                  <p>Technologies: {project.technologies.join(", ")}</p>
                  {project.url && <p>URL: {project.url}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="p-6 bg-white shadow-md rounded-md mx-auto max-w-[800px] print:shadow-none print:p-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start border-b pb-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: activeResume.templateColor }}>
                  {activeResume.personalInfo.firstName} {activeResume.personalInfo.lastName}
                </h1>
                {activeResume.personalInfo.jobTitle && (
                  <h2 className="text-xl mt-1 text-gray-700 dark:text-gray-300">
                    {activeResume.personalInfo.jobTitle}
                  </h2>
                )}
              </div>

              <div className="text-sm space-y-1 text-right">
                {activeResume.personalInfo.email && (
                  <p>{activeResume.personalInfo.email}</p>
                )}
                {activeResume.personalInfo.phone && (
                  <p>{activeResume.personalInfo.phone}</p>
                )}
                {activeResume.personalInfo.location && (
                  <p>{activeResume.personalInfo.location}</p>
                )}
                {activeResume.personalInfo.linkedIn && (
                  <p className="flex items-center justify-end gap-1">
                    <Link className="h-3 w-3" />
                    {activeResume.personalInfo.linkedIn}
                  </p>
                )}
                {activeResume.personalInfo.website && (
                  <p className="flex items-center justify-end gap-1">
                    <Link className="h-3 w-3" />
                    {activeResume.personalInfo.website}
                  </p>
                )}
              </div>
            </div>

            {activeResume.personalInfo.summary && (
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: activeResume.templateColor }}>
                  Professional Summary
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activeResume.personalInfo.summary}
                </p>
              </div>
            )}

            {activeResume.experiences.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: activeResume.templateColor }}>
                  Experience
                </h3>
                <div className="space-y-4">
                  {activeResume.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{exp.position}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {exp.description && (
                        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{exp.description}</p>
                      )}
                      {exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                          {exp.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeResume.education.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: activeResume.templateColor }}>
                  Education
                </h3>
                <div className="space-y-4">
                  {activeResume.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      {edu.description && (
                        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeResume.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: activeResume.templateColor }}>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeResume.skills.map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                      {skill.level && skill.level > 0 && (
                        <span className="ml-1 text-xs">
                          {' '}{Array(skill.level).fill('•').join('')}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activeResume.projects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: activeResume.templateColor }}>
                  Projects
                </h3>
                <div className="space-y-4">
                  {activeResume.projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium flex items-center">
                          {project.name}
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 text-gray-400 hover:text-gray-600 print:hidden"
                            >
                              <Link className="h-3 w-3" />
                            </a>
                          )}
                        </h4>
                        {(project.startDate || project.endDate) && (
                          <p className="text-sm text-gray-500">
                            {project.startDate}{project.startDate && project.endDate && ' - '}{project.endDate}
                          </p>
                        )}
                      </div>
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
