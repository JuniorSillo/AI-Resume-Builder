import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resume, CoverLetter, JobApplication, InterviewPrep, VideoResume, Job, Template } from './types';
import { sampleResume, sampleCoverLetter, sampleJobApplications, sampleJobs, sampleInterviewPrep, resumeTemplates, coverLetterTemplates } from './data';
import { generateUniqueId } from './utils';

interface AppState {
  // User data
  userEmail: string | null;
  userName: string | null;
  userSubscription: 'Free' | 'Premium' | 'Enterprise' | null;

  // Resume data
  resumes: Resume[];
  activeResumeId: string | null;

  // Cover letter data
  coverLetters: CoverLetter[];
  activeCoverLetterId: string | null;

  // Job data
  savedJobs: Job[];
  jobApplications: JobApplication[];

  // Interview data
  interviewPreps: InterviewPrep[];

  // Media data
  videoResumes: VideoResume[];

  // Template data
  resumeTemplates: Template[];
  coverLetterTemplates: Template[];

  // Actions
  setUserData: (email: string, name: string, subscription: 'Free' | 'Premium' | 'Enterprise') => void;
  setActiveResumeId: (id: string) => void;
  setActiveCoverLetterId: (id: string) => void;

  // Resume actions
  addResume: (resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => Resume;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;

  // Cover letter actions
  addCoverLetter: (coverLetter: Omit<CoverLetter, 'id' | 'createdAt' | 'updatedAt'>) => CoverLetter;
  updateCoverLetter: (id: string, updates: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;

  // Job actions
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
  addJobApplication: (application: Omit<JobApplication, 'id' | 'dateUpdated'>) => JobApplication;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;

  // Interview actions
  addInterviewPrep: (prep: Omit<InterviewPrep, 'id' | 'createdAt' | 'updatedAt'>) => InterviewPrep;
  updateInterviewPrep: (id: string, updates: Partial<InterviewPrep>) => void;
  deleteInterviewPrep: (id: string) => void;

  // Media actions
  addVideoResume: (video: Omit<VideoResume, 'id' | 'createdAt'>) => VideoResume;
  deleteVideoResume: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      userEmail: null,
      userName: null,
      userSubscription: null,
      resumes: [sampleResume],
      activeResumeId: sampleResume.id,
      coverLetters: [sampleCoverLetter],
      activeCoverLetterId: sampleCoverLetter.id,
      savedJobs: sampleJobs,
      jobApplications: sampleJobApplications,
      interviewPreps: [sampleInterviewPrep],
      videoResumes: [],
      resumeTemplates,
      coverLetterTemplates,

      // Action implementations
      setUserData: (email, name, subscription) => set({ userEmail: email, userName: name, userSubscription: subscription }),
      setActiveResumeId: (id) => set({ activeResumeId: id }),
      setActiveCoverLetterId: (id) => set({ activeCoverLetterId: id }),

      // Resume actions
      addResume: (resumeData) => {
        const newResume: Resume = {
          ...resumeData,
          id: generateUniqueId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          resumes: [...state.resumes, newResume],
          activeResumeId: newResume.id
        }));

        return newResume;
      },

      updateResume: (id, updates) => set((state) => ({
        resumes: state.resumes.map((resume) =>
          resume.id === id
            ? { ...resume, ...updates, updatedAt: new Date().toISOString() }
            : resume
        )
      })),

      deleteResume: (id) => set((state) => ({
        resumes: state.resumes.filter((resume) => resume.id !== id),
        activeResumeId: state.activeResumeId === id ? (state.resumes.length > 1 ? state.resumes.find(r => r.id !== id)?.id || null : null) : state.activeResumeId
      })),

      // Cover letter actions
      addCoverLetter: (coverLetterData) => {
        const newCoverLetter: CoverLetter = {
          ...coverLetterData,
          id: generateUniqueId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          coverLetters: [...state.coverLetters, newCoverLetter],
          activeCoverLetterId: newCoverLetter.id
        }));

        return newCoverLetter;
      },

      updateCoverLetter: (id, updates) => set((state) => ({
        coverLetters: state.coverLetters.map((coverLetter) =>
          coverLetter.id === id
            ? { ...coverLetter, ...updates, updatedAt: new Date().toISOString() }
            : coverLetter
        )
      })),

      deleteCoverLetter: (id) => set((state) => ({
        coverLetters: state.coverLetters.filter((coverLetter) => coverLetter.id !== id),
        activeCoverLetterId: state.activeCoverLetterId === id ? (state.coverLetters.length > 1 ? state.coverLetters.find(cl => cl.id !== id)?.id || null : null) : state.activeCoverLetterId
      })),

      // Job actions
      saveJob: (job) => set((state) => ({
        savedJobs: [...state.savedJobs.filter(j => j.id !== job.id), job]
      })),

      removeJob: (id) => set((state) => ({
        savedJobs: state.savedJobs.filter((job) => job.id !== id)
      })),

      addJobApplication: (applicationData) => {
        const newApplication: JobApplication = {
          ...applicationData,
          id: generateUniqueId(),
          dateUpdated: new Date().toISOString()
        };

        set((state) => ({
          jobApplications: [...state.jobApplications, newApplication]
        }));

        return newApplication;
      },

      updateJobApplication: (id, updates) => set((state) => ({
        jobApplications: state.jobApplications.map((application) =>
          application.id === id
            ? { ...application, ...updates, dateUpdated: new Date().toISOString() }
            : application
        )
      })),

      deleteJobApplication: (id) => set((state) => ({
        jobApplications: state.jobApplications.filter((application) => application.id !== id)
      })),

      // Interview actions
      addInterviewPrep: (prepData) => {
        const newPrep: InterviewPrep = {
          ...prepData,
          id: generateUniqueId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          interviewPreps: [...state.interviewPreps, newPrep]
        }));

        return newPrep;
      },

      updateInterviewPrep: (id, updates) => set((state) => ({
        interviewPreps: state.interviewPreps.map((prep) =>
          prep.id === id
            ? { ...prep, ...updates, updatedAt: new Date().toISOString() }
            : prep
        )
      })),

      deleteInterviewPrep: (id) => set((state) => ({
        interviewPreps: state.interviewPreps.filter((prep) => prep.id !== id)
      })),

      // Media actions
      addVideoResume: (videoData) => {
        const newVideo: VideoResume = {
          ...videoData,
          id: generateUniqueId(),
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          videoResumes: [...state.videoResumes, newVideo]
        }));

        return newVideo;
      },

      deleteVideoResume: (id) => set((state) => ({
        videoResumes: state.videoResumes.filter((video) => video.id !== id)
      }))
    }),
    {
      name: 'resume-builder-store',
    }
  )
);
