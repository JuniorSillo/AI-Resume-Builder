"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Plus, X, Trash2, Edit2 } from "lucide-react";
import { generateUniqueId, suggestJobDescription } from "@/lib/utils";
import { toast } from "sonner";
import { Experience } from "@/lib/types";

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(), // Changed from z.string().optional()
  current: z.boolean().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()),
});

type ExperienceValues = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [newHighlight, setNewHighlight] = useState("");
  const [enhancingDescription, setEnhancingDescription] = useState(false);

  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
      highlights: [],
    },
  });

  function onSubmit(data: ExperienceValues) {
    if (activeResumeId) {
      const experiences = [...(activeResume?.experiences || [])];

      if (editingExperience) {
        // Update existing experience
        const index = experiences.findIndex((e) => e.id === editingExperience.id);
        if (index !== -1) {
          experiences[index] = {
            ...data,
            id: editingExperience.id,
          };
        }
        toast.success("Experience updated successfully");
      } else {
        // Add new experience
        experiences.push({
          ...data,
          id: generateUniqueId(),
        });
        toast.success("Experience added successfully");
      }

      updateResume(activeResumeId, {
        experiences,
      });

      // Reset form
      form.reset({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        location: "",
        description: "",
        highlights: [],
      });
      setEditingExperience(null);
    }
  }

  function addHighlight() {
    if (newHighlight.trim()) {
      const currentHighlights = form.getValues("highlights") || [];
      form.setValue("highlights", [...currentHighlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  }

  function removeHighlight(index: number) {
    const currentHighlights = form.getValues("highlights") || [];
    form.setValue(
      "highlights",
      currentHighlights.filter((_, i) => i !== index)
    );
  }

  function editExperience(experience: Experience) {
    setEditingExperience(experience);
    form.reset({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      location: experience.location || "",
      description: experience.description,
      highlights: experience.highlights,
    });
  }

  function deleteExperience(id: string) {
    if (activeResumeId && activeResume) {
      const experiences = activeResume.experiences.filter((e) => e.id !== id);
      updateResume(activeResumeId, {
        experiences,
      });
      toast.success("Experience deleted successfully");
    }
  }

  function cancelEdit() {
    setEditingExperience(null);
    form.reset({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
      highlights: [],
    });
  }

  function enhanceWithAI() {
    setEnhancingDescription(true);

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const position = form.getValues("position");
      const company = form.getValues("company");

      // Get current highlights
      const currentHighlights = form.getValues("highlights") || [];

      // Generate some AI-powered bullet points
      const aiSuggestions = [
        `Led cross-functional teams to deliver ${position} projects on time and under budget`,
        `Implemented process improvements resulting in 30% increase in team productivity`,
        `Collaborated with stakeholders to align ${position} initiatives with business objectives`,
        `Mentored junior team members and provided technical guidance on best practices`,
      ];

      // Add AI suggestions that don't already exist
      const newHighlights = [
        ...currentHighlights,
        ...aiSuggestions.filter((suggestion) => !currentHighlights.includes(suggestion)),
      ];

      // Update form with enhanced description and highlights
      form.setValue("description", suggestJobDescription(position, "3+"));
      form.setValue("highlights", newHighlights);

      setEnhancingDescription(false);
      toast.success("Experience enhanced with AI");
    }, 1500);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {editingExperience ? "Edit Experience" : "Add Experience"}
        </h3>
        {editingExperience && (
          <Button variant="outline" size="sm" onClick={cancelEdit}>
            Cancel Edit
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      placeholder="Present"
                      {...field}
                      disabled={form.getValues("current")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (e.target.checked) {
                          form.setValue("endDate", "");
                        }
                      }}
                      className="form-checkbox h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="mt-0">I currently work here</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Description</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={enhanceWithAI}
                    disabled={enhancingDescription || !form.getValues("position")}
                    className="h-8"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {enhancingDescription ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe your role and responsibilities..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <FormLabel>Key Achievements & Responsibilities</FormLabel>
            </div>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Add bullet points highlighting your achievements..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addHighlight}
                disabled={!newHighlight.trim()}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {form.getValues("highlights")?.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                >
                  <span className="text-sm">• {highlight}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHighlight(index)}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {editingExperience ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Work Experience</h3>
        {activeResume?.experiences && activeResume.experiences.length > 0 ? (
          <div className="space-y-4">
            {activeResume.experiences.map((experience) => (
              <Card key={experience.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{experience.position}</CardTitle>
                      <CardDescription>
                        {experience.company}{" "}
                        {experience.location && `• ${experience.location}`}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editExperience(experience)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExperience(experience.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    {experience.startDate} -{" "}
                    {experience.current ? "Present" : experience.endDate}
                  </div>
                  {experience.description && (
                    <p className="text-sm mb-2">{experience.description}</p>
                  )}
                  {experience.highlights && experience.highlights.length > 0 && (
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {experience.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
            No experience added yet. Add your work experience to enhance your resume.
          </div>
        )}
      </div>
    </div>
  );
}
