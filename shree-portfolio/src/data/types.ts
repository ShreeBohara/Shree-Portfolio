// Portfolio data types

export interface Project {
  id: string;              // Unique identifier (e.g., "project-1")
  title: string;           // Project name
  slug: string;            // URL-friendly version (e.g., "ai-chatbot")
  year: number;            // Year completed (e.g., 2024)
  duration: string;        // Duration (e.g., "3 months")
  category: ProjectCategory;
  summary: string;         // 2-3 line overview
  problem: string;         // Problem statement (1-2 sentences)
  approach: string;        // Technical approach (2-3 sentences)
  impact: string;          // Business impact (1-2 sentences)
  
  metrics: {
    label: string;       // e.g., "Performance Improvement"
    value: string;       // e.g., "40% faster load times"
  }[];
  
  myRole: string;          // Your specific contribution
  teamSize?: number;       // Optional team size
  
  technologies: string[];  // Tech stack used
  tags: string[];          // Searchable tags
  
  links: {
    live?: string;       // Live demo URL
    github?: string;     // GitHub repository
    caseStudy?: string;  // Detailed write-up
    video?: string;      // Demo video
  };
  
  images?: {
    thumbnail: string;   // Card thumbnail
    screenshots?: string[]; // Project screenshots
  };
  
  featured: boolean;       // Highlight as featured project
  sortOrder: number;       // Manual sort priority
}

export type ProjectCategory = 
  | 'AI/ML' 
  | 'Full-Stack' 
  | 'Data Engineering' 
  | 'Mobile' 
  | 'DevOps'
  | 'Open Source';

export interface Experience {
  id: string;
  company: string;         // Company name
  role: string;           // Job title
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  location: string;       // City, State/Country
  startDate: string;      // "YYYY-MM" format
  endDate: string | null; // null for current role
  current: boolean;
  
  summary: string;        // 1-2 line role overview
  
  highlights: {
    text: string;         // Achievement description
    metric?: string;      // Optional quantified impact
  }[];
  
  technologies: string[]; // Tech used in this role
  
  companyInfo?: {
    website?: string;
    industry?: string;
    size?: string;        // e.g., "Series B startup", "Fortune 500"
  };

  links?: {
    company?: string;     // Company website
    project?: string;     // Live project URL
    caseStudy?: string;   // Blog post or case study
  };
}

export interface Education {
  id: string;
  institution: string;     // University/School name
  degree: string;         // e.g., "Bachelor of Science"
  field: string;          // e.g., "Computer Science"
  location: string;
  startYear: number;
  endYear: number;
  gpa?: string;           // Optional GPA
  
  relevantCoursework: string[]; // Key courses
  
  achievements?: string[]; // Honors, awards, etc.
  
  projects?: {
    name: string;
    description: string;
  }[];
}

export interface PersonalInfo {
  name: string;
  title: string;           // e.g., "Senior Full-Stack Developer"
  tagline: string;        // Short intro (1 line)
  bio: string;            // Longer about section (2-3 paragraphs)
  location: string;

  availability: {
    status: 'Available' | 'Busy' | 'Open to opportunities';
    message?: string;     // Optional custom message
  };

  links: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
    calendar?: string;    // Booking link (Calendly, Cal.com)
    resume: {
      pdf: string;       // PDF download link
      docx?: string;     // Optional DOCX version
    };
  };

  skills: {
    category: string;    // e.g., "Languages", "Frameworks"
    items: string[];
  }[];

  // Extended personal content for AI chat
  careerStory?: {
    background: string;           // Where from, early interests
    inspiration: string;          // What got you into CS
    keyMoments: string[];        // Pivotal experiences
    whyUSC: string;              // Reasoning for graduate school
    whatDrivesYou: string;       // Motivation in tech
  };

  technicalPhilosophy?: {
    approach: string;            // How you build software
    whatExcitesYou: string;      // What drives you in development
    favoriteTools: {
      name: string;
      reason: string;
    }[];
    goodProject: string;         // What makes a good project
    aiThoughts: string;          // Views on AI/ML in development
  };

  interests?: {
    hobbies: string[];           // Activities outside coding
    books: string[];             // Favorite books
    podcasts: string[];          // Favorite podcasts
    youtube: string[];           // Favorite creators
    freeTime: string;            // How you unwind
  };

  faqs?: {
    question: string;
    answer: string;
    category: 'career' | 'technical' | 'personal' | 'hiring';
  }[];

  workStyle?: {
    preferences: string;         // Independent vs collaborative, etc.
    values: string[];           // Important workplace values
    handlingChallenges: string; // Approach to setbacks
  };

  jobSearch?: {
    visa: string;               // Visa status and work authorization
    locationPreference: string; // Geographic preferences
    companySizePreference: string; // Startup vs BigTech
    redirectToCall: string[];   // Topics to redirect to Calendly
  };
}

// Helper types for filtering and sorting
export type SortOption = 'recent' | 'name' | 'impact';
export type GroupOption = 'none' | 'category' | 'year';
export type ViewMode = 'grid' | 'list';

// Type for chat citations
export interface Citation {
  type: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle' | 'resume';
  id: string;
  title: string;
  url?: string;
}
