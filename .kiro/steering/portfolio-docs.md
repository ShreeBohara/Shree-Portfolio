---
inclusion: always
---

---
inclusion: always
---

# Portfolio Project Guidelines

## Project Context
AI-powered portfolio with Next.js 14, TypeScript, Tailwind, Zustand, OpenAI RAG system, and Supabase vector store. Two main modes: chat interface and browse catalog.

## Documentation Structure
Reference `/docs` folder before making changes. Map your task to the right doc:

- AI/RAG/Chat → `02-AI-RAG-SYSTEM.md`, `03-CHAT-INTERFACE.md`
- Browse/Catalog → `04-BROWSE-CATALOG.md`
- Layout/Navigation → `05-LAYOUT-COMPONENTS.md`
- UI Components → `06-UI-COMPONENTS.md`
- Data Models → `07-DATA-MODEL.md`
- State → `08-STATE-MANAGEMENT.md`
- Styling/Themes → `09-STYLING-THEMING.md`
- API Routes → `10-API-ROUTES.md`
- Architecture → `01-ARCHITECTURE.md`

Update docs only for significant changes (new features, architecture changes, API modifications). Skip for minor fixes or styling tweaks.

## Code Standards

### TypeScript
- Strict mode enabled - no `any` types
- Explicit return types for functions
- Proper interface/type definitions
- Use type inference where obvious

### React/Next.js
- Functional components with hooks
- Server components by default, client components only when needed (`'use client'`)
- Async server components for data fetching
- File-based routing in `src/app`

### State Management (Zustand)
- Use selectors: `const theme = useUIStore((state) => state.theme)`
- Never destructure entire store: `const { theme } = useUIStore()` ❌
- Persist only user preferences, not transient UI state
- Keep state flat and normalized

### Styling (Tailwind)
- Use utility classes first, custom CSS only when necessary
- CSS variables for theme colors: `var(--theme-primary)`
- Consistent spacing with Tailwind scale (4, 8, 12, 16, etc.)
- Always test dark mode - use `dark:` prefix
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints

### AI/RAG System
- Stream responses for better UX
- Limit context to top 15 relevant chunks
- Graceful degradation when vector store unavailable
- Keep prompts structured and concise
- Use semantic chunking for embeddings

### Component Patterns
- Co-locate related components in feature folders (`/chat`, `/catalog`, `/layout`)
- Descriptive naming: `handleSubmitQuery` not `submit`
- Extract reusable logic to custom hooks
- Use shadcn/ui components from `/components/ui`

### Performance
- Memoize expensive computations with `useMemo`
- Optimize re-renders with `useCallback` and Zustand selectors
- Lazy load heavy components
- Optimize images with Next.js `<Image>`

### Data Structure
- Projects/Experience: Problem → Approach → Impact format
- Include quantified metrics (percentages, time saved, etc.)
- Keep summaries concise (2-3 lines)
- Use SEO-friendly keywords

## Development Workflow

### Before Making Changes
1. Check relevant doc file for current implementation
2. Look at similar existing components for patterns
3. Verify TypeScript types are correct
4. Ask user if requirements are unclear

### After Making Changes
1. Run `getDiagnostics` to check for errors
2. Test both light and dark themes
3. Verify responsive behavior
4. Update docs if change is significant

### Testing Checklist
- No TypeScript errors or warnings
- No console errors
- Works in light and dark mode
- Responsive on mobile/tablet/desktop
- Proper loading and error states

## API Routes
- Located in `src/app/api`
- Use Next.js 14 Route Handlers
- Return proper HTTP status codes
- Handle errors gracefully with try/catch
- Rate limit external API calls

## Environment Variables
- Store in `.env.local` (not committed)
- Required: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Access with `process.env.VARIABLE_NAME`

## Key Principles
- **Ask when uncertain** - Don't guess or assume
- **Follow existing patterns** - Consistency over cleverness
- **Keep it maintainable** - Future developers will thank you
- **Incremental changes** - Small PRs over big rewrites
- **User preferences matter** - Persist theme, layout choices
