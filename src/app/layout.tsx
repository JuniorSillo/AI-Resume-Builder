import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientBody } from "./ClientBody";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Resume Builder | Create ATS-Optimized Resumes",
  description: "Build professional, ATS-optimized resumes with AI assistance. Features include smart bullet points, job matching, AI cover letters, interview prep, and more.",
  keywords: "resume builder, AI resume, ATS resume, job application, cover letter, job matching, interview preparation, video resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
