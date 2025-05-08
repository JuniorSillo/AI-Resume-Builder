import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// AI suggestion utility functions
export const suggestJobDescription = (role: string, experience: string): string => {
  // This would be replaced with actual AI implementation
  return `Enhanced ${role} professional with ${experience} years of industry experience. Skilled in improving processes and achieving measurable results.`;
};

export const getResumeScore = (content: string): number => {
  // This would be replaced with actual AI scoring logic
  if (!content) return 0;
  const length = content.length;
  return Math.min(Math.floor(length / 100), 100);
};

export const suggestKeywords = (jobTitle: string): string[] => {
  // This would be replaced with actual AI keyword suggestion
  const keywords = {
    "software engineer": ["JavaScript", "React", "Node.js", "API", "Git", "CI/CD"],
    "product manager": ["Agile", "Roadmap", "User Stories", "KPIs", "Stakeholder", "MVP"],
    "marketing specialist": ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Campaign"],
    "data scientist": ["Python", "Machine Learning", "Data Visualization", "SQL", "Statistics"],
  };

  const defaultKeywords = ["Leadership", "Communication", "Problem-solving", "Teamwork"];

  // Normalize job title for matching
  const normalizedTitle = jobTitle.toLowerCase();

  for (const [title, words] of Object.entries(keywords)) {
    if (normalizedTitle.includes(title)) {
      return [...words, ...defaultKeywords];
    }
  }

  return defaultKeywords;
};
