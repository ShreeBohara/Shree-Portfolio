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
    // twitter: undefined, // Add your Twitter/X handle here if you have one
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
      items: ["Git", "GitHub", "VS Code", "GCP", "Agile/Scrum", "OOP", "Jira", "MVC", "Postman", "Vercel", "Cursor", "Figma"]
    },
    {
      category: "AI/ML",
      items: ["OpenAI API", "Vertex AI", "Groq API", "Llama Vision", "Vector Search", "BigQuery"]
    }
  ],

  // Extended personal content for richer AI chat responses
  careerStory: {
    background: "I'm originally from Pune, India, where I completed my B.S. in Computer Science at MIT-WPU before coming to USC for my Master's degree.",
    inspiration: "It all started with curiosity. When I was 7 or 8 years old, my dad brought home a laptop for the first time—it was a Windows XP or Windows 7 machine. I was completely amazed that one device could do so many things. I remember creating my first Gmail account and successfully sending an email to my brother, who lived in a different city. That moment was incredible—with just a single click, I could communicate with him instantly. It really opened my eyes to how powerful technology is. That experience sparked my curiosity about how all of this actually works. From that day on, I kept exploring and learning more about technology, which eventually led me to enroll in a computer science program.",
    keyMoments: [
      "My journey began by engineering a custom state-management system using vanilla JavaScript—deliberately avoiding frameworks to master the core fundamentals. I spent weeks handling complex edge cases and DOM manipulation without external libraries. This deep dive into the 'hard way' of building software taught me the importance of algorithmic thinking and clean architecture before I ever touched modern tools. It was a defining experience that grounded my engineering philosophy: understand the primitives before abstracting them away.",
      "One of my most memorable experiences was my first hackathon. I didn't have much technical knowledge back then, but my team and I stayed up late, learning from YouTube videos, and somehow managed to build a mobile app. We ended up winning Runner-Up among 30 teams at the NIT-B Hackathon for our health-tech app that streamlined hospital referrals. That experience really showed me what I could accomplish when I pushed through the challenges.",
      "At QuinStreet, I'm currently working part-time on Pond—an AI-powered insurance platform. We started from nothing on June 2nd, 2025 (no Figma designs, no database, no architecture) and shipped the auto insurance MVP to production by August 15th, 2025—the fastest MVP in company history. I owned the entire Manual Flow (23 dynamic questions), and our CTO was so impressed she asked me to present my process to company leadership to help boost productivity across teams. The project is live at insurance.com/pond."
    ],
    whyUSC: "I chose USC primarily for two reasons. First, USC has one of the strongest alumni networks in the country, especially in the tech industry. Coming to the USA, I knew that making connections would be one of the most important parts of building a successful career here. Considering that USC has such an extensive and supportive alumni network, I knew it was the right choice for me. This network has been invaluable for career opportunities and guidance. Second, USC's computer science program is highly ranked and well-respected. The quality of education and the reputation of the program were important factors for me, as I wanted to learn from top faculty and be challenged academically. So far, courses like Database Systems and Information Retrieval, plus hands-on projects and alumni coffee chats, have validated my choice—I've already applied class ideas to real features and met mentors who opened doors.",
    whatDrivesYou: "I'm driven by building software that removes real barriers for people. Volunteering at a school for the blind showed me how small gaps—like missing image descriptions—can lock someone out, which is why I built accessibility tools like EchoLens and focus on shipping reliable, user-centric products like Pond. I love fast feedback loops, measurable impact (faster onboarding, fewer handoffs), and taking ownership when things break. Knowing something I built makes someone's day easier is what keeps me going."
  },

  technicalPhilosophy: {
    approach: "I start with the user problem and clear success criteria. Then I sketch lightweight UML/architecture (context + sequence + ER/ERD) to nail FE/BE/DB boundaries and align on API contracts and data models. I break the work into small, end-to-end vertical slices and build iteratively—keeping the big-picture diagram in mind. Critical paths get tests first; accessibility and performance budgets are non-negotiable. I add observability (logs/metrics), ship behind feature flags with a rollback plan, monitor real usage, and iterate—documenting decisions and doing quick postmortems when things break.",
    whatExcitesYou: "System design. I love taking a messy problem and shaping a clean, loosely-coupled architecture—thinking through edge cases, failure modes, data contracts, and how each component talks to the others. I'll sketch component/sequence/ER diagrams, define FE/BE boundaries, and stress the seams before I write code. I did this on Pond's Manual Flow at QuinStreet—spent a focused week gathering requirements, mapping edge cases, and designing the flow; once the design was solid, coding was the easy part. That blend of big-picture thinking + pragmatic tradeoffs (latency vs. simplicity, safety vs. speed) is what makes me want to become a software architect.",
    favoriteTools: [
      { name: "Cursor", reason: "VS Code with AI. Helps me set up, refactor, and write tests faster. I still review every change." },
      { name: "ChatGPT", reason: "My planning/debugging buddy. I think through designs and edge cases, then verify locally." },
      { name: "React", reason: "My go-to for clean, accessible UIs with components and hooks." },
      { name: "Spring Boot", reason: "Sturdy, production-ready APIs with clear structure." },
      { name: "PostgreSQL/MySQL", reason: "Reliable relational stores with strong tooling." },
      { name: "Figma", reason: "Fast from ideas → user flows → dev handoff (used heavily on Pond)." }
    ],
    goodProject: "Impact first: it should solve a real user problem and show measurable results (faster, fewer errors, higher conversion). After that, I look for: Clarity (clear goal, simple design, small milestones), Reliability & accessibility (works under stress, accessible to everyone), Maintainability (clean code, tests, logs, docs, easy to hand off), and Feedback loop (ship early, learn from users, iterate).",
    aiThoughts: "AI is a power tool, not an autopilot. I use it to speed up setup and boring work—scaffold APIs, write tests, draft SQL, clean logs, and document changes—but I keep humans in charge of design and reviews. At QuinStreet, we used AI heavily on Pond. I owned the Manual Entry flow and helped wire 'Ollie' for FAQ/next-step help. We shipped the MVP in under 3 months. In side projects, I use AI where it clearly adds value: GlobePulse (embeddings + vector search) and EchoLens (image → audio for accessibility). Guardrails matter: prompt hygiene, tests, metrics, feature flags, A/Bs. I avoid AI on high-risk paths (payments, strict-latency code)."
  },

  interests: {
    hobbies: [
      "Chess (strategic thinking and problem-solving)",
      "Badminton (played for my school and coached students back in India)",
      "Reading (currently working through Atomic Habits)",
      "Hackathons (love the fast-paced team collaboration)",
      "Exploring LA (there's a trail near Griffith Observatory that passes a bird sanctuary; if you hike a bit more you can see downtown LA, the observatory, and Santa Monica)"
    ],
    books: ["Atomic Habits by James Clear — I like its focus on identity-based habits: build systems and small daily actions ('I'm a runner,' not 'I'll run a marathon'). It's practical and easy to apply."],
    podcasts: ["Lex Fridman Podcast — Long-form conversations (often 3+ hours) where world-class experts think out loud without interruptions. You get raw exploration instead of polished soundbites, which helps me form deeper views on tech and beyond."],
    youtube: ["Fireship — Short, funny rundowns of the latest tools and frameworks. Great for staying current fast, cutting hype, and deciding what's worth trying next."],
    freeTime: "Short walks with calm/lo-fi music to reset and de-stress. It clears my head, lowers stress, and helps me come back refreshed and focused."
  },

  faqs: [
    {
      question: "Tell me about yourself",
      answer: "I'm Shree Bohara, a CS graduate student at USC from Pune, India. I specialize in full-stack development (TypeScript/React, Java/Spring Boot, Postgres) and AI integration. Currently, I'm working part-time at QuinStreet on Pond—an AI-powered insurance platform. I'm driven by building accessible, reliable software and taking products from 0→1→100. Projects like EchoLens (image-to-audio for visually impaired users) reflect my focus on removing real barriers for people. Seeking full-time opportunities starting May 2026.",
      category: "personal"
    },
    {
      question: "What are you looking for in your next role?",
      answer: "A fast-paced team where I can learn quickly and ship real features end-to-end. I want exposure to user-facing product work, backend systems, and thoughtful AI features—so I understand how everything connects. I'm happy with small, product-driven teams inside a startup or a high-velocity group at a larger company.",
      category: "career"
    },
    {
      question: "What's your ideal company/team culture?",
      answer: "Kind, curious, and direct. Ship fast with guardrails (tests, metrics, rollbacks). Low ego, high ownership. Clear goals, frequent feedback, and space to think about design before coding.",
      category: "career"
    },
    {
      question: "What kind of problems do you want to solve?",
      answer: "Real user problems with measurable impact—faster onboarding, fewer errors, better accessibility. I love system design: taking something messy and turning it into a clean, loosely-coupled architecture.",
      category: "technical"
    },
    {
      question: "Are you open to remote/hybrid/onsite work?",
      answer: "Open to all three. I care more about the team, the learning, and the pace than the format.",
      category: "career"
    },
    {
      question: "What are you currently learning or exploring?",
      answer: "Deeper system design, better observability/A-B frameworks, and where AI makes sense in real products (not hype). I'm also refining accessibility patterns from my EchoLens work.",
      category: "technical"
    },
    {
      question: "What's your preferred tech stack?",
      answer: "TypeScript + React on the front end; Java/Spring Boot or Node/Express on the back end; Postgres/MySQL; REST/GraphQL; cloud deploys (Vercel/GCP/AWS). Tools I like: Cursor for speed, ChatGPT for design/edge-case brainstorming, Heap/metrics for feedback.",
      category: "technical"
    },
    {
      question: "What makes you different from other candidates?",
      answer: "I combine speed with care. I design first (diagrams, data contracts, failure modes), then build in small, testable slices. I've shipped production features quickly (e.g., Pond's 23-step Manual Entry flow) and handled live incidents calmly with clear RCAs and fixes.",
      category: "hiring"
    },
    {
      question: "Why should someone hire you?",
      answer: "I take products from 0 → 1 → 100. I start with the real user problem, sketch a clean architecture, then ship in small end-to-end slices. I own outcomes—idea → design → API/UI → tests → metrics → iteration. At QuinStreet, this approach helped us ship Pond's MVP in record time. I use AI to accelerate work, not replace thinking. You get someone who moves fast, measures impact, handles incidents calmly, and keeps products accessible and reliable.",
      category: "hiring"
    },
    {
      question: "What are you passionate about in tech?",
      answer: "Building accessible, reliable products and clean architectures—and using AI thoughtfully to remove friction for users, not add it.",
      category: "personal"
    },
    {
      question: "What's your proudest achievement?",
      answer: "Building Pond at QuinStreet from scratch—an AI-powered insurance platform. On day one (June 2nd, 2025), we had no designs, no database, no architecture. By August 15th, we shipped the MVP to production in under 3 months—the fastest MVP build in company history. I owned the entire Manual Flow: 23 dynamic questions that adapt based on user answers. For context, QuinStreet's existing White Label flow took years to develop; we built ours in under 3 months. The CTO was so impressed she asked me to present my process to company leadership to help boost productivity across teams. The project is live at insurance.com/pond.",
      category: "personal"
    },
    {
      question: "What was your biggest technical challenge and how did you overcome it?",
      answer: "Building Pond's 3-way A/B testing framework at QuinStreet. Our PM wanted to test three completely different onboarding flows simultaneously—each built differently, requiring entirely different experiences per user group. My solution: server-side assignment using a random number (0, 1, or 2) generated per user arrival, with logic to maintain equal distribution. The decision happens before page load, so no flickering or delays. I pitched it, got buy-in, and shipped it to production within a week. Now our product team can see which onboarding flow converts best with real data. What made it challenging wasn't just the tech—it was shipping fast without breaking existing functionality.",
      category: "technical"
    },
    {
      question: "What advice would you give to someone starting in CS?",
      answer: "Start small, ship often: build tiny apps (calculator, to-do, one REST API) and put them on GitHub. Learn the basics well: data structures/algos, HTTP, SQL, and how the web actually works. Design before code: sketch simple diagrams (components, sequence, ERD), list edge cases, then build. Pick a simple stack: TypeScript + React, Node/Express, Postgres/MySQL. Deploy on Vercel/Render. Use AI as a tool, not autopilot: speed up boilerplate and tests, but verify everything. Join hackathons & teams: you'll learn faster from real problems and feedback. Measure impact: add logs/metrics, think about accessibility, and iterate. Build habits, not just goals: small daily progress beats big once-a-month bursts.",
      category: "personal"
    },
    {
      question: "What's next for you after USC?",
      answer: "Short term: a full-time full-stack SWE role on a fast-paced product team. I want to take features end-to-end (idea → design → API/UI → tests → metrics) and help a product go 0 → 1 → 100. Focus areas: user onboarding flows, reliability and observability, thoughtful AI features with guardrails, and accessibility. Stack comfort: TypeScript/React; Java/Spring Boot or Node; Postgres/MySQL; REST/GraphQL; cloud deploys; A/B tests + metrics. Work mode: open to onsite/hybrid/remote—I care most about the team, learning speed, and shipping real value. Long term: grow into a software architect—design clean, scalable systems and lead teams to ship accessible, reliable products (using AI where it truly helps).",
      category: "career"
    },
  ],

  workStyle: {
    preferences: "I like fast-paced teams that still make time for good design upfront. I'm comfortable working independently on end-to-end slices, and I collaborate on interfaces, reviews, and experiments. My flow: align on the user problem → sketch simple diagrams/contracts → build small vertical slices behind flags → ship → measure → iterate. I communicate early, write short docs, and use data (logs/metrics/A/Bs) to guide decisions.",
    values: [
      "Ownership & impact: solve real user problems and measure results",
      "Kindness + candor: low-ego teamwork, direct feedback, and respect",
      "Speed with guardrails: tests, metrics, rollbacks, and accessibility are non-negotiable",
      "Learning culture: clear goals, code reviews, and space to think before coding"
    ],
    handlingChallenges: "Stay calm and get the facts (logs, metrics, repro). Contain first (feature flag/rollback), then deliver the smallest safe fix. Communicate what's happening, ship, then do a quick RCA and add guardrails/tests so it doesn't repeat. Example: at QuinStreet, a third-party edge case took prod down; I traced it, hot-fixed the schema to restore service in ~3 hours, then added a product fallback the next day."
  },

  jobSearch: {
    visa: "F-1 visa with up to 3 years of OPT/STEM OPT work authorization. Will require H-1B sponsorship after that period.",
    locationPreference: "Open to anywhere in the USA. Currently in Los Angeles for USC, willing to relocate.",
    companySizePreference: "No preference—comfortable with startups, growth companies, or larger tech companies. Care most about team culture, learning opportunities, and shipping velocity.",
    redirectToCall: ["salary expectations", "specific start date", "interview availability", "compensation", "detailed availability"]
  },

  // Behavioral & Personal Content for AI Chat
  strengths: {
    primary: "Persistence",
    primaryStory: "My colleagues would say I never give up, even when things get tough. When I came to the U.S. last fall for my master's, I immediately started searching for summer internships. It was a rollercoaster—I got really close to an offer early on, but it fell through due to CPT timing issues. Instead of giving up, I kept applying and interviewing. By end of May, most friends told me it was too late—summer internships were filled. But I kept pushing, and on May 28th, I finally got an offer from QuinStreet. That persistence paid off—we ended up building the fastest MVP in company history in just 2 months.",
    secondary: "Helping Others",
    secondaryStory: "My colleagues would also say I'm always willing to help—whether it's debugging someone's code, helping them prep for interviews, or just being there when they need support. I see this as a strength because it pushes me to keep learning so I can be more useful to my team."
  },

  fiveYearVision: "In the next five years, I see myself in a fast-paced engineering environment where I'm constantly learning and shipping things that actually reach users. My goal is to build a really strong foundation by working across different parts of the stack and different problem spaces—from user-facing features and backend systems to understanding how AI can be used thoughtfully in real products. I want to be the kind of engineer who not only writes code, but also understands how the technical decisions connect to the business and user experience. In five years, I'd like to be a solid full-stack developer with deep enough experience in AI-driven systems that I can own end-to-end projects and mentor newer engineers. Longer term, I'm excited about turning some of my own ideas into products.",

  weakness: {
    area: "Communication",
    story: "When I first came to the U.S. last year, communication was definitely my biggest weakness. English isn't my first language, and adjusting to different accents and communication styles was challenging. I knew I had to improve, so I joined social clubs specifically to practice talking with people in different settings. I've also been recording myself for 5 minutes every day, playing it back, and identifying what I can improve. I've made real progress since last year—my teammates at QuinStreet can communicate with me smoothly now, and I've had no issues during standups or technical discussions. It's still a learning curve, and I'm not perfect yet, but I'm actively working on it every single day."
  },

  funFacts: [
    "My first ever flight was a 22-hour journey from India to the USA. It was super long, a bit scary, but also really exciting because it felt like the start of a whole new chapter.",
    "I can cook really well… but only when I'm in the mood. On other days, Maggi (Indian noodles) is my hero and basically keeps me alive.",
    "I love taking pictures of sunsets. If you check my Archive (top colorful icon), you'll see so many sunset photos. They all look kind of similar, but I still can't stop clicking them."
  ],

  chessOpening: {
    name: "King's Gambit",
    why: "I love it because it turns the game into chaos in like 5 moves, and suddenly both players are pretending they know what's going on. The positions get sharp and wild really fast, so I actually have to think at the board instead of just following theory. It's a bit like saying, 'Here, have a pawn… and also my sanity,' but that's what makes it so fun."
  },

  dreamDestinations: [
    {
      place: "Norway",
      reason: "I'm obsessed with the idea of dramatic fjords, northern lights, quiet little towns, and those super cozy, peaceful vibes. I love the thought of just sitting by the water with a hot drink, watching the sky change colors and feeling like I'm inside a postcard."
    },
    {
      place: "Japan",
      reason: "It feels like a perfect mix of anime-level chaos and calm temples, high-tech cities and beautiful nature. I really like how you can go from neon streets and trains to quiet shrines, forests, and little traditional streets in just one day."
    }
  ]
};

export const projects: Project[] = [
  {
    id: "project-1",
    title: "AI-Powered Resume Builder",
    slug: "ai-resume-builder",
    year: 2025,
    duration: "3 months",
    category: "AI/ML",
    summary: "Built an AI-driven resume builder with React and OpenAI APIs. Automated keyword optimization and ATS compatibility checks boosted interview callbacks by 30%.",
    problem: "Job seekers struggle to tailor resumes for specific positions and optimize for Applicant Tracking Systems (ATS).",
    approach: "Built an intelligent system using OpenAI APIs for automated keyword optimization, skill matching, and ATS compatibility checks.",
    impact: "Achieved 30% higher interview callback rate by enhancing ATS compatibility and tailoring resumes to specific job descriptions.",
    metrics: [
      { label: "Interview Callbacks", value: "+30%" },
      { label: "Load Time", value: "40% faster" },
      { label: "ATS Score", value: "Optimized" }
    ],
    myRole: "Full-stack developer, designed and implemented the entire application including AI integration and AWS deployment.",
    teamSize: 1,
    technologies: ["React", "OpenAI API", "AWS", "Node.js", "TypeScript"],
    tags: ["AI", "NLP", "Career Tech", "AWS", "Automation"],
    links: {
      // Note: Add GitHub link when ready to make repo public
    },
    images: {
      thumbnail: "/images/projects/resume-builder.webp",
    },
    featured: false,
    sortOrder: 8
  },
  {
    id: "project-2",
    title: "EchoLens: Image-to-Audio Accessibility Tool",
    slug: "echolens",
    year: 2025,
    duration: "2 months",
    category: "Full-Stack",
    summary: "A Chrome extension designed to make the web more accessible for visually impaired users by providing real-time, AI-generated audio descriptions of images. Powered by Llama 3.2 Vision for analysis and Google TTS for natural voice output.",
    problem: "Visually impaired users often face significant barriers when navigating the web, as many images lack proper alt text or descriptions, leaving a large portion of digital content inaccessible.",
    approach: "Developed a seamless Chrome extension that integrates a JavaScript frontend with a Flask backend. The system leverages Groq's Llama 3.2 Vision model to analyze images in real-time and converts the descriptions into speech using Google TTS. User preferences are securely managed via a Microsoft SQL database.",
    impact: "Significantly improved web accessibility by enabling visually impaired users to 'hear' images, providing instant, detailed audio descriptions for any visual content on the web, thereby bridging the digital divide.",
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
    id: "exp-1",
    company: "QuinStreet",
    logo: "/QS_LOGO.png",
    role: "Software Engineer - Intern",
    type: "Internship",
    location: "Foster City, CA",
    startDate: "2025-06",
    endDate: null,
    current: true,
    summary: "Shipping production features for insurance quote platform, building AI chat experiences, and optimizing onboarding flows. Currently working on Pond, an AI-powered insurance platform.",
    highlights: [
      {
        text: "Shipped Pond from Figma to production in under 3 months (live at insurance.com/pond); componentized UI and added reviewable flows",
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
    },
    links: {
      company: "https://quinstreet.com",
      project: "https://insurance.com/pond"
    }
  },
  {
    id: "exp-2",
    company: "DeepTek Medical Imaging Pvt Ltd",
    logo: "/deeptek_logo.png",
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
    logo: "/usc_logo.png",
    degree: "Master of Science",
    field: "Computer Science",
    location: "Los Angeles, CA",
    startYear: 2024,
    endYear: 2026,
    gpa: "3.7/4.0",
    relevantCoursework: [
      "Analysis of Algorithms",
      "Database Systems",
      "Web Technologies",
      "Information Retrieval",
      "Artificial Intelligence"
    ],

  },
  {
    id: "edu-2",
    institution: "MIT World Peace University",
    logo: "/MIT_LOGO.png",
    degree: "Bachelor of Technology",
    field: "Computer Science",
    location: "Pune, India",
    startYear: 2020,
    endYear: 2024,
    gpa: "3.9/4.0",
    relevantCoursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Cloud Computing",
      "Distributed Systems"
    ]
  }
];
