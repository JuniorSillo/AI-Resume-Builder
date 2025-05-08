"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  linkedIn: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  summary: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
  const resumes = useAppStore((state) => state.resumes);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const updateResume = useAppStore((state) => state.updateResume);
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  const [enhancingSummary, setEnhancingSummary] = useState(false);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: activeResume?.personalInfo.firstName || "",
      lastName: activeResume?.personalInfo.lastName || "",
      email: activeResume?.personalInfo.email || "",
      phone: activeResume?.personalInfo.phone || "",
      linkedIn: activeResume?.personalInfo.linkedIn || "",
      website: activeResume?.personalInfo.website || "",
      location: activeResume?.personalInfo.location || "",
      jobTitle: activeResume?.personalInfo.jobTitle || "",
      summary: activeResume?.personalInfo.summary || "",
    },
  });

  useEffect(() => {
    if (activeResume) {
      form.reset({
        firstName: activeResume.personalInfo.firstName || "",
        lastName: activeResume.personalInfo.lastName || "",
        email: activeResume.personalInfo.email || "",
        phone: activeResume.personalInfo.phone || "",
        linkedIn: activeResume.personalInfo.linkedIn || "",
        website: activeResume.personalInfo.website || "",
        location: activeResume.personalInfo.location || "",
        jobTitle: activeResume.personalInfo.jobTitle || "",
        summary: activeResume.personalInfo.summary || "",
      });
    }
  }, [activeResume, form]);

  function onSubmit(data: PersonalInfoValues) {
    if (activeResumeId) {
      updateResume(activeResumeId, {
        personalInfo: data,
      });
      toast.success("Personal information saved successfully");
    }
  }

  function enhanceSummary() {
    setEnhancingSummary(true);

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const currentSummary = form.getValues("summary") || "";
      const jobTitle = form.getValues("jobTitle") || "professional";

      // This would be replaced with actual AI-generated content
      const enhancedSummary = `Highly motivated and results-driven ${jobTitle} with a proven track record of success. ${currentSummary} Skilled in leading cross-functional teams and delivering impactful solutions that drive business growth. Passionate about leveraging technology to solve complex challenges and create exceptional user experiences.`;

      form.setValue("summary", enhancedSummary);
      setEnhancingSummary(false);
      toast.success("Summary enhanced with AI");
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="mb-4 md:mb-0">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={`https://avatar.vercel.sh/${form.getValues("firstName")}-${form.getValues("lastName")}`}
                alt={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
              />
              <AvatarFallback className="text-2xl">
                {form.getValues("firstName").charAt(0)}
                {form.getValues("lastName").charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Software Engineer, Marketing Specialist, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe.com" {...field} />
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
                  <Input placeholder="New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Professional Summary</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhanceSummary}
                  disabled={enhancingSummary}
                  className="h-8"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {enhancingSummary ? "Enhancing..." : "Enhance with AI"}
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Write a brief summary of your professional background and key strengths..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Save Information</Button>
        </div>
      </form>
    </Form>
  );
}
