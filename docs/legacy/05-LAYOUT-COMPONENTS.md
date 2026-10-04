# Layout Components Documentation

## Overview

Layout components provide the structural foundation for the portfolio, including the header, sidebar, and details panel. They handle navigation, responsive behavior, and global UI state.

## Component Structure

```
PortfolioLayout
├── Sidebar (left, collapsible)
├── Header (top, fixed)
├── Main Content (center, scrollable)
└── DetailsPanel (right, slide-in)
```

## 1. PortfolioLayout Component

**File:** `src/components/layout/PortfolioLayout.tsx`

**Purpose:** Root layout wrapper that orchestrates all layout components

**Props:**
```typescript
interface PortfolioLayoutProps {
  children: React.ReactNode;
  showCatalog?: boolean;  // Show browse mode vs chat mode
  initialSection?: 'projects' | 'experience' | 'education';
}
```

**Implementation:**
```typescript
export function PortfolioLayout({ children, showCatalog = false, initialSection = 'projects' }) {
  const { isDetailsPanelOpen, isSidebarOpen, isInitialAnimationComplete } = useUIStore();
  const [activeSection, setActiveSection] = useState(initialSection);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Full height, animated entrance */}
      <AnimatePresence>
        {isInitialAnimationComplete && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sidebar
              activeSection={showCatalog ? activeSection : undefined}
              onSectionChange={showCatalog ? setActiveSection : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main layout - starts after sidebar */}
      <div className={cn(
        "flex flex-col h-screen transition-all duration-500",
        isInitialAnimationComplete && (isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-[60px]")
      )}>
        {/* Header - animated entrance */}
        <AnimatePresence>
          {isInitialAnimationComplete && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Header />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content area */}
        <main className={cn(
          "flex-1 transition-all duration-300 pt-[var(--header-height)]",
          isDetailsPanelOpen && "lg:mr-[400px]"
        )}>
          <div className="h-full overflow-y-auto">
            {showCatalog ? (
              <div className="flex flex-col h-full">
                <div className="px-6 lg:px-8 pt-6">
                  <SectionTabs
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                </div>
                <div className="flex-1 px-6 lg:px-8 py-6">
                  {activeSection === 'projects' && <ProjectGrid />}
                  {activeSection === 'experience' && <ExperienceSection />}
                  {activeSection === 'education' && <EducationSection />}
                </div>
              </div>
            ) : (
              <div className="h-full">{children}</div>
            )}
          </div>
        </main>
        
        {/* Details panel */}
        <DetailsPanel />
      </div>
    </div>
  );
}
```

**Key Features:**

1. **Responsive Margins:** Adjusts main content margin based on sidebar state
2. **Animated Entrance:** Staggered animations for sidebar, header, and content
3. **Conditional Rendering:** Shows catalog or chat based on `showCatalog` prop
4. **Details Panel Space:** Reserves space on desktop when panel is open

## 2. Header Component

**File:** `src/components/layout/Header.tsx`

**Purpose:** Top navigation bar with quick links, theme controls, and navigation tabs

**State:**
```typescript
const { toggleSidebar, isSidebarOpen, theme, toggleTheme, triggerNewChat } = useUIStore();
const pathname = usePathname();
const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');
```

**Layout:**
```typescript
export function Header() {
  return (
    <header className={cn(
      "fixed top-0 right-0 z-40 bg-background/80 backdrop-blur-sm",
      "header-height left-0 transition-all duration-300",
      isSidebarOpen ? "lg:left-[280px]" : "lg:left-[60px]"
    )}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Navigation tabs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Navigation tabs */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/" onClick={handleChatClick}>Chat</Link>
            </Button>
            <Button
              variant={pathname === '/browse' ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/browse">Browse</Link>
            </Button>
          </div>
        </div>
        
        {/* Right side - Actions and Theme toggle */}
        <div className="flex items-center gap-3">
          {/* Links dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md">
                <span>Links</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={personalInfo.links.resume.pdf} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={personalInfo.links.linkedin} target="_blank">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={personalInfo.links.github} target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Book a Call - Primary CTA */}
          <a
            href={personalInfo.links.calendar}
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-color hover:bg-accent-color/90"
          >
            <Calendar className="h-4 w-4" />
            <span>Book a Call</span>
          </a>
          
          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-border" />
          
          {/* Tools section */}
          <div className="flex items-center gap-1">
            {/* Theme Color Picker */}
            <ThemeColorPicker />
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-md flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

**Key Features:**

1. **Navigation Tabs:** Chat/Browse toggle with active state
2. **Links Dropdown:** Resume, LinkedIn, GitHub (desktop only)
3. **Primary CTA:** Book a Call button (prominent, desktop only)
4. **Theme Controls:** Color picker + dark/light toggle
5. **Mobile Menu:** Hamburger icon to toggle sidebar
6. **New Chat Trigger:** Clicking "Chat" when already on chat page starts new conversation

**Responsive Behavior:**
- Mobile: Show hamburger menu, hide links dropdown and CTA
- Desktop: Show all controls, hide hamburger menu

**Hover Effects:**
```typescript
// Dropdown items change color on hover
onMouseEnter={(e) => {
  e.currentTarget.style.color = accentColor;
  e.currentTarget.style.backgroundColor = accentColor.replace(')', ' / 0.1)');
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = '';
  e.currentTarget.style.backgroundColor = '';
}}
```

## 3. Sidebar Component

**File:** `src/components/layout/Sidebar.tsx`

**Purpose:** Left navigation panel with section tabs and quick action icons

**Props:**
```typescript
interface SidebarProps {
  activeSection?: 'projects' | 'experience' | 'education';
  onSectionChange?: (section: 'projects' | 'experience' | 'education') => void;
}
```

**Layout:**
```typescript
export function Sidebar({ activeSection, onSectionChange }) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const isBrowsePage = pathname === '/browse';
  
  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r transition-all duration-300",
        isSidebarOpen ? "w-[280px]" : "w-0 lg:w-[60px]"
      )}>
        <div className={cn(
          "h-full flex flex-col",
          !isSidebarOpen && "lg:items-center"
        )}>
          {/* Logo/Brand at top */}
          <div className={cn(
            "border-b h-[var(--header-height)] flex items-center overflow-hidden",
            isSidebarOpen ? "px-4 justify-between" : "lg:px-2 lg:justify-center"
          )}>
            {isSidebarOpen && (
              <h2 className="text-lg font-semibold">
                {personalInfo.name.split(' ')[0]}
              </h2>
            )}
            
            {/* Toggle button - desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className={cn(
                "hidden lg:flex h-8 w-8 shrink-0",
                !isSidebarOpen && "mx-auto"
              )}
            >
              {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
          
          {/* Section tabs */}
          <TooltipProvider delayDuration={300}>
            <div className={cn(
              "flex flex-col gap-1 p-4",
              !isSidebarOpen && "lg:p-2"
            )}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isBrowsePage && activeSection === 'projects' ? 'secondary' : 'ghost'}
                    size={isSidebarOpen ? 'sm' : 'icon'}
                    onClick={() => handleSectionClick('projects')}
                    className={cn(
                      "justify-start shrink-0",
                      !isSidebarOpen && "lg:justify-center lg:w-10"
                    )}
                  >
                    <Folder className="h-4 w-4 shrink-0" />
                    {isSidebarOpen && <span className="ml-2">Projects</span>}
                  </Button>
                </TooltipTrigger>
                {!isSidebarOpen && (
                  <TooltipContent side="right">
                    <p>Projects</p>
                  </TooltipContent>
                )}
              </Tooltip>
              
              {/* Experience and Education buttons (same pattern) */}
            </div>
          </TooltipProvider>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Quick Actions - at bottom */}
          <TooltipProvider delayDuration={300}>
            <div className={cn(
              "border-t mt-auto",
              isSidebarOpen ? "px-4 py-3" : "hidden lg:block px-2 py-3"
            )}>
              <div className={cn(
                "flex items-center",
                isSidebarOpen ? "gap-2" : "flex-col gap-2"
              )}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={personalInfo.links.resume.pdf} target="_blank">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Resume</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* GitHub, LinkedIn, Calendar, Email icons (same pattern) */}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
}
```

**Key Features:**

1. **Collapsible:** Expands to 280px, collapses to 60px (desktop) or 0px (mobile)
2. **Section Navigation:** Projects, Experience, Education tabs
3. **Quick Actions:** Resume, GitHub, LinkedIn, Calendar, Email icons at bottom
4. **Tooltips:** Show labels when collapsed (desktop only)
5. **Mobile Backdrop:** Dismisses sidebar when clicking outside
6. **Smart Navigation:** If on browse page, changes section; if on chat page, navigates to browse

**Section Click Handler:**
```typescript
function handleSectionClick(section: Section) {
  if (isBrowsePage && onSectionChange) {
    // Already on browse page, just change section
    onSectionChange(section);
  } else {
    // On chat page, navigate to browse with section
    router.push(`/browse?section=${section}`);
  }
}
```

**Responsive States:**
- **Mobile (< 1024px):**
  - Closed: `w-0` (hidden)
  - Open: `w-[280px]` (full width with backdrop)
  
- **Desktop (≥ 1024px):**
  - Closed: `w-[60px]` (icon-only)
  - Open: `w-[280px]` (full width with labels)

## 4. DetailsPanel Component

**File:** `src/components/layout/DetailsPanel.tsx`

**Purpose:** Slide-in panel from right showing full details of selected item

**State:**
```typescript
const {
  isDetailsPanelOpen,
  closeDetailsPanel,
  selectedItemId,
  selectedItemType,
  setChatContext
} = useUIStore();

const selectedItem = selectedItemId && selectedItemType === 'project'
  ? projects.find(p => p.id === selectedItemId)
  : selectedItemType === 'experience'
  ? experiences.find(e => e.id === selectedItemId)
  : selectedItemType === 'education'
  ? education.find(e => e.id === selectedItemId)
  : null;
```

**Layout:**
```typescript
export function DetailsPanel() {
  return (
    <AnimatePresence>
      {isDetailsPanelOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeDetailsPanel}
          />
          
          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className={cn(
              "fixed right-0 top-0 z-40 h-full bg-background border-l",
              "w-full sm:w-[480px] lg:w-[400px]",
              "flex flex-col"
            )}
          >
            {renderContent()}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Content Structure (Project):**
```typescript
function renderContent() {
  if (selectedItemType === 'project') {
    const project = selectedItem as Project;
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeDetailsPanel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title and summary */}
            <div>
              <h2 className="heading-2 mb-2">{project.title}</h2>
              <p className="text-muted-foreground">{project.summary}</p>
            </div>
            
            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3">
              {project.metrics.map(metric => (
                <div key={metric.label} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
            
            {/* Problem, Approach, Impact */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Problem</h3>
                <p className="text-sm text-muted-foreground">{project.problem}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Approach</h3>
                <p className="text-sm text-muted-foreground">{project.approach}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Impact</h3>
                <p className="text-sm text-muted-foreground">{project.impact}</p>
              </div>
            </div>
            
            {/* My Role */}
            <div>
              <h3 className="font-medium mb-1">My Role</h3>
              <p className="text-sm text-muted-foreground">{project.myRole}</p>
            </div>
            
            {/* Technologies */}
            <div>
              <h3 className="font-medium mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div className="flex flex-col gap-2">
              {project.links.live && (
                <Button variant="outline" asChild>
                  <a href={project.links.live} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.links.github && (
                <Button variant="outline" asChild>
                  <a href={project.links.github} target="_blank">
                    <Github className="h-4 w-4 mr-2" />
                    View Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-4 border-t space-y-2">
          <Button className="w-full bg-accent-color" onClick={handleAskAbout}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask about this project
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={personalInfo.links.calendar} target="_blank">
              <Calendar className="h-4 w-4 mr-2" />
              Book a call to discuss
            </a>
          </Button>
        </div>
      </>
    );
  }
  // Similar structure for experience and education
}
```

**"Ask About" Handler:**
```typescript
function handleAskAbout() {
  if (selectedItemId && selectedItemType) {
    // Set chat context
    setChatContext({
      enabled: true,
      itemId: selectedItemId,
      itemType: selectedItemType,
    });
    
    // Navigate to chat page
    router.push('/');
    
    // Close the details panel
    closeDetailsPanel();
  }
}
```

**Key Features:**

1. **Slide-in Animation:** Spring animation from right
2. **Responsive Width:** Full width on mobile, 480px on tablet, 400px on desktop
3. **Scrollable Content:** Header and footer fixed, content scrolls
4. **Context Actions:** "Ask about this" sets chat context and navigates
5. **External Links:** Live demo, GitHub, case study (if available)
6. **Mobile Backdrop:** Dismisses panel when clicking outside

**URL Rendering:**
```typescript
// Helper to render text with clickable URLs
function renderTextWithLinks(text: string) {
  const urlRegex = /((?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex) && (part.includes('.com') || part.includes('.org') || part.includes('.net') || part.includes('.io'))) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-color hover:text-accent-color/80 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
```

## CSS Variables

**Header Height:**
```css
:root {
  --header-height: 64px;
}
```

**Usage:**
```typescript
className="h-[var(--header-height)]"
className="pt-[var(--header-height)]"
```

## Responsive Breakpoints

```typescript
// Mobile: < 640px
// Tablet: 640px - 1024px
// Desktop: ≥ 1024px

// Sidebar
"w-0 lg:w-[60px]"  // Hidden on mobile, icon-only on desktop

// Header
"lg:hidden"  // Hide on desktop
"hidden sm:flex"  // Hide on mobile, show on tablet+

// Details Panel
"w-full sm:w-[480px] lg:w-[400px]"  // Full on mobile, fixed on tablet+
```

## Animations

**Sidebar Entrance:**
```typescript
<motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

**Header Entrance:**
```typescript
<motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
>
```

**Details Panel Slide:**
```typescript
<motion.aside
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 20 }}
>
```

## Accessibility

1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Enter to activate buttons/links
   - Escape to close panels

2. **ARIA Labels:**
   - `aria-label="Toggle sidebar"`
   - `aria-label="Close details panel"`
   - `aria-label="Toggle theme"`

3. **Focus Management:**
   - Focus trap in mobile sidebar
   - Focus returns to trigger after closing panel

4. **Screen Reader:**
   - Semantic HTML (header, aside, nav, main)
   - Proper heading hierarchy
   - Descriptive link text

## Common Patterns

### Opening Details Panel from Card

```typescript
// In ProjectCard, ExperienceCard, EducationCard
const { setSelectedItem } = useUIStore();

onClick={() => setSelectedItem(item.id, 'project')}
```

### Closing Details Panel

```typescript
const { closeDetailsPanel } = useUIStore();

onClick={closeDetailsPanel}
```

### Toggling Sidebar

```typescript
const { toggleSidebar, setSidebarOpen } = useUIStore();

// Toggle
onClick={toggleSidebar}

// Set explicitly
onClick={() => setSidebarOpen(false)}
```

### Navigating with Context

```typescript
const router = useRouter();
const { setChatContext } = useUIStore();

function handleAskAbout() {
  setChatContext({ enabled: true, itemId, itemType });
  router.push('/');
  closeDetailsPanel();
}
```

## Performance Considerations

1. **Conditional Rendering:** Only render sidebar/header after initial animation
2. **Backdrop Optimization:** Use `backdrop-blur-sm` sparingly
3. **Smooth Transitions:** Use CSS transitions for width/margin changes
4. **Spring Animations:** Use Framer Motion spring for natural feel

## Testing Recommendations

```typescript
describe('PortfolioLayout', () => {
  it('should render sidebar and header after animation', async () => {
    const { setInitialAnimationComplete } = useUIStore.getState();
    render(<PortfolioLayout>Content</PortfolioLayout>);
    
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    
    act(() => setInitialAnimationComplete(true));
    
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
  
  it('should adjust margins when sidebar opens', () => {
    const { setSidebarOpen } = useUIStore.getState();
    render(<PortfolioLayout>Content</PortfolioLayout>);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('lg:ml-[60px]');
    
    act(() => setSidebarOpen(true));
    
    expect(main).toHaveClass('lg:ml-[280px]');
  });
});
```
