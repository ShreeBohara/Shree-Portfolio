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
      "My first project was building a calculator from scratch using just HTML, CSS, and JavaScript—no frameworks, no AI assistance. It took me an entire week just to get the logic right. At the time, it felt incredibly difficult, and I remember thinking, 'If a simple calculator is this hard, how am I going to survive in this field?' Especially when I kept hearing about all these advanced technologies like quantum computing and AI. But I decided to keep pushing forward and learning something new every day, gradually getting better.",
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
    aiThoughts: "AI is a power tool, not an autopilot. I use it to speed up setup and boring work—scaffold APIs, write tests, draft SQL, clean logs, and document changes—but I keep humans in charge of design and reviews. At QuinStreet, we used AI heavily on Pond. I owned the Manual Entry flow and helped wire 'Ollie' for FAQ/next-step help. We shipped the MVP in under 2 months. In side projects, I use AI where it clearly adds value: GlobePulse (embeddings + vector search) and EchoLens (image → audio for accessibility). Guardrails matter: prompt hygiene, tests, metrics, feature flags, A/Bs. I avoid AI on high-risk paths (payments, strict-latency code)."
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
      answer: "I'm Shree Bohara, a Computer Science graduate student at USC originally from Pune, India. I'm passionate about building accessible, reliable software with clean system design. Currently, I'm working part-time at QuinStreet on Pond, an AI-powered insurance platform where we shipped the fastest MVP in company history (2 months from empty repo to production). I specialize in full-stack development (TypeScript/React, Java/Spring Boot, Postgres), AI integration, and taking products from 0→1→100. What drives me is removing real barriers for people—like building EchoLens to help visually impaired users access web images. I'm seeking full-time opportunities starting May 2026 where I can ship end-to-end features on fast-paced product teams.",
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
      answer: "Because I take products from 0 → 1 → 100. At QuinStreet, I helped take Pond from an empty repo to MVP in under two months (fastest in company history), and I'm now scaling it with experiments, reliability, and guardrails. I start with the real user problem, sketch a clean architecture, then ship in small end-to-end slices. I own outcomes—idea → design → API/UI → tests → metrics → iteration—and I use AI where it truly helps, not as autopilot. You get a builder who moves fast, measures impact, and lifts team velocity while keeping the product accessible and reliable.",
      category: "hiring"
    },
    {
      question: "What are you passionate about in tech?",
      answer: "Building accessible, reliable products and clean architectures—and using AI thoughtfully to remove friction for users, not add it.",
      category: "personal"
    },
    {
      question: "What's your proudest achievement?",
      answer: "The most impressive thing I've done was during my internship at QuinStreet, where I'm currently working part-time. QuinStreet hired four new interns to build a brand new project called Pond from the ground up. The mission was to create a great user experience through our mascot Ollie, who helps users find the best insurance rates for auto and home insurance. What made this impressive was that we literally started from nothing. On my first day (June 2nd, 2025), we had no Figma designs, no database schema, no architecture—nothing. Despite that, we developed and deployed the entire MVP to production by August 15th, 2025 in under 2 months, which was the fastest MVP build in company history. My core contribution was designing and implementing the entire 'Manual Flow'—one of our three onboarding flows. In this flow, we ask users 23 dynamic questions that adapt based on their answers. I fully owned the Manual Flow from start to finish. Here's why this was so impressive: QuinStreet already had a similar flow called White Label that took them years to develop. Obviously, White Label is more robust, but building our Manual Flow in such a short time really stood out to everyone in the company. Every week we had demo sessions with our CTO, and she was really impressed with my work. She praised me in front of the team, and shortly after, she organized a meeting with top-ranking officials within the company. In that meeting, she asked me to explain my entire process to everyone, and then told all the leaders to implement a similar approach in their respective teams to boost overall productivity. The project is currently live at insurance.com/pond, and everything you see there was built by me and my team in those two months.",
      category: "personal"
    },
    {
      question: "What was your biggest technical challenge and how did you overcome it?",
      answer: "The most challenging project I'm working on right now is Pond at QuinStreet. We're building an AI-powered insurance platform completely from scratch—no designs, no database, no architecture on day one. It's been like working at a startup but with the backing of a larger company. The specific challenge that really tested me was when our product manager wanted to run A/B testing on three different onboarding flows. The goal was to figure out which flow got users through the process fastest. But here's the catch—we needed to show different flows to different users in real-time, split them equally across all three options, and get it live in production quickly. This was tricky because all three flows were built completely differently. We couldn't just swap out small pieces—we had to load entirely different experiences based on which group the user was in. My solution was pretty straightforward: generate a random number (0, 1, or 2) on our server every time a user arrives, and use that to decide which flow they see. I added some logic to make sure the split stayed equal over time, and made sure the decision happened before the page even loaded so users wouldn't see any flickering or delays. I pitched this to the team, everyone liked it, and we had it running in production within a week. Now our product team can actually see which onboarding flow works best with real data. What made this challenging wasn't just the technical part—it was doing it fast without breaking anything that was already working. But honestly, that's what I enjoy about this project. Every couple weeks there's a new problem to solve, and we have to think quickly and ship quickly.",
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
    {
      question: "What's your visa status and work authorization?",
      answer: "I am on an F-1 visa and will have up to 3 years of work authorization under OPT/STEM OPT. After that period, I will require employer sponsorship (e.g., H-1B) to continue employment.",
      category: "hiring"
    },
    {
      question: "Where are you willing to work? Any location preferences?",
      answer: "I'm open to anywhere in the USA. I'm currently in Los Angeles for USC, but I'm willing to relocate for the right opportunity.",
      category: "career"
    }
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
  }
};

export const projects: Project[] = [
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
  },
  {
    id: "project-2",
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
    sortOrder: 2
  },
  {
    id: "project-3",
    title: "GlobaLens: See Beyond the Headlines",
    slug: "globalens",
    year: 2025,
    duration: "2 months",
    category: "AI/ML",
    summary: "Built an AI-powered platform that transforms global news into an interactive, searchable world map using GDELT data, geospatial visualization, and semantic vector search.",
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
    summary: "Performance enhancements for PostgreSQL 17.4's B-tree index implementation, achieving up to 49.6% query speedup through linear search optimization and asynchronous leaf-page prefetching.",
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
    featured: false,
    sortOrder: 4
  },
  {
    id: "project-5",
    title: "KNN Classification: Vertebral Column Health Analysis",
    slug: "knn-vertebral-column-analysis",
    year: 2025,
    duration: "1 month",
    category: "AI/ML",
    summary: "Comparative machine learning study implementing K-Nearest Neighbors classification on vertebral column biomechanical data, evaluating five distance metrics to predict normal vs. abnormal spinal conditions.",
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
    featured: false,
    sortOrder: 5
  },
  {
    id: "project-6",
    title: "Power Plant Energy Output: Regression Model Comparison",
    slug: "powerplant-regression-analysis",
    year: 2025,
    duration: "1 month",
    category: "AI/ML",
    summary: "Comparative machine learning study predicting net hourly electrical energy output from Combined Cycle Power Plants using multiple regression approaches, evaluating parametric vs. non-parametric models for optimal performance.",
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
    featured: false,
    sortOrder: 6
  },
  {
    id: "project-7",
    title: "Time Series Feature Extraction: Human Activity Recognition",
    slug: "time-series-har-feature-extraction",
    year: 2025,
    duration: "3 months",
    category: "AI/ML",
    summary: "Time series analysis project extracting statistical features from multivariate sensor data to classify human activities, leveraging the UCI AReM dataset with 6-channel sensor fusion and bootstrap statistical validation.",
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
    featured: false,
    sortOrder: 7
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
