# Data Model Documentation

## Overview

The portfolio data model defines the structure for all content including projects, experience, education, and personal information. All data is stored in `src/data/portfolio.ts` with TypeScript types defined in `src/data/types.ts`.

## File Structure

```
src/data/
├── portfolio.ts  # All portfolio content (531 lines)
└── types.ts      # TypeScript type definitions
```

## Type Definitions

### PersonalInfo

**Purpose:** Core personal information, bio, and extended content for AI chat

```typescript
interface PersonalInfo {
  // Basic Info
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  
  // Availability
  availability: {
    status: 'Available' | 'Busy' | 'Open to opportunities';
    message?: string;
  };
  
  // Links
  links: {
    email: string;
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
    calendar?: string;
    resume: {
      pdf: string;
      docx?: string;
    };
  };
  
  // Skills
  skills: {
    category: string;
    items: string[];
  }[];
  
  // Extended Content for AI
  careerStory?: {
    background: string;
    inspiration: string;
    keyMoments: string[];
    whyUSC: string;
    whatDrivesYou: string;
  };
  
  technicalPhilosophy?: {
    approach: string;
    whatExcitesYou: string;
    favoriteTools: {
      name: string;
      reason: string;
    }[];
    goodProject: string;
    aiThoughts: string;
  };
  
  interests?: {
    hobbies: string[];
    books: string[];
    podcasts: string[];
    youtube: string[];
    freeTime: string;
  };
  
  faqs?: {
    question: string;
    answer: string;
    category: 'career' | 'technical' | 'personal' | 'hiring';
  }[];
  
  workStyle?: {
    preferences: string;
    values: string[];
    handlingChallenges: string;
  };
  
  jobSearch?: {
    visa: string;
    locationPreference: string;
    companySizePreference: string;
    redirectToCall: string[];
  };
}
```

**Example:**
```typescript
export const personalInfo: PersonalInfo = {
  name: "Shree Bohara",
  title: "Software Engineer",
  tagline: "Building AI-powered solutions that scale",
  bio: `I'm a Computer Science graduate student at USC...`,
  location: "Los Angeles, CA",
  
  availability: {
    status: 'Open to opportunities',
    message: "USC CS Graduate Student, seeking full-time opportunities starting May 2026"
  },
  
  links: {
    email: "bohara@usc.edu",
    github: "https://github.com/ShreeBohara",
    linkedin: "https://www.linkedin.com/in/shree-bohara/",
    calendar: "https://calendly.com/shreetbohara/connect-with-shree",
    resume: {
      pdf: "https://docs.google.com/document/d/.../edit",
      docx: "https://docs.google.com/document/.../export?format=docx"
    }
  },
  
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "Java", "TypeScript", "C++", "Python"]
    },
    {
      category: "Full Stack",
      items: ["React", "Next.js", "Vue", "Node.js", "REST APIs", "MySQL", "Spring Boot"]
    }
  ],
  
  careerStory: {
    background: "I'm originally from Pune, India...",
    inspiration: "It all started with curiosity...",
    keyMoments: [
      "My first project was building a calculator...",
      "One of my most memorable experiences was my first hackathon..."
    ],
    whyUSC: "I chose USC primarily for two reasons...",
    whatDrivesYou: "I'm driven by building software that removes real barriers..."
  },
  
  faqs: [
    {
      question: "Tell me about yourself",
      answer: "I'm Shree Bohara, a Computer Science graduate student at USC...",
      category: "personal"
    }
  ]
};
```

### Project

**Purpose:** Individual project details with problem-approach-impact narrative

```typescript
interface Project {
  // Identifiers
  id: string;              // Unique ID (e.g., "project-1")
  title: string;
  slug: string;            // URL-friendly (e.g., "ai-resume-builder")
  
  // Metadata
  year: number;
  duration: string;        // e.g., "3 months"
  category: ProjectCategory;
  
  // Content
  summary: string;         // 2-3 line overview
  problem: string;         // Problem statement (1-2 sentences)
  approach: string;        // Technical approach (2-3 sentences)
  impact: string;          // Business impact (1-2 sentences)
  
  // Metrics
  metrics: {
    label: string;         // e.g., "Performance Improvement"
    value: string;         // e.g., "40% faster"
  }[];
  
  // Team & Role
  myRole: string;
  teamSize?: number;
  
  // Technical
  technologies: string[];
  tags: string[];
  
  // Links
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
    video?: string;
  };
  
  // Display
  images?: {
    thumbnail: string;
    screenshots?: string[];
  };
  featured: boolean;
  sortOrder: number;
}

type ProjectCategory = 
  | 'AI/ML' 
  | 'Full-Stack' 
  | 'Data Engineering' 
  | 'Mobile' 
  | 'DevOps'
  | 'Open Source';
```

**Example:**
```typescript
{
  id: "project-1",
  title: "AI-Powered Resume Builder",
  slug: "ai-resume-builder",
  year: 2025,
  duration: "3 months",
  category: "AI/ML",
  
  summary: "Implemented an AI-driven resume builder using React and OpenAI APIs, reducing manual edits by 80% through automated keyword optimization and skill matching.",
  
  problem: "Job seekers struggle to tailor resumes for specific positions and optimize for Applicant Tracking Systems (ATS).",
  
  approach: "Built an intelligent system using OpenAI APIs for automated keyword optimization, skill matching, and ATS compatibility checks.",
  
  impact: "Achieved 30% higher interview callback rate by enhancing ATS compatibility and tailoring resumes to specific job descriptions.",
  
  metrics: [
    { label: "Manual Edits", value: "80% reduction" },
    { label: "Interview Callbacks", value: "+30%" },
    { label: "Load Time", value: "40% faster" },
    { label: "ATS Score", value: "Optimized" }
  ],
  
  myRole: "Full-stack developer, designed and implemented the entire application including AI integration and AWS deployment.",
  teamSize: 1,
  
  technologies: ["React", "OpenAI API", "AWS", "Node.js", "TypeScript"],
  tags: ["AI", "NLP", "Career Tech", "AWS", "Automation"],
  
  links: {
    github: "https://github.com/ShreeBohara/ai-resume-builder"
  },
  
  featured: true,
  sortOrder: 1
}
```

### Experience

**Purpose:** Work experience with highlights and metrics

```typescript
interface Experience {
  // Identifiers
  id: string;
  company: string;
  role: string;
  
  // Type & Location
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  location: string;
  
  // Dates
  startDate: string;       // "YYYY-MM" format
  endDate: string | null;  // null for current role
  current: boolean;
  
  // Content
  summary: string;         // 1-2 line role overview
  
  highlights: {
    text: string;          // Achievement description
    metric?: string;       // Optional quantified impact
  }[];
  
  // Technical
  technologies: string[];
  
  // Company Info
  companyInfo?: {
    website?: string;
    industry?: string;
    size?: string;
  };
  
  // Links
  links?: {
    company?: string;
    project?: string;
    caseStudy?: string;
  };
}
```

**Example:**
```typescript
{
  id: "exp-1",
  company: "QuinStreet",
  role: "Software Engineer - Intern",
  type: "Internship",
  location: "Foster City, CA",
  startDate: "2025-06",
  endDate: null,
  current: true,
  
  summary: "Shipping production features for insurance quote platform, building AI chat experiences, and optimizing onboarding flows.",
  
  highlights: [
    {
      text: "Shipped Pond from Figma to production in under 3 months (live at insurance.com/pond)",
      metric: "Reduced integration rework and sped up releases"
    },
    {
      text: "Redesigned 23-step React onboarding flow with summaries and inline edits",
      metric: "30% reduction in time-to-complete"
    }
  ],
  
  technologies: ["React", "TypeScript", "Spring Boot", "Java", "SQL", "Voiceflow"],
  
  companyInfo: {
    website: "https://quinstreet.com",
    industry: "InsurTech/Digital Marketing",
    size: "Public company"
  },
  
  links: {
    company: "https://quinstreet.com",
    project: "https://insurance.com/pond"
  }
}
```

### Education

**Purpose:** Academic background with coursework and achievements

```typescript
interface Education {
  // Identifiers
  id: string;
  institution: string;
  
  // Degree
  degree: string;          // e.g., "Bachelor of Science"
  field: string;           // e.g., "Computer Science"
  
  // Location & Dates
  location: string;
  startYear: number;
  endYear: number;
  gpa?: string;
  
  // Content
  relevantCoursework: string[];
  achievements?: string[];
  
  // Projects
  projects?: {
    name: string;
    description: string;
  }[];
}
```

**Example:**
```typescript
{
  id: "edu-1",
  institution: "University of Southern California",
  degree: "Master of Science",
  field: "Computer Science",
  location: "Los Angeles, CA",
  startYear: 2024,
  endYear: 2026,
  
  relevantCoursework: [
    "Analysis of Algorithms",
    "Web Technologies",
    "Database Systems",
    "Information Retrieval"
  ],
  
  achievements: [
    "Published in YMER (June 2024): Showcased LSTM's superiority in sound classification",
    "Runner-Up among 30 teams at NIT-B Hackathon"
  ]
}
```

### Citation

**Purpose:** Reference to source material in AI responses

```typescript
interface Citation {
  type: 'project' | 'experience' | 'education' | 'skill' | 'bio' | 'faq' | 'story' | 'philosophy' | 'interests' | 'workstyle' | 'resume';
  id: string;
  title: string;
  url?: string;
}
```

**Example:**
```typescript
{
  type: 'project',
  id: 'project-1',
  title: 'AI-Powered Resume Builder',
  url: undefined  // Internal reference, no external URL
}
```

## Data Organization

### Current Portfolio Data

**Projects:** 7 total
- 3 featured (AI Resume Builder, EchoLens, GlobaLens)
- Categories: AI/ML (4), Full-Stack (1), Data Engineering (2)
- Years: 2025 (all recent)

**Experience:** 2 roles
- QuinStreet (current, part-time)
- DeepTek (past, internship)

**Education:** 2 programs
- USC (current, MS in CS)
- MIT-WPU (completed, BS in CS)

**Personal Info:**
- 4 skill categories
- 13 FAQs
- Extended career story, technical philosophy, interests, work style

## Data Access Patterns

### Importing Data

```typescript
import { personalInfo, projects, experiences, education } from '@/data/portfolio';
```

### Filtering Projects

```typescript
// By category
const aiProjects = projects.filter(p => p.category === 'AI/ML');

// By year
const recentProjects = projects.filter(p => p.year === 2025);

// By featured
const featuredProjects = projects.filter(p => p.featured);

// By tags
const aiTagged = projects.filter(p => p.tags.includes('AI'));
```

### Sorting Projects

```typescript
// By year (most recent first)
const byYear = [...projects].sort((a, b) => b.year - a.year);

// By name (alphabetical)
const byName = [...projects].sort((a, b) => a.title.localeCompare(b.title));

// By impact (number of metrics)
const byImpact = [...projects].sort((a, b) => b.metrics.length - a.metrics.length);

// By sort order (manual)
const bySortOrder = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);
```

### Finding Items

```typescript
// By ID
const project = projects.find(p => p.id === 'project-1');
const experience = experiences.find(e => e.id === 'exp-1');
const edu = education.find(e => e.id === 'edu-1');

// By slug
const project = projects.find(p => p.slug === 'ai-resume-builder');

// Current experience
const currentRole = experiences.find(e => e.current);
```

## Content Guidelines

### Writing Effective Summaries

**Good:**
- "Built an AI-powered platform that reduced response time by 60% and improved customer satisfaction by 35%"
- Lead with impact and metrics
- 2-3 lines maximum
- Active voice

**Bad:**
- "This project was about building a platform for customers to get support"
- Too vague, no metrics
- Passive voice

### Problem-Approach-Impact Structure

**Problem:**
- What user pain point does this solve?
- 1-2 sentences
- Focus on the "why"

**Approach:**
- How did you solve it technically?
- 2-3 sentences
- Mention key technologies and decisions

**Impact:**
- What was the measurable result?
- 1-2 sentences
- Include metrics and business value

### Metrics Best Practices

**Good Metrics:**
- "80% reduction in manual edits"
- "30% faster load times"
- "$50k/month cost savings"
- "10,000+ active users"

**Bad Metrics:**
- "Much faster"
- "Lots of users"
- "Very efficient"

### Technology Lists

**Guidelines:**
- List 5-10 key technologies
- Order by importance/prominence
- Use official names (React, not react)
- Include versions if relevant (PostgreSQL 17.4)

### Tags

**Guidelines:**
- 5-10 tags per project
- Mix of technical and domain tags
- Use consistent naming (AI/ML, not AI or ML)
- Include searchable keywords

## Data Validation

### Required Fields

**Project:**
- id, title, slug, year, category
- summary, problem, approach, impact
- At least 2 metrics
- At least 3 technologies
- featured, sortOrder

**Experience:**
- id, company, role, type, location
- startDate, current
- summary
- At least 2 highlights
- At least 3 technologies

**Education:**
- id, institution, degree, field, location
- startYear, endYear
- At least 3 relevant coursework items

### Data Integrity Checks

```typescript
// Unique IDs
const projectIds = projects.map(p => p.id);
const uniqueIds = new Set(projectIds);
console.assert(projectIds.length === uniqueIds.size, 'Duplicate project IDs');

// Valid years
projects.forEach(p => {
  console.assert(p.year >= 2020 && p.year <= 2025, `Invalid year: ${p.year}`);
});

// Valid categories
const validCategories = ['AI/ML', 'Full-Stack', 'Data Engineering', 'Mobile', 'DevOps', 'Open Source'];
projects.forEach(p => {
  console.assert(validCategories.includes(p.category), `Invalid category: ${p.category}`);
});

// Non-empty arrays
projects.forEach(p => {
  console.assert(p.metrics.length > 0, `No metrics for ${p.title}`);
  console.assert(p.technologies.length > 0, `No technologies for ${p.title}`);
});
```

## Extending the Data Model

### Adding a New Project

1. **Create project object:**
```typescript
const newProject: Project = {
  id: "project-8",  // Increment ID
  title: "New Project",
  slug: "new-project",
  year: 2025,
  duration: "2 months",
  category: "AI/ML",
  summary: "...",
  problem: "...",
  approach: "...",
  impact: "...",
  metrics: [...],
  myRole: "...",
  teamSize: 1,
  technologies: [...],
  tags: [...],
  links: {},
  featured: false,
  sortOrder: 8,
};
```

2. **Add to projects array:**
```typescript
export const projects: Project[] = [
  // ... existing projects
  newProject,
];
```

3. **Reindex embeddings** (if vector store is active)

### Adding a New Field

1. **Update type definition:**
```typescript
interface Project {
  // ... existing fields
  newField: string;  // Add new field
}
```

2. **Update existing data:**
```typescript
export const projects: Project[] = [
  {
    // ... existing fields
    newField: "value",  // Add to all projects
  },
  // ...
];
```

3. **Update components** that display projects

### Adding a New Content Type

1. **Define type:**
```typescript
interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string[];
  abstract: string;
  link?: string;
}
```

2. **Create data array:**
```typescript
export const publications: Publication[] = [
  // ... publications
];
```

3. **Add to chunking/embedding** (if using RAG)

4. **Create UI components** (PublicationCard, PublicationSection)

5. **Add to sidebar navigation**

## Best Practices

1. **Keep summaries concise** (2-3 lines max)
2. **Always include metrics** (quantify impact)
3. **Use consistent formatting** (dates, names, etc.)
4. **Provide external links** when available
5. **Write for AI consumption** (clear, structured, keyword-rich)
6. **Update regularly** (add new projects, update current role)
7. **Validate data** before committing
8. **Use TypeScript** for type safety
9. **Document decisions** in comments
10. **Test with AI** to ensure good responses
