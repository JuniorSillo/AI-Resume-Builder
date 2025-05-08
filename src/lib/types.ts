// Resume Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  location?: string;
  description: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level?: number; // 1-5 for expertise level
  category?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  website?: string;
  location?: string;
  summary?: string;
  jobTitle?: string;
  profileImage?: string;
}

export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
  references?: string;
  additionalInfo?: string;
  templateId: string;
  templateColor?: string;
  templateFont?: string;
  score?: number;
  isPublic?: boolean;
}

// Cover Letter Types
export interface CoverLetter {
  id: string;
  title: string;
  content: string;
  resumeId: string;
  createdAt: string;
  updatedAt: string;
  company?: string;
  position?: string;
  recipient?: string;
  templateId?: string;
  templateColor?: string;
  templateFont?: string;
}

// Job Matching Types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  url: string;
  salary?: string;
  datePosted?: string;
  matchScore?: number;
  source?: string;
}

// Job Application Tracking Types
export interface JobApplication {
  id: string;
  jobId: string;
  resumeId: string;
  coverLetterId?: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected' | 'Accepted' | 'Withdrawn';
  dateApplied: string;
  dateUpdated: string;
  notes?: string;
  interviews?: Interview[];
  followUps?: FollowUp[];
  company: string;
  position: string;
  contactPerson?: string;
  contactEmail?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: 'Phone' | 'Video' | 'In-person' | 'Technical' | 'Other';
  date: string;
  time: string;
  duration?: number; // In minutes
  location?: string;
  interviewers?: string[];
  notes?: string;
  completed: boolean;
  feedback?: string;
}

export interface FollowUp {
  id: string;
  applicationId: string;
  type: 'Email' | 'Call' | 'Other';
  date: string;
  notes: string;
  completed: boolean;
  response?: string;
}

// Interview Preparation Types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  answer?: string;
  userAnswer?: string;
  feedback?: string;
}

export interface InterviewPrep {
  id: string;
  title: string;
  resumeId: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
  questions: InterviewQuestion[];
  notes?: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'Resume' | 'Cover Letter';
  previewImage: string;
  isAIPowered: boolean;
  industry?: string[];
  careerLevel?: ('Entry' | 'Mid' | 'Senior' | 'Executive')[];
  popularity?: number;
}

// Media Types
export interface VideoResume {
  id: string;
  resumeId: string;
  title: string;
  url: string;
  duration: number; // In seconds
  createdAt: string;
  transcription?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  subscription?: 'Free' | 'Premium' | 'Enterprise';
  resumes: Resume[];
  coverLetters: CoverLetter[];
  jobApplications: JobApplication[];
  interviewPreps: InterviewPrep[];
  videoResumes: VideoResume[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  defaultResumeId?: string;
  defaultTemplateId?: string;
  defaultColor?: string;
  defaultFont?: string;
  language?: string;
  notifications?: boolean;
}
