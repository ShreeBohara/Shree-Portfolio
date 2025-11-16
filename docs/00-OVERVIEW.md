# Portfolio Codebase Overview

## Project Summary
A modern, AI-powered portfolio website for Shree Bohara featuring a chat-first interface where visitors can ask natural language questions about projects, experience, and skills. Built with Next.js 16, React 19, TypeScript, and OpenAI's GPT-4o-mini with RAG (Retrieval-Augmented Generation).

## Tech Stack

### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS 4 + CSS Variables
- **Animations:** Framer Motion 12.23.24
- **UI Components:** Radix UI (accessible primitives)
- **Icons:** Lucide React 0.553.0

### State Management
- **Zustand:** 5.0.8 with persistence middleware
- Stores: UI state, theme, sidebar, details panel, chat context

### AI/Backend
- **OpenAI:** GPT-4o-mini for chat responses
- **Embeddings:** text-embedding-3-small (1536 dimensions)
- **Vector Store:** Supabase pgvector
- **Database:** PostgreSQL (via Supabase)
- **RAG:** Custom implementation with retrieval + generation

### Development
- **Package Manager:** npm
- **Runtime:** Node.js
- **Deployment:** Vercel-ready

## Project Structure

```
Shree-Portfolio/
├── shree-portfolio/              # Main Next.js app
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── api/              # API routes
│   │   │   │   ├── chat/         # Chat endpoint (streaming)
│   │   │   │   └── admin/        # Admin endpoints (embeddings, reindex)
│   │   │   ├── browse/           # Browse page (catalog view)
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home page (chat interface)
│   │   │   └── globals.css       # Global styles + CSS variables
│   │   ├── components/
│   │   │   ├── catalog/          # Browse mode components
│   │   │   ├── chat/             # Chat interface components
│   │   │   ├── layout/           # Layout components (header, sidebar, details)
│   │   │   ├── providers/        # React context providers
│   │   │   └── ui/               # Reusable UI components (Radix-based)
│   │   ├── data/
│   │   │   ├── portfolio.ts      # All portfolio content (projects, experience, education)
│   │   │   └── types.ts          # TypeScript type definitions
│   │   ├── lib/
│   │   │   ├── ai/               # AI/RAG implementation
│   │   │   │   ├── rag.ts        # Main RAG logic
│   │   │   │   ├── prompts.ts    # System & user prompts
│   │   │   │   ├── retrieval.ts  # Vector search & citation extraction
│   │   │   │   ├── embeddings.ts # Embedding generation
│   │   │   │   ├── vector-store.ts # Supabase pgvector interface
│   │   │   │   ├── client.ts     # OpenAI client
│   │   │   │   ├── config.ts     # AI configuration
│   │   │   │   ├── rate-limit.ts # Rate limiting
│   │   │   │   └── cache.ts      # Response caching
│   │   │   └── utils.ts          # Utility functions (cn, etc.)
│   │   ├── store/
│   │   │   └── ui-store.ts       # Zustand store (UI state, theme, preferences)
│   │   └── hooks/
│   │       └── useThemeColor.ts  # Theme color management
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies
│   ├── next.config.ts            # Next.js configuration
│   ├── tailwind.config.ts        # Tailwind configuration
│   └── tsconfig.json             # TypeScript configuration
├── Idea/                         # Product brief & planning docs
└── README.md                     # Project README
```

## Key Features

### 1. Chat-First Interface
- Natural language Q&A about portfolio
- Streaming AI responses with typing animation
- Context-aware (can focus on specific projects/experiences)
- Citation system linking to source material
- Prompt suggestions that adapt to context
- Rate limiting (20 requests per window)

### 2. Browse Mode
- Traditional portfolio view with filters/sorting
- Three sections: Projects, Experience, Education
- Details panel with full information
- Compare mode for projects
- Responsive grid/list layouts

### 3. AI/RAG System
- Vector embeddings stored in Supabase
- Retrieves top 15 relevant chunks (min score 0.4)
- GPT-4o-mini generates responses (temp 0.8, max 1500 tokens)
- Citations extracted from retrieved content
- Fallback to placeholder if vector store unavailable

### 4. Design System
- Dark/light mode toggle
- 8 accent colors (teal, blue, pink, orange, yellow, green, red, violet)
- Smooth animations with Framer Motion
- Accessible (Radix UI, keyboard navigation, ARIA)
- Responsive (mobile-first)

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Supabase
SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Key Files to Know

1. **src/app/page.tsx** - Home page (chat interface)
2. **src/app/api/chat/route.ts** - Chat API endpoint
3. **src/data/portfolio.ts** - All portfolio content
4. **src/lib/ai/rag.ts** - RAG implementation
5. **src/components/chat/ChatInterface.tsx** - Main chat UI
6. **src/store/ui-store.ts** - Global state management

## Documentation Index

- [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) - System architecture & data flow
- [02-AI-RAG-SYSTEM.md](./02-AI-RAG-SYSTEM.md) - AI/RAG implementation details
- [03-CHAT-INTERFACE.md](./03-CHAT-INTERFACE.md) - Chat UI components
- [04-BROWSE-CATALOG.md](./04-BROWSE-CATALOG.md) - Browse mode components
- [05-LAYOUT-COMPONENTS.md](./05-LAYOUT-COMPONENTS.md) - Layout structure
- [06-UI-COMPONENTS.md](./06-UI-COMPONENTS.md) - Reusable UI components
- [07-DATA-MODEL.md](./07-DATA-MODEL.md) - Portfolio data structure
- [08-STATE-MANAGEMENT.md](./08-STATE-MANAGEMENT.md) - Zustand store
- [09-STYLING-THEMING.md](./09-STYLING-THEMING.md) - Design system & theming
- [10-API-ROUTES.md](./10-API-ROUTES.md) - API endpoints

## Quick Start Guide

1. **Clone & Install**
   ```bash
   cd Shree-Portfolio/shree-portfolio
   npm install
   ```

2. **Set Environment Variables**
   - Copy `.env.local` and add your keys
   - OpenAI API key required
   - Supabase credentials required

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000
   - Chat interface loads on home page

4. **Populate Vector Store** (if needed)
   - Run embedding generation script
   - Index portfolio content in Supabase

## Common Tasks

### Adding a New Project
1. Edit `src/data/portfolio.ts`
2. Add project object to `projects` array
3. Follow `Project` type from `src/data/types.ts`
4. Reindex embeddings if vector store is active

### Modifying AI Behavior
1. Edit `src/lib/ai/config.ts` for model settings
2. Edit `src/lib/ai/prompts.ts` for system prompt
3. Adjust retrieval settings in `AI_CONFIG.retrieval`

### Changing Theme Colors
1. Edit `src/app/globals.css` for CSS variables
2. Modify `src/store/ui-store.ts` for available colors
3. Update `src/components/ui/theme-color-picker.tsx` for UI

### Adding New UI Components
1. Create in `src/components/ui/`
2. Follow Radix UI patterns for accessibility
3. Use `cn()` utility for conditional classes
4. Export from component file

## Performance Considerations

- **Streaming responses** prevent long waits
- **Minimum 2s loading** prevents flickering
- **Code splitting** via Next.js dynamic imports
- **Optimized animations** with Framer Motion
- **Rate limiting** prevents API abuse

## Accessibility Features

- Keyboard navigation (Cmd+K, Escape shortcuts)
- ARIA labels on interactive elements
- Focus management in modals/panels
- Semantic HTML structure
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Grid & Flexbox
- CSS Variables
- Intersection Observer API

## Known Limitations

1. Vector store may need initial population
2. No automated tests currently
3. Analytics not fully implemented
4. Image optimization not configured
5. No error boundaries for React errors

## Future Enhancements

- [ ] Add comprehensive test suite
- [ ] Implement analytics tracking
- [ ] Add error boundaries
- [ ] Optimize images
- [ ] Add response caching
- [ ] Implement A/B testing framework
- [ ] Add monitoring/logging (Sentry)
- [ ] SEO improvements (JSON-LD)

## Support & Contact

For questions about this codebase:
- Email: bohara@usc.edu
- GitHub: https://github.com/ShreeBohara
- LinkedIn: https://www.linkedin.com/in/shree-bohara/
