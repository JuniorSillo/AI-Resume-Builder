import { Template, Resume, CoverLetter, Job, JobApplication, InterviewPrep, InterviewQuestion } from './types';
import { generateUniqueId } from './utils';

// Resume Templates
export const resumeTemplates: Template[] = [
  {
    id: 'template-modern',
    name: 'Modern',
    description: 'A clean and modern design suitable for most industries',
    type: 'Resume',
    previewImage: '/templates/modern-resume.png',
    isAIPowered: true,
    industry: ['Technology', 'Design', 'Marketing', 'Business'],
    careerLevel: ['Entry', 'Mid', 'Senior'],
    popularity: 95
  },
  {
    id: 'template-professional',
    name: 'Professional',
    description: 'A traditional layout for corporate and conservative industries',
    type: 'Resume',
    previewImage: '/templates/professional-resume.png',
    isAIPowered: true,
    industry: ['Finance', 'Banking', 'Legal', 'Healthcare', 'Government'],
    careerLevel: ['Mid', 'Senior', 'Executive'],
    popularity: 88
  },
  {
    id: 'template-creative',
    name: 'Creative',
    description: 'A bold design to showcase creativity and unique skills',
    type: 'Resume',
    previewImage: '/templates/creative-resume.png',
    isAIPowered: true,
    industry: ['Design', 'Art', 'Media', 'Entertainment', 'Marketing'],
    careerLevel: ['Entry', 'Mid', 'Senior'],
    popularity: 75
  },
  {
    id: 'template-minimal',
    name: 'Minimal',
    description: 'A minimalist template with focus on content and readability',
    type: 'Resume',
    previewImage: '/templates/minimal-resume.png',
    isAIPowered: false,
    industry: ['Technology', 'Science', 'Research', 'Academic'],
    careerLevel: ['Entry', 'Mid', 'Senior', 'Executive'],
    popularity: 82
  },
  {
    id: 'template-executive',
    name: 'Executive',
    description: 'An elegant design for executives and senior professionals',
    type: 'Resume',
    previewImage: '/templates/executive-resume.png',
    isAIPowered: true,
    industry: ['Business', 'Consulting', 'Finance', 'Management'],
    careerLevel: ['Senior', 'Executive'],
    popularity: 70
  }
];

// Cover Letter Templates
export const coverLetterTemplates: Template[] = [
  {
    id: 'cover-modern',
    name: 'Modern Cover Letter',
    description: 'A clean and modern cover letter design',
    type: 'Cover Letter',
    previewImage: '/templates/modern-cover.png',
    isAIPowered: true,
    industry: ['Technology', 'Design', 'Marketing', 'Business'],
    careerLevel: ['Entry', 'Mid', 'Senior'],
    popularity: 90
  },
  {
    id: 'cover-professional',
    name: 'Professional Cover Letter',
    description: 'A traditional cover letter for corporate roles',
    type: 'Cover Letter',
    previewImage: '/templates/professional-cover.png',
    isAIPowered: true,
    industry: ['Finance', 'Banking', 'Legal', 'Healthcare'],
    careerLevel: ['Mid', 'Senior', 'Executive'],
    popularity: 85
  },
  {
    id: 'cover-creative',
    name: 'Creative Cover Letter',
    description: 'A bold cover letter design for creative industries',
    type: 'Cover Letter',
    previewImage: '/templates/creative-cover.png',
    isAIPowered: true,
    industry: ['Design', 'Art', 'Media', 'Entertainment'],
    careerLevel: ['Entry', 'Mid', 'Senior'],
    popularity: 78
  }
];

// Sample Resume
export const sampleResume: Resume = {
  id: generateUniqueId(),
  title: 'Software Developer Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    linkedIn: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    location: 'San Francisco, CA',
    summary: 'Innovative software developer with 5 years of experience in full-stack development. Passionate about creating efficient, scalable solutions that solve real-world problems.',
    jobTitle: 'Senior Software Developer',
  },
  experiences: [
    {
      id: generateUniqueId(),
      company: 'TechCorp Inc.',
      position: 'Senior Software Developer',
      startDate: '2020-03',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      description: 'Leading development of cloud-based applications for enterprise clients.',
      highlights: [
        'Spearheaded the migration of legacy systems to modern cloud architecture, reducing operational costs by 35%',
        'Led a team of 5 developers in creating a new customer portal that increased user engagement by 40%',
        'Implemented CI/CD pipelines that reduced deployment time from days to hours',
        'Optimized database queries resulting in 50% faster application response times'
      ]
    },
    {
      id: generateUniqueId(),
      company: 'WebSolutions LLC',
      position: 'Frontend Developer',
      startDate: '2018-01',
      endDate: '2020-02',
      current: false,
      location: 'San Jose, CA',
      description: 'Developed responsive web applications for various clients.',
      highlights: [
        'Created interactive UI components using React that improved user engagement metrics by 25%',
        'Collaborated with UX designers to implement responsive designs across multiple devices',
        'Reduced bundle size by 30% through code splitting and lazy loading techniques',
        'Mentored junior developers on frontend best practices and testing methodologies'
      ]
    }
  ],
  education: [
    {
      id: generateUniqueId(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      location: 'Berkeley, CA',
      description: 'Graduated with honors. Specialized in Software Engineering and Artificial Intelligence.'
    }
  ],
  skills: [
    { id: generateUniqueId(), name: 'JavaScript', level: 5, category: 'Programming' },
    { id: generateUniqueId(), name: 'TypeScript', level: 4, category: 'Programming' },
    { id: generateUniqueId(), name: 'React', level: 5, category: 'Frontend' },
    { id: generateUniqueId(), name: 'Node.js', level: 4, category: 'Backend' },
    { id: generateUniqueId(), name: 'Python', level: 3, category: 'Programming' },
    { id: generateUniqueId(), name: 'AWS', level: 4, category: 'Cloud' },
    { id: generateUniqueId(), name: 'Docker', level: 3, category: 'DevOps' },
    { id: generateUniqueId(), name: 'GraphQL', level: 4, category: 'API' },
    { id: generateUniqueId(), name: 'MongoDB', level: 3, category: 'Database' },
    { id: generateUniqueId(), name: 'SQL', level: 4, category: 'Database' }
  ],
  projects: [
    {
      id: generateUniqueId(),
      name: 'E-commerce Platform',
      description: 'Built a scalable e-commerce platform with advanced search and recommendation features',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
      url: 'https://github.com/alexj/ecommerce-platform'
    },
    {
      id: generateUniqueId(),
      name: 'Machine Learning Visualizer',
      description: 'Interactive tool for visualizing machine learning algorithms in real-time',
      technologies: ['Python', 'TensorFlow', 'D3.js', 'Flask'],
      url: 'https://github.com/alexj/ml-visualizer'
    }
  ],
  certificates: [
    {
      id: generateUniqueId(),
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2021-05',
      credentialUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
    }
  ],
  languages: [
    { id: generateUniqueId(), name: 'English', proficiency: 'Native' },
    { id: generateUniqueId(), name: 'Spanish', proficiency: 'Fluent' }
  ],
  templateId: 'template-modern',
  templateColor: '#2563eb',
  score: 85
};

// Sample Cover Letter
export const sampleCoverLetter: CoverLetter = {
  id: generateUniqueId(),
  title: 'Application for Senior Developer at TechCorp',
  content: `<p>Dear Hiring Manager,</p>

  <p>I am writing to express my interest in the Senior Developer position at TechCorp as advertised on your company website. With over 5 years of experience in full-stack development and a proven track record of delivering high-quality software solutions, I believe I would be a valuable addition to your team.</p>

  <p>In my current role at WebSolutions LLC, I have successfully led the development of several large-scale projects, resulting in significant improvements in user engagement and system performance. My expertise in JavaScript, React, and Node.js aligns perfectly with the technical requirements outlined in your job description.</p>

  <p>What particularly excites me about TechCorp is your commitment to innovation and your focus on creating products that make a real difference in people's lives. I share these values and would welcome the opportunity to contribute to your mission.</p>

  <p>I look forward to the possibility of discussing how my skills and experience could benefit TechCorp. Thank you for considering my application.</p>

  <p>Sincerely,<br>Alex Johnson</p>`,
  resumeId: sampleResume.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  company: 'TechCorp',
  position: 'Senior Developer',
  recipient: 'Hiring Manager',
  templateId: 'cover-modern'
};

// Sample Jobs for Job Matching
export const sampleJobs: Job[] = [
  {
    id: generateUniqueId(),
    title: 'Senior Frontend Developer',
    company: 'InnovateTech',
    location: 'San Francisco, CA (Remote)',
    description: 'We are looking for a Senior Frontend Developer with strong React experience to join our growing team. You will be responsible for building user interfaces for our flagship product.',
    requirements: [
      'At least 4 years of experience with React',
      'Strong knowledge of JavaScript/TypeScript',
      'Experience with state management (Redux, Context API)',
      'Familiarity with modern frontend build tools',
      'Experience with responsive design and cross-browser compatibility'
    ],
    url: 'https://example.com/jobs/senior-frontend',
    salary: '$120,000 - $150,000',
    datePosted: '2023-04-15',
    matchScore: 92,
    source: 'LinkedIn'
  },
  {
    id: generateUniqueId(),
    title: 'Full Stack Engineer',
    company: 'GrowthStartup',
    location: 'Remote',
    description: 'Join our fast-growing startup as a Full Stack Engineer. Work on challenging problems and help shape our product from the ground up.',
    requirements: [
      'Experience with React and Node.js',
      'Familiarity with cloud services (AWS/GCP)',
      'Knowledge of database design and optimization',
      'Experience with API design and implementation',
      'Ability to work in a fast-paced environment'
    ],
    url: 'https://example.com/jobs/fullstack-engineer',
    salary: '$110,000 - $140,000',
    datePosted: '2023-04-20',
    matchScore: 87,
    source: 'Indeed'
  },
  {
    id: generateUniqueId(),
    title: 'Software Developer',
    company: 'Enterprise Solutions',
    location: 'San Jose, CA',
    description: 'Enterprise Solutions is seeking a Software Developer to join our team. You will be working on our cloud-based enterprise applications.',
    requirements: [
      'Experience with JavaScript and modern frameworks',
      'Knowledge of database systems',
      'Familiarity with cloud computing',
      'Good problem-solving skills',
      'Team player with good communication skills'
    ],
    url: 'https://example.com/jobs/software-developer',
    salary: '$100,000 - $130,000',
    datePosted: '2023-04-18',
    matchScore: 78,
    source: 'Company Website'
  }
];

// Sample Job Applications
export const sampleJobApplications: JobApplication[] = [
  {
    id: generateUniqueId(),
    jobId: sampleJobs[0].id,
    resumeId: sampleResume.id,
    coverLetterId: sampleCoverLetter.id,
    status: 'Interviewing',
    dateApplied: '2023-04-20',
    dateUpdated: '2023-04-25',
    notes: 'Had a great initial call with the recruiter. Technical interview scheduled for next week.',
    company: 'InnovateTech',
    position: 'Senior Frontend Developer',
    contactPerson: 'Sarah Miller',
    contactEmail: 'sarah.miller@innovatetech.example.com',
    interviews: [
      {
        id: generateUniqueId(),
        applicationId: '',
        type: 'Phone',
        date: '2023-04-25',
        time: '10:00 AM',
        duration: 30,
        interviewers: ['Sarah Miller (Recruiter)'],
        notes: 'Basic screening call to discuss experience and expectations',
        completed: true,
        feedback: 'Went well. Moving to technical interview.'
      },
      {
        id: generateUniqueId(),
        applicationId: '',
        type: 'Technical',
        date: '2023-05-02',
        time: '2:00 PM',
        duration: 60,
        interviewers: ['John Davis (Engineering Manager)', 'Lisa Wong (Senior Developer)'],
        notes: 'Will cover JavaScript, React, and system design questions',
        completed: false
      }
    ],
    followUps: [
      {
        id: generateUniqueId(),
        applicationId: '',
        type: 'Email',
        date: '2023-04-26',
        notes: 'Sent thank you email after the phone screening',
        completed: true,
        response: 'Sarah replied with details for the technical interview'
      }
    ]
  },
  {
    id: generateUniqueId(),
    jobId: sampleJobs[1].id,
    resumeId: sampleResume.id,
    status: 'Applied',
    dateApplied: '2023-04-22',
    dateUpdated: '2023-04-22',
    notes: 'Applied through their careers page. Waiting to hear back.',
    company: 'GrowthStartup',
    position: 'Full Stack Engineer'
  }
];

// Update application IDs
sampleJobApplications.forEach(application => {
  if (application.interviews) {
    application.interviews.forEach(interview => {
      interview.applicationId = application.id;
    });
  }
  if (application.followUps) {
    application.followUps.forEach(followUp => {
      followUp.applicationId = application.id;
    });
  }
});

// Sample Interview Questions
export const sampleInterviewQuestions: InterviewQuestion[] = [
  {
    id: generateUniqueId(),
    question: 'Tell me about yourself and your experience as a developer.',
    category: 'General',
    difficulty: 'Easy'
  },
  {
    id: generateUniqueId(),
    question: 'What are the key differences between React and Angular?',
    category: 'Technical',
    difficulty: 'Medium',
    answer: 'React is a library focused on UI components while Angular is a complete framework. React uses a virtual DOM for performance optimization, while Angular uses real DOM with change detection. React offers more flexibility in choosing additional libraries, while Angular is more opinionated with built-in solutions.'
  },
  {
    id: generateUniqueId(),
    question: 'Explain how you would design a scalable web application architecture.',
    category: 'System Design',
    difficulty: 'Hard'
  },
  {
    id: generateUniqueId(),
    question: 'Describe a challenging project you worked on and how you overcame obstacles.',
    category: 'Behavioral',
    difficulty: 'Medium'
  },
  {
    id: generateUniqueId(),
    question: 'How do you stay updated with the latest technologies and trends?',
    category: 'General',
    difficulty: 'Easy'
  },
  {
    id: generateUniqueId(),
    question: 'Explain the concept of closures in JavaScript.',
    category: 'Technical',
    difficulty: 'Medium',
    answer: 'A closure is when a function can remember and access its lexical scope even when it\'s executed outside that scope. In simpler terms, a closure gives you access to an outer function\'s scope from an inner function. Closures are useful for data privacy, function factories, and maintaining state in asynchronous programming.'
  },
  {
    id: generateUniqueId(),
    question: 'How would you optimize the performance of a React application?',
    category: 'Technical',
    difficulty: 'Hard'
  },
  {
    id: generateUniqueId(),
    question: 'Describe your approach to debugging complex issues.',
    category: 'Problem Solving',
    difficulty: 'Medium'
  }
];

// Sample Interview Prep
export const sampleInterviewPrep: InterviewPrep = {
  id: generateUniqueId(),
  title: 'InnovateTech Senior Frontend Developer Interview Prep',
  resumeId: sampleResume.id,
  jobId: sampleJobs[0].id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: sampleInterviewQuestions.slice(0, 5),
  notes: 'Research InnovateTech\'s latest products and tech stack. Review React performance optimization techniques. Prepare questions about team structure and development process.'
};
