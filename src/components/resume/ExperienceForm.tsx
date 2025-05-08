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
  endDate: z.string().optional(),
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
        `Mentored junior team members and provided technical guidance on best practices`
      ];

      // Add AI suggestions that don't already exist
      const newHighlights = [
        ...currentHighlights,
        ...aiSuggestions.filter(suggestion => !currentHighlights.includes(suggestion))
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
                  >
                    {enhancingDescription ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe your responsibilities"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>Key Highlights</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Highlight (e.g., Managed a team)"
                />
                <Button
                  variant="default"
                  onClick={addHighlight}
                  disabled={!newHighlight}
                  className="text-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ul className="list-inside pl-4 space-y-1">
              {form.getValues("highlights").map((highlight, index) => (
                <li key={index} className="flex justify-between items-center">
                  <Badge variant="outline">{highlight}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => removeHighlight(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <CardFooter>
            <Button type="submit">
              {editingExperience ? "Save Changes" : "Add Experience"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
