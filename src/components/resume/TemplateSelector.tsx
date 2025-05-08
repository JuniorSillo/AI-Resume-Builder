"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, Star, Cpu } from "lucide-react";
import { Template } from "@/lib/types";
import { toast } from "sonner";

export function TemplateSelector() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const resumeTemplates = useAppStore((state) => state.resumeTemplates);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    activeResume?.templateId || resumeTemplates[0]?.id
  );
  const [selectedColor, setSelectedColor] = useState(
    activeResume?.templateColor || "#2563eb"
  );
  const [filterTab, setFilterTab] = useState("all");

  // Filter templates based on tab
  const filteredTemplates =
    filterTab === "all"
      ? resumeTemplates
      : filterTab === "ai"
        ? resumeTemplates.filter(t => t.isAIPowered)
        : resumeTemplates.filter(t => t.type === "Resume" && (
            (filterTab === "entry" && t.careerLevel?.includes("Entry")) ||
            (filterTab === "mid" && t.careerLevel?.includes("Mid")) ||
            (filterTab === "senior" && t.careerLevel?.includes("Senior")) ||
            (filterTab === "executive" && t.careerLevel?.includes("Executive"))
          ));

  const popularTemplates = [...resumeTemplates].sort((a, b) =>
    (b.popularity || 0) - (a.popularity || 0)
  ).slice(0, 3);

  const colors = [
    { name: "Blue", value: "#2563eb" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Pink", value: "#ec4899" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Gray", value: "#6b7280" },
  ];

  function applyTemplate() {
    if (activeResumeId) {
      updateResume(activeResumeId, {
        templateId: selectedTemplateId,
        templateColor: selectedColor,
      });
      toast.success("Template updated successfully");
    }
  }

  function suggestTemplateWithAI() {
    // Simulating AI recommendation based on job title and experience
    const jobTitle = activeResume?.personalInfo.jobTitle?.toLowerCase() || "";
    const experiences = activeResume?.experiences || [];
    const latestExperience = experiences[0];

    let suggestedTemplate;

    // Simple logic to suggest template based on job and experience
    if (jobTitle.includes("design") || jobTitle.includes("creative") || jobTitle.includes("art")) {
      suggestedTemplate = resumeTemplates.find(t => t.id === "template-creative");
    } else if (jobTitle.includes("executive") || jobTitle.includes("director") || jobTitle.includes("manager")) {
      suggestedTemplate = resumeTemplates.find(t => t.id === "template-executive");
    } else if (jobTitle.includes("finance") || jobTitle.includes("account") || jobTitle.includes("legal")) {
      suggestedTemplate = resumeTemplates.find(t => t.id === "template-professional");
    } else if (experiences.length <= 1 || !latestExperience) {
      suggestedTemplate = resumeTemplates.find(t => t.id === "template-minimal");
    } else {
      suggestedTemplate = resumeTemplates.find(t => t.id === "template-modern");
    }

    if (suggestedTemplate) {
      setSelectedTemplateId(suggestedTemplate.id);
      toast.success(`AI suggests the "${suggestedTemplate.name}" template based on your profile`);
    } else {
      setSelectedTemplateId(resumeTemplates[0].id);
      toast.info("Based on your profile, a modern template is recommended");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Choose a Template</h3>
        <Button variant="outline" size="sm" onClick={suggestTemplateWithAI}>
          <Sparkles className="mr-2 h-4 w-4" />
          Suggest Template
        </Button>
      </div>

      <Tabs defaultValue="all" value={filterTab} onValueChange={setFilterTab} className="mb-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ai">AI-Powered</TabsTrigger>
          <TabsTrigger value="entry">Entry-Level</TabsTrigger>
          <TabsTrigger value="mid">Mid-Level</TabsTrigger>
          <TabsTrigger value="senior">Senior</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-8">
        <h4 className="text-base font-medium mb-4 flex items-center">
          <Star className="h-4 w-4 mr-2 text-amber-500" />
          Popular Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTemplateId === template.id ? 'border-2 border-primary' : ''
              }`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  {template.isAIPowered && (
                    <Badge variant="secondary" className="flex items-center text-xs">
                      <Cpu className="h-3 w-3 mr-1" /> AI-Powered
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="aspect-[8.5/11] w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden relative flex items-center justify-center">
                  <div className="text-center text-slate-400 text-sm">
                    {/* Template preview would be here - using placeholder for now */}
                    <div className="mb-2 mx-auto w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded mx-auto mb-1" />
                    <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded mx-auto" />
                  </div>
                  {selectedTemplateId === template.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <h4 className="text-base font-medium mb-4">All Templates</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedTemplateId === template.id ? 'border-2 border-primary' : ''
            }`}
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{template.name}</CardTitle>
                {template.isAIPowered && (
                  <Badge variant="secondary" className="flex items-center text-xs">
                    <Cpu className="h-3 w-3 mr-1" /> AI
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <div className="aspect-[8.5/11] w-full bg-slate-100 dark:bg-slate-800 rounded overflow-hidden relative flex items-center justify-center">
                <div className="text-center text-slate-400 text-sm">
                  {/* Template preview would be here - using placeholder for now */}
                  <div className="mb-2 mx-auto w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded mx-auto mb-1" />
                  <div className="h-2 w-20 bg-slate-300 dark:bg-slate-700 rounded mx-auto" />
                </div>
                {selectedTemplateId === template.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h4 className="text-base font-medium mb-4">Color Scheme</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <div
              key={color.value}
              className={`w-8 h-8 rounded-full cursor-pointer ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={applyTemplate}>
          Apply Template
        </Button>
      </div>
    </div>
  );
}
