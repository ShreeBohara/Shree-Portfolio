import { PersonalInfo, Project, Experience, Education } from './types';

export const personalInfo: PersonalInfo = {
  name: "Shree Bohara",
  title: "Software Engineer",
  tagline: "Building AI-powered solutions that scale",
  bio: `I'm a Computer Science graduate student at USC with a passion for building impactful software. I specialize in full-stack development, AI integration, and creating seamless user experiences.

My journey includes internships at QuinStreet and DeepTek, where I've shipped production features, built AI chat experiences, and developed healthcare interoperability solutions. I love working on challenging problems that combine modern web technologies with AI/ML capabilities.

I'm particularly interested in opportunities that involve AI, full-stack development, and building products that make a real difference.`,
  location: "Los Angeles, CA",
  availability: {
    status: 'Open to opportunities',
    message: "USC CS Graduate Student, seeking full-time opportunities starting May 2026"
  },
  links: {
    email: "bohara@usc.edu",
    github: "https://github.com/ShreeBohara",
    linkedin: "https://www.linkedin.com/in/shree-bohara/",
    twitter: "https://twitter.com/shree",
    calendar: "https://calendly.com/shreetbohara/connect-with-shree",
    resume: {
      pdf: "https://docs.google.com/document/d/12F3Sf9cv0hqj7q-W7gxaxhN4rhhzwJE8BUxhJyXu8GU/edit?tab=t.0",
      docx: "https://docs.google.com/document/d/12F3Sf9cv0hqj7q-W7gxaxhN4rhhzwJE8BUxhJyXu8GU/export?format=docx"
    }
  },
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "Java", "TypeScript", "C++", "Python"]
    },
    {
      category: "Full Stack",
      items: ["React", "Next.js", "Vue", "Node.js", "REST APIs", "MySQL", "Spring Boot", "PostgreSQL", "GraphQL"]
    },
    {
      category: "Tools & Methods",
      items: ["Git", "GitHub", "VS Code", "GCP", "Agile/Scrum", "OOP", "Jira", "MVC", "Postman", "Vercel", "Cursor"]
    },
    {
      category: "AI/ML",
      items: ["OpenAI API", "Vertex AI", "Groq API", "Llama Vision", "Vector Search", "BigQuery"]
    }
  ]
};

export const projects: Project[] = [
  {
    id: "project-1",
    title: "GlobePulse - AI-Powered Global News Visualization Platform",
    slug: "globepulse",
    year: 2025,
    duration: "2 months",
    category: "AI/ML",
    summary: "Developed an AI-powered global news map leveraging React, MongoDB Atlas, and Google Maps API, facilitating real-time event filtering by sentiment, time, and category.",
    problem: "Users struggle to discover and understand global events in real-time across different sources and regions.",
    approach: "Processed 15K+ daily GDELT records via BigQuery, enriched with Vertex AI for summarization and vector embeddings, utilizing Atlas Vector Search for semantic clustering.",
    impact: "Improved event discoverability by 40% through intelligent clustering and semantic search capabilities.",
    metrics: [
      { label: "Daily Records", value: "15K+ processed" },
      { label: "Discoverability", value: "+40%" },
      { label: "AI Processing", value: "Vertex AI" },
      { label: "Search", value: "Vector-based" }
    ],
    myRole: "Full-stack developer and AI integration lead for the entire project.",
    teamSize: 1,
    technologies: ["React", "MongoDB Atlas", "Google Maps API", "BigQuery", "Vertex AI", "Vector Search"],
    tags: ["AI", "Data Visualization", "Real-time", "News Analytics", "Vector Embeddings"],
    links: {
      github: "https://github.com/ShreeBohara/globepulse"
    },
    featured: true,
    sortOrder: 1
  },
  {
    id: "project-2",
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
    sortOrder: 2
  },
  {
    id: "project-3",
    title: "EchoLens: Brought Images to Life for the Visually Impaired",
    slug: "echolens",
    year: 2025,
    duration: "2 months",
    category: "Full-Stack",
    summary: "Developed a Chrome extension delivering real-time audio descriptions of images for visually impaired users across any website.",
    problem: "Visually impaired users lack access to image content on websites, limiting their web browsing experience.",
    approach: "Built a Chrome extension with JavaScript frontend and Flask backend using Groq's Llama 3.2 Vision model for image analysis, Google TTS for audio, and Microsoft SQL for user preferences.",
    impact: "Enabled accessible web browsing for visually impaired users by providing instant audio descriptions of any image on the web.",
    metrics: [
      { label: "Platform", value: "Chrome Extension" },
      { label: "AI Model", value: "Llama 3.2 Vision" },
      { label: "Audio", value: "Google TTS" },
      { label: "Storage", value: "Microsoft SQL" }
    ],
    myRole: "Initiated and developed the entire solution, from Chrome extension to backend API and database integration.",
    teamSize: 1,
    technologies: ["JavaScript", "Flask", "Python", "Groq API", "Llama 3.2 Vision", "Google TTS", "Microsoft SQL", "REST API"],
    tags: ["Accessibility", "AI Vision", "Chrome Extension", "Social Impact"],
    links: {
      github: "https://github.com/ShreeBohara/echolens"
    },
    featured: true,
    sortOrder: 3
  },
];

export const experiences: Experience[] = [
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
        text: "Shipped Pond (Live) from Figma to production in under 3 months; componentized UI and added reviewable flows",
        metric: "Reduced integration rework and sped up releases"
      },
      {
        text: "Redesigned 23-step React onboarding flow with summaries and inline edits",
        metric: "30% reduction in time-to-complete"
      },
      {
        text: "Launched 'Ollie', an AI chat with FAQ, co-pilot, and next-step modes using Voiceflow, Java proxy, and React UI",
        metric: "Improved self-serve completion and reduced support handoffs"
      },
      {
        text: "Owned 3-way onboarding A/B framework with secure assignment, campaign overrides, session flags, route guards, and Heap tracking",
        metric: "Enabled clean conversion and time-to-quote comparisons"
      },
      {
        text: "Maintained Spring Boot services and SQL pipelines with analytics and error logging",
        metric: "Hardened quote submissions and audit trails"
      }
    ],
    technologies: ["React", "TypeScript", "Spring Boot", "Java", "SQL", "Voiceflow", "Figma", "Heap Analytics"],
    companyInfo: {
      website: "https://quinstreet.com",
      industry: "InsurTech/Digital Marketing",
      size: "Public company"
    }
  },
  {
    id: "exp-2",
    company: "DeepTek Medical Imaging Pvt Ltd",
    role: "Software Engineer - Intern",
    type: "Internship",
    location: "Pune, India",
    startDate: "2023-07",
    endDate: "2024-01",
    current: false,
    summary: "Built healthcare interoperability solutions under India's ABDM framework, enabling secure health data exchange across hospitals.",
    highlights: [
      {
        text: "Built Digital Health Identifier service using Spring Boot, React, and MySQL under ABDM using FHIR standards",
        metric: "Shipped with 5-person team"
      },
      {
        text: "Designed microservices and cloud-deployed FHIR APIs",
        metric: "Adopted by 500+ hospitals with 100K users/month"
      },
      {
        text: "Implemented JWT authentication and comprehensive audit logging",
        metric: "Ensured secure, interoperable health record exchange"
      }
    ],
    technologies: ["Spring Boot", "React", "MySQL", "FHIR", "JWT", "Cloud Deployment", "Microservices"],
    companyInfo: {
      website: "https://deeptek.ai",
      industry: "HealthTech/Medical Imaging",
      size: "Growing startup"
    }
  }
];

export const education: Education[] = [
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
      "Published in YMER (June 2024): Showcased LSTM's superiority in sound classification on UrbanSound8K",
      "Runner-Up among 30 teams at NIT-B Hackathon for developing health-tech app to streamline hospital referrals"
    ]
  },
  {
    id: "edu-2",
    institution: "Dr. Vishwanath Karad MIT World Peace University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    location: "Pune, India",
    startYear: 2020,
    endYear: 2024,
    relevantCoursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Cloud Computing",
      "Distributed Systems"
    ]
  }
];
