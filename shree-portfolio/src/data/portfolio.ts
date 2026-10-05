import type { PersonalInfo, Experience, Education } from './types';

export const personalInfo: PersonalInfo = {
  name: "Shree Bohara",
  title: "Software Engineer",
  tagline: "I build full-stack products and tools for evaluating AI systems",
  bio: `I'm a Software Engineer at QuinStreet in San Francisco, working on Pond, a consumer insurance platform. I joined as an intern in June 2025 and became a full-time engineer in June 2026. My work spans React interfaces, Spring Boot services, streaming AI features and observability.

Outside work, I build codebase retrieval, voice interfaces and agent-evaluation tools. FaultLab is a team-built, AI-assisted project that separates saved evidence from fresh tests. My algorithmic options trading system is an engineering project with live execution disabled.

I completed my M.S. in Computer Science at USC in May 2026. I like software that makes uncertainty visible and gives people a clear way to check what happened.`,
  location: "San Francisco, CA",
  availability: {
    status: 'Busy',
    message: "Working at QuinStreet. Happy to discuss software, AI systems and engineering projects."
  },
  links: {
    email: "shreetbohara@gmail.com",
    github: "https://github.com/ShreeBohara",
    linkedin: "https://www.linkedin.com/in/shree-bohara/",
    calendar: "https://calendly.com/shreetbohara/connect-with-shree",
    resume: {
      pdf: "/Shree_Bohara_Resume.pdf",
      html: "/resume.html"
    }
  },
  skills: [
    {
      category: "Languages",
      items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL", "Bash", "HTML/CSS"]
    },
    {
      category: "AI & LLM",
      items: ["OpenAI API", "Anthropic Claude API", "RAG", "Vector Search", "Tool Calling", "Structured Outputs", "Agent Evaluation", "Fault Injection"]
    },
    {
      category: "Backend",
      items: ["Spring Boot", "Spring WebFlux", "FastAPI", "Node.js", "Express", "REST", "SSE", "WebSockets"]
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Zustand", "React Flow", "Three.js", "WebRTC"]
    },
    {
      category: "Data",
      items: ["PostgreSQL", "MySQL", "Redis", "Elasticsearch", "ChromaDB", "SQLite", "DuckDB"]
    },
    {
      category: "Cloud & Observability",
      items: ["AWS", "GCP", "Docker", "Ansible", "CI/CD", "Vercel", "Structured Logging", "Distributed Tracing"]
    },
    {
      category: "Testing",
      items: ["PyTest", "JUnit", "Vitest", "Playwright", "Mutation Testing"]
    }
  ],
  careerStory: {
    background: "I'm a Software Engineer at QuinStreet in San Francisco, and I completed my M.S. in Computer Science at USC in May 2026. Before QuinStreet, I interned at DeepTek Medical Imaging on healthcare interoperability.",
    inspiration: "I enjoy turning a complicated workflow into software people can use and inspect. My projects explore that through code search, voice interfaces and tools for checking agent behavior.",
    keyMoments: [
      "At DeepTek, I built health-record exchange APIs and React interfaces using the FHIR standard.",
      "At QuinStreet, I helped build Pond during a twelve-month internship, then continued as a full-time Software Engineer in June 2026.",
      "I co-developed FaultLab as a two-person, AI-assisted project, with separate workflows for reviewing historical evidence and running fresh evaluations."
    ],
    whyUSC: "I completed USC's M.S. in Computer Science in May 2026. My coursework included databases, distributed systems, machine learning and algorithms.",
    whatDrivesYou: "Building useful software and making its behavior understandable. I care about clear interfaces, observable failures and evidence that can be checked."
  },
  technicalPhilosophy: {
    approach: "Start with the user workflow and the system's contracts. Build a small end-to-end slice, test the important failure paths, and record the decisions and limits alongside the implementation.",
    whatExcitesYou: "Choosing which parts of a system should be deterministic. In CodebaseQA, I replaced an LLM-generated dependency graph with an import resolver; in agent evaluation, fixed-code checks keep model confidence separate from evidence.",
    favoriteTools: [
      { name: "React and TypeScript", reason: "For interactive product interfaces with explicit state and data contracts." },
      { name: "Spring Boot and FastAPI", reason: "For service APIs, streaming features and evaluation workflows." },
      { name: "PostgreSQL and SQLite", reason: "For transactional state and records that can be inspected and replayed." },
      { name: "Claude Code and Codex", reason: "For AI-assisted implementation, with reviewable tasks and checks rather than treating generated code as proof of correctness." }
    ],
    goodProject: "A useful workflow, a clear explanation of what I contributed, and evidence that matches the claim. Tests, readable state and documented limitations are part of the result.",
    aiThoughts: "I use AI coding tools in my personal projects and describe team and AI assistance honestly. Generated output still needs review and appropriate checks. A citation or a passing test establishes only what that particular check covers."
  },
  faqs: [
    {
      question: "Tell me about yourself",
      answer: "I'm a Software Engineer at QuinStreet in San Francisco. I joined as an intern in June 2025 and became full-time in June 2026, working across Pond's React interfaces, Spring Boot services and AI features. I completed my M.S. in Computer Science at USC in May 2026. Outside work, my projects include codebase retrieval, voice interfaces and team-built agent evaluation.",
      category: "personal"
    },
    {
      question: "What do you work on at QuinStreet?",
      answer: "I work on Pond's full-stack product features and reliability. During my internship I helped build onboarding, quoting and a streaming AI advisor. My later work includes consent-state workflows, data migration and an incident-analysis pipeline that runs in dev and stage while observing production errors.",
      category: "career"
    },
    {
      question: "What kind of problems interest you?",
      answer: "Useful AI interfaces and the systems that let people evaluate them: source-grounded retrieval, visible uncertainty, transactional tool effects and reproducible agent tests. I also enjoy database and inference internals in C++.",
      category: "technical"
    },
    {
      question: "What's your preferred tech stack?",
      answer: "React and TypeScript for interfaces; Java with Spring Boot or Python with FastAPI for services; PostgreSQL or SQLite for state. My AI projects use retrieval, typed tool calls and explicit evaluation checks.",
      category: "technical"
    },
    {
      question: "How do you use AI coding tools?",
      answer: "I use them for implementation and review, with clear task boundaries and checks. FaultLab was built with a teammate and AI assistance. I distinguish my design and verification work from team contributions, and keep historical experiments separate from current behavior.",
      category: "technical"
    },
    {
      question: "Does your trading project trade live?",
      answer: "The Algorithmic Options Trading System is an engineering project, not an employment role. Live execution was disabled in its recorded sessions. Its public write-up discusses order-state safety and recovery; those records do not establish real-money readiness or the effectiveness of every gate.",
      category: "technical"
    },
    {
      question: "Have you built projects at hackathons?",
      answer: "I led a team to third place out of more than 90 teams at HackMIT-WPU in Pune. CORDON placed first out of 37 teams at AGI House's Agent Identity Build Day. FaultLab began as a two-person CoreWeave Hacks project and continued with AI-assisted implementation.",
      category: "personal"
    },
    {
      question: "How can I get in touch?",
      answer: "Email me at shreetbohara@gmail.com or use the calendar link. I'm happy to talk about software, AI systems and engineering projects.",
      category: "personal"
    }
  ],
  workStyle: {
    preferences: "I like owning a complete slice while agreeing on interfaces with the people around it. Small changes, direct feedback and written decisions make collaboration easier.",
    values: [
      "Clear ownership and useful outcomes",
      "Kindness and direct feedback",
      "Tests and observable failure paths",
      "Evidence with its scope and limitations"
    ],
    handlingChallenges: "Start with a reproduction and inspect the actual inputs, outputs and logs. Compare alternative explanations before changing code, then verify the fix and record what remains uncertain."
  }
};

export { projects } from './projects';

export const experiences: Experience[] = [
  {
    id: "exp-quinstreet-ft",
    company: "QuinStreet",
    logo: "/QS_LOGO.png",
    role: "Software Engineer",
    type: "Full-time",
    location: "San Francisco, CA",
    startDate: "2026-06",
    endDate: null,
    current: true,
    summary: "Full-stack product and reliability work on Pond, following a twelve-month internship.",
    highlights: [
      {
        text: "Built an incident-analysis pipeline that groups production errors and grounds model analysis in source files. It runs in dev and stage while observing production data."
      },
      {
        text: "Designed and shipped a consent-state workflow with idempotent capture, transactional audit records and post-commit notification handling."
      },
      {
        text: "Built a notification-preference migration with dual-write support and value-by-value verification of dev and stage backfill batches."
      },
      {
        text: "Shipped sign-in and sign-up routing for a marketing launch, checking the changed and unchanged paths across environments."
      }
    ],
    technologies: ["Java", "Spring Boot", "Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    companyInfo: {
      website: "https://quinstreet.com",
      industry: "Digital Marketing"
    },
    links: {
      company: "https://quinstreet.com",
      project: "https://www.insurance.com/pond"
    }
  },
  {
    id: "exp-quinstreet-intern",
    company: "QuinStreet",
    logo: "/QS_LOGO.png",
    role: "Software Engineer Intern",
    type: "Internship",
    location: "San Francisco, CA",
    startDate: "2025-06",
    endDate: "2026-06",
    current: false,
    summary: "Helped build and launch Pond, contributing across its backend services and consumer interfaces.",
    highlights: [
      {
        text: "Co-architected the platform and built multi-step onboarding with address autocomplete, dependent vehicle selection and policy-document import."
      },
      {
        text: "Built the rating engine in Java and Spring Boot to connect the product's insurance workflow to rate APIs."
      },
      {
        text: "Built the conversational advisor's Spring WebFlux streaming backend and React interface, including progressive rendering and in-chat coverage changes."
      },
      {
        text: "Improved frontend loading with code splitting and lazy routes, addressed mobile viewport behavior, and connected frontend and backend error reporting."
      }
    ],
    technologies: ["React", "TypeScript", "Java", "Spring Boot", "Spring WebFlux", "SSE", "PostgreSQL", "AWS", "Docker"],
    companyInfo: {
      website: "https://quinstreet.com",
      industry: "Digital Marketing"
    },
    links: {
      company: "https://quinstreet.com",
      project: "https://www.insurance.com/pond"
    }
  },
  {
    id: "exp-2",
    company: "DeepTek Medical Imaging",
    logo: "/deeptek_logo.png",
    role: "Software Engineer Intern",
    type: "Internship",
    location: "Mumbai, India",
    startDate: "2023-06",
    endDate: "2024-01",
    current: false,
    summary: "Built healthcare interoperability and provider interfaces using the FHIR health-record standard under India's ABDM programme.",
    highlights: [
      {
        text: "Built health-record exchange APIs and interfaces in Node.js, React and MySQL, standardizing records around FHIR resources."
      },
      {
        text: "Improved service responsiveness with query optimization and Redis caching, and added structured logging and distributed tracing."
      },
      {
        text: "Built clinical-document classification and record matching using classical NLP, edit distance and phonetic encoding."
      },
      {
        text: "Built a React provider dashboard with lazy-loaded record views and reusable forms driven by JSON Schema."
      }
    ],
    technologies: ["Node.js", "React", "Python", "MySQL", "PostgreSQL", "FHIR", "Redis", "AWS"],
    companyInfo: {
      website: "https://deeptek.ai",
      industry: "Healthcare Technology"
    }
  }
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "University of Southern California",
    logo: "/usc_logo.png",
    degree: "Master of Science",
    field: "Computer Science",
    location: "Los Angeles, CA",
    startYear: 2024,
    endYear: 2026,
    relevantCoursework: [
      "Database Systems",
      "Distributed Systems",
      "Machine Learning",
      "Algorithms",
      "Operating Systems"
    ],
    achievements: ["Completed the M.S. in Computer Science in May 2026."]
  }
];
