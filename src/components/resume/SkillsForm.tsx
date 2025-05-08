"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, X, Trash2, Edit2, Plus } from "lucide-react";
import { generateUniqueId, suggestKeywords } from "@/lib/utils";
import { toast } from "sonner";
import { Skill } from "@/lib/types";

const skillCategories = [
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Design",
  "Marketing",
  "Management",
  "Communication",
  "Other",
];

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(5).default(3),
  category: z.string().optional(),
});

type SkillValues = z.infer<typeof skillSchema>;

export function SkillsForm() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [suggestingSkills, setSuggestingSkills] = useState(false);

  const form = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: 3,
      category: "Other",
    },
  });

  function onSubmit(data: SkillValues) {
    if (activeResumeId) {
      const skills = [...(activeResume?.skills || [])];

      // Check if skill already exists
      const existingSkillIndex = skills.findIndex(
        (s) => s.name.toLowerCase() === data.name.toLowerCase() &&
              (editingSkill === null || s.id !== editingSkill.id)
      );

      if (existingSkillIndex !== -1) {
        toast.error("This skill already exists in your resume");
        return;
      }

      if (editingSkill) {
        // Update existing skill
        const index = skills.findIndex((s) => s.id === editingSkill.id);
        if (index !== -1) {
          skills[index] = {
            ...data,
            id: editingSkill.id,
          };
        }
        toast.success("Skill updated successfully");
      } else {
        // Add new skill
        skills.push({
          ...data,
          id: generateUniqueId(),
        });
        toast.success("Skill added successfully");
      }

      updateResume(activeResumeId, {
        skills,
      });

      // Reset form
      form.reset({
        name: "",
        level: 3,
        category: "Other",
      });
      setEditingSkill(null);
    }
  }

  function editSkill(skill: Skill) {
    setEditingSkill(skill);
    form.reset({
      name: skill.name,
      level: skill.level || 3,
      category: skill.category || "Other",
    });
  }

  function deleteSkill(id: string) {
    if (activeResumeId && activeResume) {
      const skills = activeResume.skills.filter((s) => s.id !== id);
      updateResume(activeResumeId, {
        skills,
      });
      toast.success("Skill deleted successfully");
    }
  }

  function cancelEdit() {
    setEditingSkill(null);
    form.reset({
      name: "",
      level: 3,
      category: "Other",
    });
  }

  function suggestSkillsWithAI() {
    setSuggestingSkills(true);

    // Simulate AI suggestion with a timeout
    setTimeout(() => {
      // Get job title from resume for targeted suggestions
      const jobTitle = activeResume?.personalInfo.jobTitle || "";

      // Get suggested keywords based on job title
      const suggestedKeywords = suggestKeywords(jobTitle);

      // Get current skills to avoid duplicates
      const currentSkills = activeResume?.skills || [];
      const currentSkillNames = currentSkills.map(s => s.name.toLowerCase());

      // Filter out skills that already exist
      const newSkills = suggestedKeywords.filter(
        keyword => !currentSkillNames.includes(keyword.toLowerCase())
      );

      if (newSkills.length > 0) {
        // Add the first suggestion to the form
        form.setValue("name", newSkills[0]);

        // If there are multiple suggestions, add them all
        if (newSkills.length > 1 && activeResumeId) {
          const updatedSkills = [
            ...currentSkills,
            ...newSkills.slice(1).map(name => ({
              id: generateUniqueId(),
              name,
              level: 3,
              category: "Other"
            }))
          ];

          updateResume(activeResumeId, {
            skills: updatedSkills
          });

          toast.success(`Added ${newSkills.length - 1} suggested skills to your resume`);
        }
      } else {
        toast.info("No new skills to suggest. Your resume already has a comprehensive skill set.");
      }

      setSuggestingSkills(false);
    }, 1500);
  }

  // Group skills by category for display
  const groupedSkills: Record<string, Skill[]> = {};
  activeResume?.skills?.forEach((skill) => {
    const category = skill.category || "Other";
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {editingSkill ? "Edit Skill" : "Add Skill"}
        </h3>
        <div className="flex gap-2">
          {editingSkill && (
            <Button variant="outline" size="sm" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={suggestSkillsWithAI}
            disabled={suggestingSkills}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {suggestingSkills ? "Suggesting..." : "Suggest Skills"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript, Project Management, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level: {field.value}/5</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className="py-4"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">
              {editingSkill ? "Update Skill" : "Add Skill"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Skills</h3>
        {activeResume?.skills && activeResume.skills.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="py-1 px-3 flex items-center gap-1 group relative"
                    >
                      {skill.name}
                      {skill.level && (
                        <span className="ml-1 text-xs bg-primary/10 px-1 rounded">
                          {skill.level}/5
                        </span>
                      )}
                      <div className="hidden group-hover:flex absolute -top-2 -right-2 gap-1">
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => editSkill(skill)}
                          className="h-5 w-5 bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteSkill(skill.id)}
                          className="h-5 w-5"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
            No skills added yet. Add your skills or use the "Suggest Skills" button to enhance your resume.
          </div>
        )}
      </div>
    </div>
  );
}
