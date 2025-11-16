# Portfolio Documentation

Complete technical documentation for Shree Bohara's AI-powered portfolio website.



## Quick Navigation

### Getting Started
- **[00-OVERVIEW.md](./00-OVERVIEW.md)** - Project summary, tech stack, quick start guide
- **[01-ARCHITECTURE.md](./01-ARCHITECTURE.md)** - System architecture, data flow, component hierarchy

### Core Systems
- **[02-AI-RAG-SYSTEM.md](./02-AI-RAG-SYSTEM.md)** - AI/RAG implementation, embeddings, vector search, prompts
- **[08-STATE-MANAGEMENT.md](./08-STATE-MANAGEMENT.md)** - Zustand store, state flows, patterns

### User Interface
- **[03-CHAT-INTERFACE.md](./03-CHAT-INTERFACE.md)** - Chat UI, streaming, animations, keyboard shortcuts
- **[04-BROWSE-CATALOG.md](./04-BROWSE-CATALOG.md)** - Browse mode, filtering, sorting, comparison
- **[05-LAYOUT-COMPONENTS.md](./05-LAYOUT-COMPONENTS.md)** - Header, sidebar, details panel
- **[06-UI-COMPONENTS.md](./06-UI-COMPONENTS.md)** - Reusable components, buttons, inputs, cards

### Data & Styling
- **[07-DATA-MODEL.md](./07-DATA-MODEL.md)** - Portfolio data structure, types, content guidelines
- **[09-STYLING-THEMING.md](./09-STYLING-THEMING.md)** - Tailwind CSS, theming, animations, responsive design

### Backend
- **[10-API-ROUTES.md](./10-API-ROUTES.md)** - API endpoints, streaming, rate limiting, security

## Documentation Structure

```
docs/
├── README.md                    # This file
├── 00-OVERVIEW.md              # Project overview
├── 01-ARCHITECTURE.md          # System architecture
├── 02-AI-RAG-SYSTEM.md         # AI/RAG implementation
├── 03-CHAT-INTERFACE.md        # Chat UI components
├── 04-BROWSE-CATALOG.md        # Browse mode components
├── 05-LAYOUT-COMPONENTS.md     # Layout structure
├── 06-UI-COMPONENTS.md         # Reusable UI components
├── 07-DATA-MODEL.md            # Data structure & types
├── 08-STATE-MANAGEMENT.md      # Zustand store
├── 09-STYLING-THEMING.md       # Styling & theming
└── 10-API-ROUTES.md            # API endpoints
```

## Key Concepts

### Chat-First Interface
The portfolio's primary interaction is conversational. Users ask natural language questions about projects, experience, and skills. The AI assistant (powered by GPT-4o-mini + RAG) provides contextual answers with citations.

### RAG (Retrieval-Augmented Generation)
1. User query → generate embedding
2. Search vector store (Supabase pgvector)
3. Retrieve top 15 relevant chunks
4. Build prompt with context
5. Stream GPT-4o-mini response
6. Display with citations

### Context-Aware Chat
Users can focus chat on specific items (projects, experiences, education). The system filters RAG retrieval and adapts prompt suggestions accordingly.

### Browse Mode
Traditional portfolio view with:
- Filterable/sortable project grid
- Experience timeline
- Education history
- Details panel with full information
- Compare mode for projects

### State Management
Zustand store manages:
- UI state (sidebar, details panel, chat context)
- Theme preferences (dark/light, accent color)
- Animation state
- View preferences

### Theming
- Dark/light mode toggle
- 8 accent colors (teal, blue, pink, orange, yellow, green, red, violet)
- CSS variables for theme-aware colors
- Smooth transitions and animations

## Common Tasks

### Adding a New Project
1. Edit `src/data/portfolio.ts`
2. Add project object to `projects` array
3. Follow `Project` type from `src/data/types.ts`
4. Reindex embeddings (if vector store active)

See: [07-DATA-MODEL.md](./07-DATA-MODEL.md#adding-a-new-project)

### Modifying AI Behavior
1. Edit `src/lib/ai/config.ts` for model settings
2. Edit `src/lib/ai/prompts.ts` for system prompt
3. Adjust retrieval settings in `AI_CONFIG.retrieval`

See: [02-AI-RAG-SYSTEM.md](./02-AI-RAG-SYSTEM.md#configuration-configts)

### Changing Theme Colors
1. Edit `src/app/globals.css` for CSS variables
2. Modify `src/store/ui-store.ts` for available colors
3. Update `src/components/ui/theme-color-picker.tsx` for UI

See: [09-STYLING-THEMING.md](./09-STYLING-THEMING.md#accent-colors)

### Adding New UI Components
1. Create in `src/components/ui/`
2. Follow Radix UI patterns for accessibility
3. Use `cn()` utility for conditional classes
4. Export from component file

See: [06-UI-COMPONENTS.md](./06-UI-COMPONENTS.md)

### Debugging Chat Issues
1. Check browser console for errors
2. Verify environment variables (OpenAI, Supabase)
3. Test vector store availability
4. Check rate limiting (20 requests/hour)
5. Inspect network tab for API responses

See: [02-AI-RAG-SYSTEM.md](./02-AI-RAG-SYSTEM.md#debugging--logging)

## Architecture Diagrams

### High-Level Flow
```
User → Chat Interface → API Route → RAG System → OpenAI
                                   ↓
                              Vector Store (Supabase)
```

### Component Hierarchy
```
PortfolioLayout
├── Sidebar (collapsible)
├── Header (fixed top)
├── Main Content
│   ├── ChatInterface (home page)
│   └── Browse Mode (browse page)
│       ├── ProjectGrid
│       ├── ExperienceSection
│       └── EducationSection
└── DetailsPanel (slide-in right)
```

### State Flow
```
User Action → Zustand Store → Component Re-render
                ↓
         localStorage (persist theme/preferences)
```

## Tech Stack Summary

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Radix UI

**State:**
- Zustand with persistence

**AI/Backend:**
- OpenAI GPT-4o-mini
- text-embedding-3-small
- Supabase (PostgreSQL + pgvector)

**Deployment:**
- Vercel (recommended)

## Development Workflow

### 1. Setup
```bash
cd Shree-Portfolio/shree-portfolio
npm install
```

### 2. Environment Variables
Create `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 3. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 4. Make Changes
- Edit files in `src/`
- Hot reload updates automatically
- Check browser console for errors

### 5. Test
- Manual testing in browser
- Check both light/dark themes
- Test all accent colors
- Verify mobile responsiveness

### 6. Build for Production
```bash
npm run build
npm start
```

### 7. Deploy
Push to GitHub → Vercel auto-deploys

## Performance Optimization

### Current Optimizations
- Streaming responses (reduces perceived latency)
- Minimum 2s loading (prevents flickering)
- Code splitting (Next.js automatic)
- Optimized animations (Framer Motion)
- Rate limiting (prevents API abuse)

### Recommended Additions
- Response caching (common queries)
- Image optimization (Next.js Image)
- Virtual scrolling (large lists)
- Lazy loading (off-screen components)
- Service worker (offline support)

See: [01-ARCHITECTURE.md](./01-ARCHITECTURE.md#performance-optimizations)

## Security Considerations

### Current Measures
- API keys server-side only
- Rate limiting (20 requests/hour per IP)
- Input validation (query length, type)
- Parameterized queries (Supabase)
- React auto-escapes, ReactMarkdown sanitizes

### Recommended Additions
- Authentication (user accounts)
- CSRF protection
- Content Security Policy
- API key rotation
- Monitoring/alerting

See: [10-API-ROUTES.md](./10-API-ROUTES.md#security)

## Accessibility

### Features
- Keyboard navigation (Tab, Enter, Escape, Cmd+K)
- ARIA labels on interactive elements
- Focus management in modals/panels
- Semantic HTML structure
- Color contrast compliance (WCAG AA)
- Screen reader friendly

### Testing
- Test with keyboard only
- Use screen reader (VoiceOver, NVDA)
- Check color contrast
- Verify focus indicators
- Test with zoom (200%)

See: [03-CHAT-INTERFACE.md](./03-CHAT-INTERFACE.md#accessibility)

## Troubleshooting

### Common Issues

**Chat not responding:**
- Check OpenAI API key
- Verify Supabase connection
- Check rate limiting
- Inspect browser console

**Vector store not working:**
- Verify Supabase credentials
- Check pgvector extension installed
- Run reindex endpoint
- Check embeddings table

**Styling issues:**
- Clear browser cache
- Check Tailwind config
- Verify CSS variables
- Test in different browsers

**State not persisting:**
- Check localStorage
- Verify Zustand persist config
- Clear localStorage and retry

See individual documentation files for detailed troubleshooting.

## Contributing

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Tailwind utility classes
- `cn()` for conditional classes
- Explicit types (avoid `any`)

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Submit PR with description

## Resources

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Radix UI Docs](https://www.radix-ui.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [Vercel](https://vercel.com) - Deployment
- [Cursor](https://cursor.sh) - AI-powered IDE
- [Figma](https://figma.com) - Design
- [Calendly](https://calendly.com) - Scheduling

## Support

For questions or issues:
- Email: bohara@usc.edu
- GitHub: https://github.com/ShreeBohara
- LinkedIn: https://www.linkedin.com/in/shree-bohara/

## License

This is a personal portfolio project. All rights reserved.

---

**Last Updated:** January 2025

**Documentation Version:** 1.0

**Codebase Version:** 0.1.0
