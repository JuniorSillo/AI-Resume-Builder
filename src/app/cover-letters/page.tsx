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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, FileDown, Check, Copy } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  recipient: z.string().optional(),
  tone: z.enum(["professional", "enthusiastic", "balanced"]),
  keyPoints: z.string().optional(),
  resumeId: z.string().min(1, "Please select a resume"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CoverLetterBuilder() {
  const resumes = useAppStore((state) => state.resumes);
  const coverLetters = useAppStore((state) => state.coverLetters);
  const activeResumeId = useAppStore((state) => state.activeResumeId);
  const addCoverLetter = useAppStore((state) => state.addCoverLetter);
  const coverLetterTemplates = useAppStore((state) => state.coverLetterTemplates);

  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      position: "",
      recipient: "Hiring Manager",
      tone: "professional",
      keyPoints: "",
      resumeId: activeResumeId || "",
    },
  });

  function onSubmit(data: FormValues) {
    setGeneratingLetter(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      const activeResume = resumes.find(r => r.id === data.resumeId);

      if (!activeResume) {
        toast.error("Could not find the selected resume");
        setGeneratingLetter(false);
        return;
      }

      const personalInfo = activeResume.personalInfo;
      const experience = activeResume.experiences[0]; // Use most recent experience

      // Generate a simple cover letter based on form data
      // In a real app, this would be replaced with an actual AI call
      const generatedLetter = `
<p>Dear ${data.recipient || "Hiring Manager"},</p>

<p>I am writing to express my interest in the ${data.position} position at ${data.company}. With my background in ${experience?.position || "the industry"} and expertise in ${activeResume.skills.slice(0, 3).map(s => s.name).join(", ")}, I am confident in my ability to make a significant contribution to your team.</p>

<p>${data.tone === "professional"
  ? `Throughout my career, I have developed strong skills in ${activeResume.skills.slice(0, 3).map(s => s.name).join(", ")}. In my role at ${experience?.company || "my previous company"}, I ${experience?.highlights[0] || "delivered exceptional results and drove significant improvements"}.`
  : data.tone === "enthusiastic"
  ? `I'm truly excited about the opportunity to join ${data.company}! Your company's work in ${data.position.split(" ")[0]} aligns perfectly with my passion for ${activeResume.skills[0]?.name || "this field"}. At ${experience?.company || "my previous company"}, I enthusiastically ${experience?.highlights[0]?.toLowerCase() || "took on challenging projects and delivered outstanding results"}.`
  : `My experience at ${experience?.company || "my previous company"} has prepared me well for this role. I successfully ${experience?.highlights[0]?.toLowerCase() || "completed projects that required strong problem-solving abilities"}, which aligns with the requirements of the ${data.position} position.`
}</p>

${data.keyPoints ? `<p>I would also like to highlight that ${data.keyPoints}</p>` : ""}

<p>I am particularly drawn to ${data.company} because of its reputation for ${data.tone === "enthusiastic" ? "innovation and creativity" : "excellence and professionalism"} in the industry. I am confident that my skills in ${activeResume.skills.slice(0, 2).map(s => s.name).join(" and ")} would make me a valuable addition to your team.</p>

<p>Thank you for considering my application. I look forward to the opportunity to discuss how my background, skills, and experiences would be beneficial to ${data.company}.</p>

<p>Sincerely,<br>${personalInfo.firstName} ${personalInfo.lastName}</p>
      `;

      setGeneratedContent(generatedLetter);

      // Add the cover letter to the store
      addCoverLetter({
        title: data.title,
        content: generatedLetter,
        resumeId: data.resumeId,
        company: data.company,
        position: data.position,
        recipient: data.recipient,
        templateId: coverLetterTemplates[0]?.id,
      });

      setGeneratingLetter(false);
      setActiveTab("preview");
      toast.success("Cover letter generated successfully!");
    }, 2000);
  }

  const copyToClipboard = () => {
    // Strip HTML tags for plain text copy
    const tempElement = document.createElement("div");
    tempElement.innerHTML = generatedContent;
    navigator.clipboard.writeText(tempElement.textContent || tempElement.innerText);
    toast.success("Cover letter copied to clipboard");
  };

  const downloadAsHTML = () => {
    const fileName = `Cover_Letter_${form.getValues("company")}_${form.getValues("position").replace(/\s+/g, "_")}.html`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    p { margin-bottom: 16px; }
  </style>
</head>
<body>
  ${generatedContent}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Cover letter downloaded as ${fileName}`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">AI Cover Letter Generator</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedContent}>Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generate New Cover Letter</CardTitle>
                  <CardDescription>
                    Our AI will create a personalized cover letter based on your resume and job details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="resumeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Resume</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a resume" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {resumes.map((resume) => (
                                  <SelectItem key={resume.id} value={resume.id}>
                                    {resume.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              We'll use this resume to personalize your cover letter
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Letter Title</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., Application for Software Engineer at Google" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is for your reference only
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tone</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select tone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="professional">Professional</SelectItem>
                                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                  <SelectItem value="balanced">Balanced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The overall tone of your cover letter
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., Google" {...field} />
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
                                <Input placeholder="E.g., Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="recipient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Hiring Manager, Dr. Smith" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave blank to use "Hiring Manager"
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="keyPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Points to Include (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="E.g., I'm particularly interested in your AI research, I'm available to start immediately"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Additional points you want to highlight
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={generatingLetter}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {generatingLetter ? "Generating..." : "Generate Cover Letter"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tips for a Great Cover Letter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Address the right person</p>
                      <p className="text-sm text-muted-foreground">If possible, find the name of the hiring manager</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Keep it concise</p>
                      <p className="text-sm text-muted-foreground">Aim for 3-4 paragraphs on a single page</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Show enthusiasm</p>
                      <p className="text-sm text-muted-foreground">Express genuine interest in the role and company</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Highlight relevant experience</p>
                      <p className="text-sm text-muted-foreground">Focus on experiences that relate to the job description</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">End with a call to action</p>
                      <p className="text-sm text-muted-foreground">Express interest in an interview or further discussion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {generatedContent && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Cover Letter</CardTitle>
                      <CardDescription>
                        {form.getValues("position")} at {form.getValues("company")}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadAsHTML}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-6 rounded-md border shadow-sm">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("create")}>
                      Create Another Cover Letter
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Enhance Your Letter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Make More Formal
                    </Button>
                    <Button className="w-full" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Make More Creative
                    </Button>
                    <Button className="w-full" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Add More Achievements
                    </Button>
                    <Button className="w-full" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Make More Concise
                    </Button>
                    <Button className="w-full" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Fix Grammar & Style
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverLetters.length > 0 ? (
              coverLetters.map((letter) => (
                <Card key={letter.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg truncate">{letter.title}</CardTitle>
                    <CardDescription>
                      {letter.position} at {letter.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div
                      className="text-sm text-muted-foreground line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html: letter.content
                          .replace(/<p>/g, '')
                          .replace(/<\/p>/g, ' ')
                          .slice(0, 150) + '...'
                      }}
                    />
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileDown className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No cover letters found. Generate your first cover letter from the Create tab.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
