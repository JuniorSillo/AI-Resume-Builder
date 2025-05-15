"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { Experience } from "@/lib/types";
import { generateUniqueId } from "@/lib/utils";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(), // Optional, but validated below
  current: z.boolean().optional(),
  location: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  highlights: z.array(z.string()).optional(),
}).refine((data) => data.current || data.endDate, {
  message: "End date is required for past jobs",
  path: ["endDate"],
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export function ExperienceForm() {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);

  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExperienceFormData>({
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

  const onSubmit = (data: ExperienceFormData) => {
    if (!activeResume) return;

    const experiences = [...(activeResume.experiences || [])];

    if (editingExperience) {
      const index = experiences.findIndex((e) => e.id === editingExperience.id);
      if (index !== -1) {
        experiences[index] = {
          ...data,
          id: editingExperience.id,
          endDate: data.current ? undefined : data.endDate, // Set endDate to undefined for current jobs
          highlights: data.highlights || [],
        };
      }
    } else {
      experiences.push({
        ...data,
        id: generateUniqueId(),
        endDate: data.current ? undefined : data.endDate,
        highlights: data.highlights || [],
      });
    }

    updateResume(activeResume.id, { experiences });
    reset();
    setEditingExperience(null);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    reset({
      ...experience,
      highlights: experience.highlights || [],
    });
  };

  const handleDelete = (id: string) => {
    if (!activeResume) return;
    const experiences = activeResume.experiences?.filter((e) => e.id !== id) || [];
    updateResume(activeResume.id, { experiences });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register("company")} />
            {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
          </div>

          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" {...register("position")} />
            {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="text" {...register("startDate")} placeholder="MM/YYYY" />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="text" {...register("endDate")} placeholder="MM/YYYY" disabled={!!register("current").value} />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="current" {...register("current")} />
            <Label htmlFor="current">Current Job</Label>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <Button type="submit">{editingExperience ? "Update" : "Add"} Experience</Button>
          {editingExperience && (
            <Button type="button" variant="outline" onClick={() => { reset(); setEditingExperience(null); }}>
              Cancel
            </Button>
          )}
        </form>

        <div className="mt-6">
          {activeResume?.experiences?.map((experience) => (
            <div key={experience.id} className="border p-4 rounded-md mb-4">
              <h3 className="font-semibold">{experience.position} at {experience.company}</h3>
              <p className="text-sm text-muted-foreground">
                {experience.startDate} - {experience.current ? "Present" : experience.endDate || "N/A"}
              </p>
              <p>{experience.description}</p>
              <div className="mt-2 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(experience)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(experience.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
