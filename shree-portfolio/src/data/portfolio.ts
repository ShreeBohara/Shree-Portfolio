import { PersonalInfo, Project, Experience, Education } from './types';

export const personalInfo: PersonalInfo = {
  name: "Shree Bohara",
  title: "Software Engineer",
  tagline: "I build production AI systems, and the infrastructure for not trusting them",
  bio: `I'm a Software Engineer at QuinStreet in San Francisco, working on Pond (insurance.com/pond). I joined as an intern in June 2025, helped take Pond from an empty repository to production in under two months, and converted to full-time in June 2026.

Most of my work is applied AI in production — a conversational insurance advisor built end to end, an incident pipeline that reads live production error streams and explains them — plus the layer underneath that refuses to trust a model: containment for AI agent swarms, an auditor for reported benchmark gains, and fail-closed gates in a trading system that has deliberately never placed an order.

When it helps, I go a level deeper than most application engineers: an LLM inference engine written from scratch in C++17, and a cache-blocked Bloom filter inside DuckDB's hash join.`,
  location: "San Francisco, CA",
  availability: {
    status: 'Open to opportunities',
    message: "Software Engineer at QuinStreet, working on Pond. Not on the market, but always open to a conversation about AI infrastructure, agent systems, or production reliability."
  },
  links: {
    email: "shreetbohara@gmail.com",
    github: "https://github.com/ShreeBohara",
    linkedin: "https://www.linkedin.com/in/shree-bohara/",
    calendar: "https://calendly.com/shreetbohara/connect-with-shree",
    resume: {
      pdf: "/Shree_Bohara_Resume.pdf"
    }
  },
  skills: [
    {
      category: "Languages",
      items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL", "Bash", "HTML/CSS"]
    },
    {
      category: "AI & LLM",
      items: ["Anthropic Claude API", "OpenAI API", "RAG", "Vector Search", "Tool Calling", "Structured Outputs", "Prompt Engineering", "LLM Evaluation", "Tree-sitter", "Sentence-Transformers", "scikit-learn"]
    },
    {
      category: "Backend",
      items: ["Spring Boot", "Spring WebFlux", "FastAPI", "Flask", "Node.js", "Express", "REST", "SSE", "WebSockets", "WebRTC"]
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "Vue 3", "Tailwind CSS", "Zustand", "React Flow", "Three.js", "react-three-fiber"]
    },
    {
      category: "Data",
      items: ["PostgreSQL", "MySQL", "MariaDB", "MongoDB", "Redis", "Elasticsearch", "ChromaDB", "SQLite", "DuckDB", "BigQuery"]
    },
    {
      category: "Cloud, DevOps & Observability",
      items: ["AWS", "GCP", "Docker", "Ansible", "CI/CD", "Vercel", "Render", "ELK Stack", "Kibana", "Structured Logging", "Distributed Tracing"]
    },
    {
      category: "Testing",
      items: ["PyTest", "JUnit", "Vitest", "Playwright", "Mutation Testing"]
    }
  ],

  // Extended personal content for richer AI chat responses
  careerStory: {
    background: "I'm originally from Pune, India, where I finished my bachelor's in computer science before coming to USC for my M.S. in Computer Science, which I completed in May 2026.",
    inspiration: "It started with curiosity. When I was seven or eight my dad brought home a laptop for the first time, and I was amazed that one device could do so many things. I remember creating my first email account and sending a message to my brother in another city — one click, and he had it. That opened my eyes to how powerful software is, and I kept pulling on that thread until it turned into a computer science degree.",
    keyMoments: [
      "Early on I built a state-management system in vanilla JavaScript on purpose, avoiding frameworks so I would have to handle the edge cases and DOM work myself. Understanding the primitives before reaching for abstractions is still how I approach a new system.",
      "At HackMIT24 I led a team to 3rd place out of more than 90 teams, building a modular IoT gateway on Web of Things. Later, at AGI House, CORDON took 1st place out of 37 teams and Delta Sentinel placed 3rd at a separate build session.",
      "At QuinStreet we started Pond from an empty repository and had it in production in under two months. I co-architected it, built the onboarding flow that most accounts are created through, and later built the rating engine that turned it into a product you can actually get quoted on."
    ],
    whyUSC: "I chose USC for its computer science program and its alumni network, and both paid off: coursework in databases and information retrieval fed directly into work I shipped, and the network turned into real conversations with engineers.",
    whatDrivesYou: "I like building software that removes a real barrier for someone, and I like being able to prove it worked. That shows up in accessibility work like EchoLens, in production reliability work at QuinStreet, and in the way I use AI: aggressively, but trusting it nowhere — every generated answer gets a check that a machine, not a person's optimism, has to pass."
  },

  technicalPhilosophy: {
    approach: "I start with the user problem and a clear definition of done. Then I sketch the architecture — components, sequence, data model — so the boundaries and contracts are settled before code. I build in small end-to-end slices, put the critical paths behind tests, add observability, ship behind a flag with a rollback path, and write down the decisions and their trade-offs as I go.",
    whatExcitesYou: "System design, and specifically the moment a messy requirement turns into a clean set of boundaries. My favourite version of that is choosing what not to make probabilistic: in CodebaseQA the first dependency graph was generated by an LLM, and replacing it with a deterministic import resolver made it faster, reproducible, and free of invented edges.",
    favoriteTools: [
      { name: "Claude Code", reason: "My main implementation partner. I freeze the interface, decompose the work into independently verifiable units, and let an executable definition of 'not broken' decide when a phase is done." },
      { name: "Codex", reason: "The other agent I direct, usually on separate lanes with disjoint file ownership so the work stays reviewable." },
      { name: "React and Next.js", reason: "What I reach for when a product needs to be fast, accessible and shipped." },
      { name: "Spring Boot", reason: "Sturdy production APIs with clear structure; most of my backend work at QuinStreet lives here." },
      { name: "PostgreSQL", reason: "Reliable, and it usually solves the problem people reach for a broker or a cache to solve." }
    ],
    goodProject: "Impact first: a real problem, and a result you can show. After that I look for clarity (a small design and small milestones), reliability and accessibility, maintainability (tests, logs, docs, easy handoff), and a short feedback loop.",
    aiThoughts: "Use AI aggressively, trust it nowhere. I use coding agents for most of the implementation on my own projects and disclose it on every page; what I keep is the thesis, the interface contracts, the decomposition, and the tests that decide whether the result is correct. In products, the same rule applies: ground answers in real data, cite them, and let the system say 'I don't know' rather than guess."
  },

  interests: {
    hobbies: [
      "Chess (strategic thinking and problem-solving)",
      "Badminton (played for my school and coached students back in India)",
      "Reading (currently working through Atomic Habits)",
      "Hackathons (fast, collaborative, and a good forcing function)",
      "Photography, mostly sunsets"
    ],
    books: ["Atomic Habits by James Clear — I like its focus on identity-based habits: build systems and small daily actions ('I'm a runner,' not 'I'll run a marathon'). It's practical and easy to apply."],
    podcasts: ["Lex Fridman Podcast — long-form conversations where experts think out loud without interruption; you get raw exploration instead of polished soundbites."],
    youtube: ["Fireship — short, funny rundowns of new tools; good for staying current fast and deciding what is worth trying."],
    freeTime: "Short walks with calm music to reset. It clears my head and I come back sharper."
  },

  faqs: [
    {
      question: "Tell me about yourself",
      answer: "I'm a Software Engineer at QuinStreet in San Francisco, working on Pond, an AI-native consumer insurance platform. I joined as an intern in June 2025, helped take the product from an empty repository to production in under two months, and converted to full-time in June 2026. Outside work I build AI-trust infrastructure — CORDON contains prompt-injection outbreaks across agent swarms, Delta Sentinel audits whether a reported benchmark gain is real — and I have an M.S. in Computer Science from USC.",
      category: "personal"
    },
    {
      question: "What kind of problems do you want to solve?",
      answer: "Production AI systems and the infrastructure that keeps them honest: grounding and citations, containment when an agent is compromised, evaluation you can trust, and observability that tells you what actually broke.",
      category: "technical"
    },
    {
      question: "What's your ideal team culture?",
      answer: "Kind, curious and direct. Ship fast with guardrails — tests, metrics, rollbacks. Low ego, high ownership, clear goals, and room to think about the design before writing code.",
      category: "career"
    },
    {
      question: "What's your preferred tech stack?",
      answer: "TypeScript and React or Next.js on the front end; Java with Spring Boot, or Python with FastAPI, on the back end; PostgreSQL or MySQL; REST and SSE; AWS or GCP; Docker and CI/CD. For AI work: the Anthropic and OpenAI APIs, retrieval-augmented generation over pgvector or Chroma, and evaluations I can run in CI.",
      category: "technical"
    },
    {
      question: "How do you learn new tech?",
      answer: "I start with why it exists and what it replaced, then build something small with it, then read the parts of the source I depended on. Recently that has also meant contributing fixes upstream — small merged patches to projects like Nitro, Drizzle ORM, h3, VueUse and Pinia.",
      category: "technical"
    },
    {
      question: "What are you passionate about in tech?",
      answer: "Building accessible, reliable products, and using AI in a way that adds evidence rather than confidence: cite the source, show the disagreement, fail closed when it matters.",
      category: "personal"
    },
    {
      question: "What advice would you give someone starting in CS?",
      answer: "Start small and ship often. Learn the fundamentals well — data structures, HTTP, SQL, how the web actually works. Design before you code, even if it is a sketch. Use AI to move faster, but verify everything, and keep a habit of writing down what you decided and why.",
      category: "personal"
    }
  ],

  workStyle: {
    preferences: "I like fast-paced teams that still make time for design up front. I'm comfortable owning an end-to-end slice, and I collaborate on interfaces, reviews and experiments. My loop: agree on the problem, sketch the contracts, build small vertical slices behind flags, ship, measure, iterate.",
    values: [
      "Ownership and impact: solve real user problems and show the result",
      "Kindness with candor: low-ego teamwork and direct feedback",
      "Speed with guardrails: tests, metrics, rollbacks and accessibility are not optional",
      "Evidence over confidence: a claim should come with a way to check it"
    ],
    handlingChallenges: "Get the facts first — logs, metrics, a reproduction — and contain before fixing. Then take the smallest safe fix, communicate what is happening, and follow it with a write-up and a guardrail so it cannot recur silently. The habit I care most about is proving what is not the cause: a good control measurement rules out half the system in one move."
  },

  funFacts: [
    "My first ever flight was a 22-hour journey from India to the USA. Long, a little scary, and the start of a whole new chapter.",
    "I can cook well when I'm in the mood. On other days, Maggi keeps me alive.",
    "I take far too many photos of sunsets. They all look similar and I keep taking them."
  ],

  chessOpening: {
    name: "King's Gambit",
    why: "It turns the game into chaos in about five moves, and suddenly both players are pretending they know what's going on. The positions get sharp fast, so I have to think at the board instead of following theory."
  },

  dreamDestinations: [
    {
      place: "Norway",
      reason: "Fjords, northern lights, quiet towns. I like the idea of sitting by the water with a hot drink and watching the sky change."
    },
    {
      place: "Japan",
      reason: "A mix of neon streets and quiet shrines, high-tech cities and forests, all reachable in one day."
    }
  ]
};

export const projects: Project[] = [
  {
    id: "project-portfolio",
    title: "Interactive Portfolio & AI Chat",
    slug: "interactive-portfolio",
    year: 2025,
    duration: "Ongoing",
    category: "Full-Stack",
    summary: "A modern, interactive portfolio website featuring an AI-powered chat interface, dynamic animations, and a responsive design. Built with Next.js, TypeScript, and Tailwind CSS.",
    problem: "Traditional portfolios are often static and fail to effectively showcase a developer's personality, technical depth, and ability to build modern, interactive web applications.",
    approach: "Designed and built a comprehensive portfolio platform that combines a traditional showcase with an AI-powered chat interface. Next.js for the pages, Supabase pgvector for retrieval, and a streaming chat endpoint that answers from a curated content set and cites what it used.",
    impact: "Created a unique, engaging user experience that differentiates my profile. The AI chat provides instant answers to recruiters and peers, while the high-performance architecture ensures a smooth experience across all devices.",
    metrics: [
      { label: "Stack", value: "Next.js 16, React 19" },
      { label: "Retrieval", value: "Supabase pgvector" },
      { label: "Answers", value: "Streamed with citations" }
    ],
    myRole: "Sole Developer & Designer - Conceptualized, designed, and built the entire application from scratch, including the AI chat integration and custom UI components.",
    teamSize: 1,
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Supabase pgvector", "OpenAI API", "Radix UI", "Zustand"],
    tags: ["Portfolio", "AI Chat", "Next.js", "Interactive Design", "Vercel"],
    links: {
      github: "https://github.com/ShreeBohara/Shree-Portfolio",
      live: "https://shreebohara.com"
    },
    images: {
      thumbnail: "/images/projects/portfolio-v2.webp",
    },
    featured: true,
    sortOrder: 1
  },
  {
    id: "project-codebaseqa",
    title: "CodebaseQA",
    slug: "codebaseqa",
    year: 2026,
    duration: "Jan 2026 - Present",
    category: "Open Source",
    summary: "Open-source AI platform for codebase onboarding that indexes GitHub repositories, answers natural-language questions with source-cited responses, generates persona-based learning tracks, and visualizes full-workspace dependency graphs.",
    problem: "Understanding an unfamiliar repository is still a slow, fragmented workflow. Developers bounce between READMEs, grep, docs, architecture guesses, and tribal knowledge just to answer basic questions about system flow, ownership boundaries, and where to start contributing.",
    approach: "Built CodebaseQA as a pnpm/Turbo monorepo with a Next.js 16 frontend and FastAPI backend. The platform clones and indexes repositories, parses code with Tree-sitter across 9 languages, stores embeddings in Chroma, and serves SSE-based chat with hybrid retrieval, reranking, and source citations. On top of Q&A, I shipped a persona-based learning engine with AI-generated lessons, quizzes, challenges, and a deterministic dependency graph explorer powered by React Flow with ELK primary layout and Dagre fallback. The system is productionized with Docker, GitHub Actions CI, Vercel frontend hosting, Render backend deployment, and Redis-backed caching/rate-limit fallbacks.",
    impact: "Turned codebase onboarding into an interactive product instead of a documentation hunt. CodebaseQA combines chat, search, guided learning, graph exploration, gamification, and CLI workflows so developers can move from 'What does this repo do?' to hands-on understanding much faster on large, multi-language repositories.",
    metrics: [
      { label: "First release", value: "~24,400 lines in 19 days" },
      { label: "Languages Parsed", value: "9 via Tree-sitter" },
      { label: "Interfaces", value: "Web + CLI + API" },
      { label: "Dependency graph", value: "0 LLM calls on the default path" },
      { label: "Quality Gates", value: "CI + Coverage" }
    ],
    myRole: "Sole developer and architect - designed the full monorepo, built the repository indexing and RAG pipeline, implemented the learning/gamification systems, shipped the dependency graph explorer, wired Docker and CI/CD, and deployed the frontend/backend split to production.",
    teamSize: 1,
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Python 3.11",
      "ChromaDB",
      "SQLite",
      "Redis",
      "Tree-sitter",
      "OpenAI",
      "React Flow",
      "ELK",
      "Dagre",
      "Docker",
      "GitHub Actions",
      "Vercel",
      "Render",
      "pnpm",
      "Turborepo"
    ],
    tags: [
      "Open Source",
      "AI",
      "RAG",
      "Developer Tools",
      "Codebase Understanding",
      "Dependency Graph",
      "Learning Engine",
      "SSE Streaming",
      "CLI",
      "Monorepo"
    ],
    links: {
      live: "https://www.codebaseqa.com",
      github: "https://github.com/ShreeBohara/codebaseqa",
      caseStudy: "https://medium.com/@shreetbohara/how-i-built-codebaseqa-to-cut-codebase-onboarding-time-9521bbc2642e",
      video: "https://www.youtube.com/watch?v=nM8-2t4xr9A"
    },
    images: {
      thumbnail: "/images/projects/codebaseqa.png",
    },
    featured: true,
    sortOrder: 1
  },
  {
    id: "project-2",
    title: "EchoLens: Image-to-Audio Accessibility Tool",
    slug: "echolens",
    year: 2024,
    duration: "24-hour hackathon build",
    category: "Full-Stack",
    summary: "A Chrome extension designed to make the web more accessible for visually impaired users by providing real-time, AI-generated audio descriptions of images. Powered by Llama 3.2 Vision for analysis and Google TTS for natural voice output.",
    problem: "Visually impaired users often face significant barriers when navigating the web, as many images lack proper alt text or descriptions, leaving a large portion of digital content inaccessible.",
    approach: "Developed a seamless Chrome extension that integrates a JavaScript frontend with a Flask backend. The extension sends the selected image to a Flask backend, which describes it with a vision model and returns speech audio.",
    impact: "Significantly improved web accessibility by enabling visually impaired users to 'hear' images, providing instant, detailed audio descriptions for any visual content on the web, thereby bridging the digital divide.",
    metrics: [
      { label: "Platform", value: "Chrome Extension" },
      { label: "AI Model", value: "Llama 3.2 Vision" },
      { label: "Audio", value: "Google TTS" },
      { label: "Team", value: "3 people, 24 hours" }
    ],
    myRole: "Built the Chrome extension and the Flask backend with two teammates during a 24-hour hackathon.",
    teamSize: 3,
    technologies: ["JavaScript", "Chrome Extension", "Flask", "Python", "Vision model", "Text-to-speech", "REST API"],
    tags: ["Accessibility", "AI Vision", "Chrome Extension", "Social Impact"],
    links: {
      github: "https://github.com/ShreeBohara/echolens"
    },
    images: {
      thumbnail: "/images/projects/echolens.webp",
    },
    featured: true,
    sortOrder: 2
  },
  {
    id: "project-3",
    title: "GlobaLens: See Beyond the Headlines",
    slug: "globalens",
    year: 2025,
    duration: "2 months",
    category: "AI/ML",
    summary: "AI-powered news visualization platform with interactive 3D globe. Ingests GDELT data via BigQuery, generates summaries with Vertex AI, and enables semantic search across global events in real-time.",
    problem: "Journalists, analysts, and decision-makers struggle to explore and understand global events in real-time due to information overload across multiple sources and regions.",
    approach: "Designed a complete data pipeline: Cloud Scheduler triggers Cloud Functions to ingest GDELT events via BigQuery, process them with Vertex AI for summarization and sentiment analysis, generate vector embeddings, and store in MongoDB Atlas with Vector Search. Built React frontend with react-globe.gl for interactive 3D visualization and natural language semantic search.",
    impact: "Enabled real-time exploration of global events with instant AI-generated summaries, semantic search capabilities, and visual clustering of similar events on an interactive globe.",
    metrics: [
      { label: "Data Source", value: "GDELT v2 (BigQuery)" },
      { label: "Visualization", value: "3D Interactive Globe" },
      { label: "Search", value: "Semantic Vector Search" },
      { label: "AI Processing", value: "Vertex AI + Embeddings" },
      { label: "Architecture", value: "GCP Serverless Pipeline" }
    ],
    myRole: "Full-stack developer and architect - designed the entire system architecture, implemented the data ingestion pipeline, built the Flask API, integrated vector search, and developed the React frontend with 3D globe visualization.",
    teamSize: 1,
    technologies: [
      "React 18",
      "Vite",
      "Tailwind CSS",
      "react-globe.gl",
      "Zustand",
      "Python 3.11",
      "Flask",
      "Pydantic",
      "Sentence-Transformers",
      "MongoDB Atlas",
      "Vector Search",
      "Google Cloud Platform",
      "BigQuery",
      "Cloud Functions",
      "Cloud Scheduler",
      "Cloud Storage",
      "Vertex AI",
      "Docker Compose",
      "GitHub Actions"
    ],
    tags: [
      "AI",
      "Data Visualization",
      "Real-time",
      "News Analytics",
      "Vector Embeddings",
      "Geospatial",
      "GDELT",
      "Cloud Architecture",
      "Serverless"
    ],
    links: {
      github: "https://github.com/ShreeBohara/GlobaLens"
    },
    images: {
      thumbnail: "/images/projects/globalens.webp",
    },
    featured: true,
    sortOrder: 3
  },
  {
    id: "project-4",
    title: "PostgreSQL B-Tree Index Optimizations",
    slug: "postgresql-btree-optimizations",
    year: 2025,
    duration: "2 months",
    category: "Data Engineering",
    summary: "Up to 49.6% query speedup in PostgreSQL 17.4 B-tree indexes. Implemented linear search optimization for small leaf pages and async prefetching for range scans. Improved 37% of JOB benchmark queries.",
    problem: "B-tree indexes in PostgreSQL use binary search uniformly across all leaf page sizes, creating unnecessary overhead for small pages where linear scans would be more efficient. Additionally, range scans don't prefetch subsequent pages, causing I/O stalls during sequential access patterns.",
    approach: "Implemented two core optimizations: (1) Linear search optimization that replaces binary search with linear scanning for leaf pages containing ≤4 items, reducing algorithmic overhead and improving CPU cache locality; (2) Asynchronous leaf-page prefetching that uses PostgreSQL's native PrefetchBuffer() API to overlap I/O operations with CPU processing during range scans. Both optimizations are configurable via GUC variables and backward compatible with no changes to index structures.",
    impact: "Evaluated on 113 complex analytical queries from the Join Order Benchmark (JOB), the combined optimizations improved 37.2% of queries (42/113) with an average speedup of 302.29ms. Linear search alone benefited 56.6% of queries with 80.41ms average reduction, while prefetching improved 31.0% of queries by 150.91ms on average. Best case achieved 49.6% speedup (1,066ms reduction) on query-intensive workloads.",
    metrics: [
      { label: "Queries Improved", value: "37.2% (42/113)" },
      { label: "Avg Speedup", value: "302.29ms" },
      { label: "Best Case", value: "49.6% faster" },
      { label: "Max Improvement", value: "4,572ms" },
      { label: "Benchmark", value: "JOB (113 queries)" }
    ],
    myRole: "Co-developer - researched PostgreSQL internals, designed and implemented linear search optimization in C, modified core B-tree access methods (_bt_binsrch), integrated GUC configuration variables, developed benchmarking framework with Docker, and led performance analysis across 113 analytical queries. Collaborated with Soumya who implemented the prefetch optimization and contributed to benchmark scripts and testing infrastructure.",
    teamSize: 2,
    technologies: ["C", "PostgreSQL 17.4", "Shell Scripting", "Docker", "SQL", "IMDB/JOB Benchmark"],
    tags: ["Database Systems", "Performance Optimization", "B-Tree", "Indexing", "PostgreSQL Internals", "Benchmarking", "Systems Programming"],
    links: {
      github: "https://github.com/ShreeBohara/postgresql-btree-optimizations"
    },
    images: {
      thumbnail: "/images/projects/postgresql-btree-v2.webp",
    },
    featured: false,
    sortOrder: 4
  },
  {
    id: "project-5",
    title: "KNN Classification: Vertebral Column Health Analysis",
    slug: "knn-vertebral-column-analysis",
    year: 2025,
    duration: "1 month",
    category: "Academic",
    summary: "KNN classifier comparing 5 distance metrics for vertebral condition diagnosis. Analyzed 6 biomechanical features from UCI dataset to predict normal vs. abnormal spinal conditions.",
    problem: "Medical diagnosis of vertebral conditions requires accurate classification based on biomechanical measurements. Traditional approaches need systematic evaluation of different distance metrics and KNN configurations to optimize classification performance for clinical decision support.",
    approach: "Conducted comprehensive KNN analysis using the UCI Vertebral Column dataset with 6 biomechanical features (pelvic incidence, tilt, lumbar lordosis angle, sacral slope, pelvic radius, spondylolisthesis grade). Implemented binary classification (normal=0, abnormal=1) comparing five distance metrics: Euclidean, Manhattan (Minkowski p=1), Minkowski (variable p), Chebyshev, and Mahalanobis. Evaluated performance using confusion matrices, sensitivity/specificity, precision, F1-scores, learning curves, and weighted voting analysis. Built complete analysis pipeline in Jupyter Notebook with pandas, NumPy, scikit-learn, matplotlib, and seaborn.",
    impact: "Identified optimal distance metric and k-value combinations for vertebral condition classification through systematic comparison. Provided insights into trade-offs between different distance metrics for medical classification tasks, demonstrating how metric choice affects sensitivity vs. specificity in clinical contexts.",
    metrics: [
      { label: "Distance Metrics", value: "5 compared" },
      { label: "Features", value: "6 biomechanical" },
      { label: "Classification", value: "Binary (Normal/Abnormal)" },
      { label: "Evaluation", value: "Multi-metric analysis" },
      { label: "Dataset", value: "UCI ML Repository" }
    ],
    myRole: "Sole developer - conducted exploratory data analysis, implemented KNN classifiers with multiple distance metrics, performed comparative evaluation using sensitivity/specificity/F1-scores, generated learning curves and confusion matrices, documented methodology and findings in Jupyter Notebook. Course project for DSCI 552 (Machine Learning) at USC.",
    teamSize: 1,
    technologies: ["Python 3.12", "Jupyter Notebook", "pandas", "NumPy", "scikit-learn", "matplotlib", "seaborn", "SciPy"],
    tags: ["Machine Learning", "KNN", "Classification", "Healthcare Analytics", "Distance Metrics", "UCI Dataset", "Biomechanics", "Medical Diagnosis"],
    links: {
      github: "https://github.com/ShreeBohara/KNN-Analysis-on-Vertebral-Column-Data-Set"
    },
    images: {
      thumbnail: "/images/projects/knn-vertebral-v2.webp",
    },
    featured: false,
    sortOrder: 5
  },
  {
    id: "project-6",
    title: "Power Plant Energy Output: Regression Model Comparison",
    slug: "powerplant-regression-analysis",
    year: 2025,
    duration: "1 month",
    category: "Academic",
    summary: "Regression analysis comparing 4 models (linear, multiple, polynomial, KNN) for power plant energy output prediction. Identified optimal atmospheric predictors using UCI CCPP dataset.",
    problem: "Power plant operators need accurate energy output predictions based on atmospheric conditions to optimize operational efficiency and grid management. Requires systematic evaluation of different regression modeling approaches to determine which best captures the complex relationships between environmental factors and electrical generation.",
    approach: "Analyzed the UCI Combined Cycle Power Plant (CCPP) dataset using comprehensive regression methodology. Started with exploratory data analysis including descriptive statistics (means, medians, quartiles, ranges), pairwise scatter plots, and correlation analyses. Implemented and compared four modeling approaches: (1) Simple linear regression with individual predictors, (2) Multiple linear regression with all predictors simultaneously, (3) Polynomial regression with interaction terms, and (4) K-nearest neighbors regression with feature normalization and optimized k-parameter selection. Evaluated statistical significance, identified outliers, and performed comparative performance analysis to determine optimal prediction strategy.",
    impact: "Identified key atmospheric and operational predictors significantly affecting power plant electrical output through systematic model comparison. Demonstrated performance trade-offs between parametric linear approaches and non-parametric KNN regression, providing data-driven insights for power plant optimization and predictive maintenance strategies.",
    metrics: [
      { label: "Models Compared", value: "4 regression types" },
      { label: "Dataset", value: "UCI CCPP" },
      { label: "Target Variable", value: "Net hourly energy output" },
      { label: "Analysis Types", value: "EDA + Regression + KNN" },
      { label: "Evaluation", value: "Statistical validation" }
    ],
    myRole: "Sole developer - conducted exploratory data analysis with descriptive statistics and visualizations, implemented simple and multiple linear regression models, developed polynomial regression with interaction terms, optimized KNN regression with feature normalization, performed comparative model evaluation, documented findings and methodology in Jupyter Notebook. Course project for data science coursework at USC.",
    teamSize: 1,
    technologies: ["Python", "Jupyter Notebook", "scikit-learn", "pandas", "NumPy", "matplotlib"],
    tags: ["Machine Learning", "Regression Analysis", "Energy Prediction", "Power Plants", "KNN", "Linear Regression", "Polynomial Regression", "Statistical Modeling"],
    links: {
      github: "https://github.com/ShreeBohara/PowerPlant_Analysis"
    },
    images: {
      thumbnail: "/images/projects/powerplant-regression.webp",
    },
    featured: false,
    sortOrder: 6
  },
  {
    id: "project-7",
    title: "Time Series Feature Extraction: Human Activity Recognition",
    slug: "time-series-har-feature-extraction",
    year: 2025,
    duration: "3 months",
    category: "Academic",
    summary: "Extracted 42 statistical features from 6-channel sensor data for human activity recognition. Used bootstrap resampling for confidence intervals on UCI AReM dataset across 7 activity types.",
    problem: "Wearable sensors and IoT devices generate continuous multivariate time-series data for activity recognition, but raw sensor streams are noisy and high-dimensional. Requires systematic feature extraction to identify meaningful statistical patterns that distinguish different human activities for applications in healthcare monitoring, fitness tracking, and elderly care systems.",
    approach: "Analyzed the UCI AReM (Activity Recognition system based on Multisensor data fusion) dataset containing 7 distinct human activities (walking, standing, sitting, bending1, bending2, and others) with 6 multivariate sensor channels per activity (avg_rss12, var_rss12, avg_rss13, var_rss13, avg_rss23, var_rss23). Implemented comprehensive time-domain feature extraction computing 7 statistical features per channel: minimum, maximum, mean, median, standard deviation, first quartile (Q1), and third quartile (Q3), yielding 42 total features (7 features × 6 channels). Applied bootstrap resampling to estimate 90% confidence intervals for feature standard deviations, enabling statistical validation and feature importance ranking. Performed train/test split with bending activities using 2 test files and other activities using 3 test files. Conducted feature selection analysis to identify top 3 most discriminative features for activity classification.",
    impact: "Successfully extracted and validated 42 statistical time-domain features from multivariate sensor data with rigorous bootstrap confidence interval analysis. Identified key features that reliably distinguish human activities, providing foundation for classification models. Demonstrated systematic approach to time series feature engineering for wearable sensor applications, with extensibility to frequency-domain analysis and advanced ML classifiers (Random Forest, SVM).",
    metrics: [
      { label: "Features Extracted", value: "42 (7 per channel)" },
      { label: "Sensor Channels", value: "6 multivariate" },
      { label: "Activities", value: "7 types" },
      { label: "Statistical Method", value: "Bootstrap CI (90%)" },
      { label: "Dataset", value: "UCI AReM" }
    ],
    myRole: "Sole developer - preprocessed multivariate sensor data from 7 activity categories, implemented time-domain feature extraction pipeline computing 42 statistical features, applied bootstrap resampling for confidence interval estimation, conducted feature importance analysis using standard deviation distributions, performed train/test data splitting, identified top 3 discriminative features, documented methodology and statistical validation in Jupyter Notebook.",
    teamSize: 1,
    technologies: ["Python", "Jupyter Notebook", "pandas", "NumPy", "SciPy", "Bootstrap Resampling"],
    tags: ["Time Series Analysis", "Feature Extraction", "Human Activity Recognition", "Sensor Fusion", "Statistical Analysis", "Bootstrap Methods", "Wearable Sensors", "UCI Dataset"],
    links: {
      github: "https://github.com/ShreeBohara/Time-Series-Feature-Extraction-Human-Activity-Recognition"
    },
    images: {
      thumbnail: "/images/projects/time-series-har-v2.webp",
    },
    featured: false,
    sortOrder: 7
  },
];

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
    summary: "Converted to full-time after a twelve-month internship. I work on Pond, an AI-native consumer insurance platform, and own the systems that keep it observable, consented and correct.",
    highlights: [
      {
        text: "Built and operate an AI incident pipeline — alerting rules over Elasticsearch, a FastAPI service that fingerprints and batches errors into incidents, Claude analysis grounded in the actual source files, and cards delivered to the team channel. It runs on dev and stage and watches production error streams; several hundred raw events collapse into a few dozen incident reports a day, each arriving with the log link and the analysis already done",
        metric: "Root cause correct on 48 of the last 50 reports I scored by hand"
      },
      {
        text: "Cut the pipeline's projected LLM spend with a per-fingerprint analysis cache, selective prompt caching, delivery-gated spend and quota-aware backoff, while raising the context budget rather than lowering it",
        metric: "Projected 70–85% reduction"
      },
      {
        text: "Designed and shipped the consent re-capture flow for a consumer rebrand: a consent state machine instead of a boolean, every capture path funnelling into one idempotent endpoint with a single-winner atomic transition, the audit row written in the same transaction, and exactly-once propagation downstream. Live in production since July 2026",
      },
      {
        text: "Migrated notification preferences between two storage models behind a live dual-write, verifying every stored value against its source instead of counting rows",
        metric: "Zero value mismatches across 324,500 records, verified on dev and staging"
      },
      {
        text: "Cancelled a migration I had already agreed to after tracing the target write path and finding it treats the posted body as the complete desired state — a thinner projection would have deleted data on save, for exactly the users the migration targeted — then designed a smaller server-side alternative with no frontend change",
      },
      {
        text: "Shipped hostname-based routing for a marketing launch four hours and eleven minutes after the ask, verified across eighteen runs in three environments; when an unrelated backend deploy failed later that evening, ruled my change out of the causal graph first and root-caused the real failure to configuration dropped by a merge from a stale branch",
      }
    ],
    technologies: ["Python", "FastAPI", "Anthropic Claude API", "Elasticsearch", "ELK", "Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "MariaDB", "AWS", "Docker"],
    companyInfo: {
      website: "https://quinstreet.com",
      industry: "InsurTech / Digital Marketing",
      size: "Public company"
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
    summary: "Twelve-month internship spent building Pond from an empty repository to a product in production.",
    highlights: [
      {
        text: "Co-architected Pond on AWS and helped take it from nothing to production in under two months, then built the multi-step onboarding most accounts are created through: address autocomplete and normalisation, cascading make/model/trim selection behind staged cache lifetimes, and policy import that parses an existing policy instead of making people retype it",
      },
      {
        text: "Built the rating engine in Java and Spring Boot over carrier rate APIs — the piece that turned Pond from a place to organise your insurance into a place to get quoted",
      },
      {
        text: "Built Ollie, Pond's conversational insurance advisor, end to end: nine routed conversation contexts, a Spring WebFlux backend streaming over SSE, a React client that renders partial markdown correctly mid-stream, and in-chat coverage changes instead of a hand-off to a multi-screen form",
        metric: "A short-TTL dedup cache cut redundant inference calls by roughly 40%"
      },
      {
        text: "Built the integration layer fronting eight third-party services, with trace correlation threaded across services, field-level encryption of regulated data at the persistence boundary, and a broker-free batch queue on PostgreSQL using FOR UPDATE SKIP LOCKED",
      },
      {
        text: "Cut the frontend bundle 35% with chunk splitting and lazy routes, built the four-variant experimentation surface, and eliminated the most-reported mobile defect: the on-screen keyboard resizing the viewport and pushing form fields off-screen mid-entry",
      },
      {
        text: "Retrofitted observability: 38 API endpoints instrumented with structured logging into ELK, request/user/product identifiers threaded through MDC across eight services, and React errors bridged into the same pipeline behind rate-limited beacons so one looping browser cannot flood ingest",
      }
    ],
    technologies: ["React", "TypeScript", "Java", "Spring Boot", "Spring WebFlux", "SSE", "PostgreSQL", "AWS", "ELK", "Kibana", "Docker", "Ansible", "Heap Analytics"],
    companyInfo: {
      website: "https://quinstreet.com",
      industry: "InsurTech / Digital Marketing",
      size: "Public company"
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
    summary: "Built healthcare interoperability under ABDM, India's national digital health programme, so hospitals could exchange patient records in one standard.",
    highlights: [
      {
        text: "Built the FHIR-compliant Health Identifier platform in Node.js, React and MySQL that moved patient records between hospitals in a single standard shape",
        metric: "500+ hospitals, 100K+ monthly users, 50K+ record exchanges a day"
      },
      {
        text: "Shipped OAuth 2.0 authentication, role-based access control and PostgreSQL audit logging; the platform passed the ABDM compliance review on first submission",
      },
      {
        text: "Cut API response time 3× with Redis caching on the hot paths and held 99.9% uptime across the hospital integrations, with distributed tracing and structured logging across six services",
      },
      {
        text: "Built classical NLP pipelines that classified 15K+ clinical documents a day into 12 document types, and cut duplicate patient records by about 30% by combining edit distance with phonetic matching — Indian names are transliterated differently by different hospital systems, so two spellings of one name never match on edit distance alone",
      },
      {
        text: "Made the provider dashboard 45% faster to first load with lazy-loaded FHIR views, and built a JSON-Schema-driven form builder the team shipped later features with",
      }
    ],
    technologies: ["Node.js", "React", "MySQL", "PostgreSQL", "FHIR", "OAuth 2.0", "RBAC", "Redis", "AWS", "Microservices"],
    companyInfo: {
      website: "https://deeptek.ai",
      industry: "HealthTech / Medical Imaging",
      size: "Growing startup"
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
      "Machine Learning",
      "Database Systems",
      "Information Retrieval",
      "Analysis of Algorithms",
      "Web Technologies"
    ],
    achievements: [
      "3rd place of 90+ teams at HackMIT24, leading a team building a modular IoT gateway",
      "1st place of 37 teams at AGI House's Agent Identity Build Day for CORDON",
      "3rd place at AGI House's AutoResearch Summit for Delta Sentinel"
    ]
  }
];
