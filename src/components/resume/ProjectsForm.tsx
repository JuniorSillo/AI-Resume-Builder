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
import { Sparkles, Plus, X, Trash2, Edit2, Link as LinkIcon } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";
import { toast } from "sonner";
import { Project } from "@/lib/types";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectValues = z.infer<typeof projectSchema>;

export function ProjectsForm() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newTechnology, setNewTechnology] = useState("");
  const [enhancingDescription, setEnhancingDescription] = useState(false);

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    },
  });

  function onSubmit(data: ProjectValues) {
    if (activeResumeId) {
      const projects = [...(activeResume?.projects || [])];

      if (editingProject) {
        // Update existing project
        const index = projects.findIndex((p) => p.id === editingProject.id);
        if (index !== -1) {
          projects[index] = {
            ...data,
            id: editingProject.id,
          };
        }
        toast.success("Project updated successfully");
      } else {
        // Add new project
        projects.push({
          ...data,
          id: generateUniqueId(),
        });
        toast.success("Project added successfully");
      }

      updateResume(activeResumeId, {
        projects,
      });

      // Reset form
      form.reset({
        name: "",
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
      });
      setEditingProject(null);
    }
  }

  function addTechnology() {
    if (newTechnology.trim()) {
      const currentTechnologies = form.getValues("technologies") || [];
      // Check if technology already exists
      if (!currentTechnologies.includes(newTechnology.trim())) {
        form.setValue("technologies", [...currentTechnologies, newTechnology.trim()]);
      }
      setNewTechnology("");
    }
  }

  function removeTechnology(index: number) {
    const currentTechnologies = form.getValues("technologies") || [];
    form.setValue(
      "technologies",
      currentTechnologies.filter((_, i) => i !== index)
    );
  }

  function editProject(project: Project) {
    setEditingProject(project);
    form.reset({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      url: project.url || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
    });
  }

  function deleteProject(id: string) {
    if (activeResumeId && activeResume) {
      const projects = activeResume.projects.filter((p) => p.id !== id);
      updateResume(activeResumeId, {
        projects,
      });
      toast.success("Project deleted successfully");
    }
  }

  function cancelEdit() {
    setEditingProject(null);
    form.reset({
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    });
  }

  function enhanceWithAI() {
    setEnhancingDescription(true);

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const projectName = form.getValues("name");
      const currentDescription = form.getValues("description");

      // This would be replaced with actual AI-generated content
      const enhancedDescription = currentDescription
        ? `${currentDescription} This project demonstrates strong problem-solving abilities and technical skills. It resulted in improved efficiency and user satisfaction.`
        : `Developed ${projectName} to address specific user needs and improve functionality. Implemented innovative solutions that resulted in enhanced performance and user experience. Collaborated with team members to ensure high-quality deliverables and timely completion.`;

      form.setValue("description", enhancedDescription);
      setEnhancingDescription(false);
      toast.success("Description enhanced with AI");
    }, 1500);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {editingProject ? "Edit Project" : "Add Project"}
        </h3>
        {editingProject && (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E-commerce Platform, Portfolio Website, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/project" {...field} />
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
                  <FormLabel>Start Date (Optional)</FormLabel>
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
                  <FormLabel>End Date (Optional)</FormLabel>
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
                    disabled={enhancingDescription || !form.getValues("name")}
                    className="h-8"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {enhancingDescription ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe your project, including its purpose, your role, and key achievements..."
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
              <FormLabel>Technologies Used</FormLabel>
            </div>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Add technologies used in the project..."
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTechnology}
                disabled={!newTechnology.trim()}
                className="ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {form.getValues("technologies")?.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {tech}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTechnology(index)}
                    className="h-4 w-4 ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {editingProject ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Projects</h3>
        {activeResume?.projects && activeResume.projects.length > 0 ? (
          <div className="space-y-4">
            {activeResume.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        {project.name}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </a>
                        )}
                      </CardTitle>
                      {(project.startDate || project.endDate) && (
                        <CardDescription>
                          {project.startDate && `${project.startDate}`}
                          {project.startDate && project.endDate && " - "}
                          {project.endDate ? `${project.endDate}` : "Present"}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editProject(project)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground">
            No projects added yet. Add your projects to showcase your work and skills.
          </div>
        )}
      </div>
    </div>
  );
}
