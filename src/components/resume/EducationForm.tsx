"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Trash2, Edit2 } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";
import { toast } from "sonner";
import { Education } from "@/lib/types";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().optional(),
  description: z.string().optional(),
});

type EducationValues = z.infer<typeof educationSchema>;

export function EducationForm() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [enhancingDescription, setEnhancingDescription] = useState(false);

  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
    },
  });

  function onSubmit(data: EducationValues) {
    if (activeResumeId) {
      const education = [...(activeResume?.education || [])];

      if (editingEducation) {
        // Update existing education
        const index = education.findIndex((e) => e.id === editingEducation.id);
        if (index !== -1) {
          education[index] = {
            ...data,
            id: editingEducation.id,
          };
        }
        toast.success("Education updated successfully");
      } else {
        // Add new education
        education.push({
          ...data,
          id: generateUniqueId(),
        });
        toast.success("Education added successfully");
      }

      updateResume(activeResumeId, {
        education,
      });

      // Reset form
      form.reset({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
      });
      setEditingEducation(null);
    }
  }

  function editEducation(education: Education) {
    setEditingEducation(education);
    form.reset({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate,
      endDate: education.endDate,
      location: education.location || "",
      description: education.description || "",
    });
  }

  function deleteEducation(id: string) {
    if (activeResumeId && activeResume) {
      const education = activeResume.education.filter((e) => e.id !== id);
      updateResume(activeResumeId, {
        education,
      });
      toast.success("Education deleted successfully");
    }
  }

  function cancelEdit() {
    setEditingEducation(null);
    form.reset({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
    });
  }

  function enhanceWithAI() {
    setEnhancingDescription(true);

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const institution = form.getValues("institution");
      const degree = form.getValues("degree");
      const field = form.getValues("fieldOfStudy");

      // This would be replaced with actual AI-generated content
      const enhancedDescription = `Completed ${degree} in ${field || "my field"} with academic distinction. Gained comprehensive knowledge in core subjects and participated in various campus activities. Developed strong analytical, research, and problem-solving skills through rigorous coursework and special projects.`;

      form.setValue("description", enhancedDescription);
      setEnhancingDescription(false);
      toast.success("Description enhanced with AI");
    }, 1500);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {editingEducation ? "Edit Education" : "Add Education"}
        </h3>
        {editingEducation && (
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
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University/College Name" {...field} />
                  </FormControl>
                  <FormMessage />
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
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="Bachelor of Science, Associate's Degree, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science, Business, etc." {...field} />
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
                    <Input type="month" {...field} />
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
                    disabled={enhancingDescription || !form.getValues("institution")}
                    className="h-8"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {enhancingDescription ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Additional information such as GPA, honors, relevant coursework, activities, etc."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">
              {editingEducation ? "Update Education" : "Add Education"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Education History</h3>
        {activeResume?.education && activeResume.education.length > 0 ? (
          <div className="space-y-4">
            {activeResume.education.map((education) => (
              <Card key={education.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{education.institution}</CardTitle>
                      <CardDescription>
                        {education.degree}
                        {education.fieldOfStudy && ` in ${education.fieldOfStudy}`}
                        {education.location && ` • ${education.location}`}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editEducation(education)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEducation(education.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    {education.startDate} - {education.endDate}
                  </div>
                  {education.description && (
                    <p className="text-sm">{education.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
            No education added yet. Add your educational background to enhance your resume.
          </div>
        )}
      </div>
    </div>
  );
}
