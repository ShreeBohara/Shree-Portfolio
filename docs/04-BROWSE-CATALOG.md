# Browse/Catalog Mode Documentation

## Overview

Browse mode provides a traditional portfolio view with filtering, sorting, and comparison features. Users can explore projects, experience, and education in a structured grid/list layout.

## File Location

`src/app/browse/page.tsx` - Browse page entry point

## Component Structure

```
Browse Page
└─ PortfolioLayout (showCatalog=true)
    ├─ Sidebar (section navigation)
    ├─ Header (quick links)
    ├─ Main Content
    │   ├─ SectionTabs (Projects/Experience/Education)
    │   └─ Active Section
    │       ├─ FilterBar (Projects only)
    │       └─ Content Grid/List
    │           └─ Cards[]
    └─ DetailsPanel (slide-in)
```

## Section Components

### 1. SectionTabs Component

**File:** `src/components/catalog/SectionTabs.tsx`

**Purpose:** Switch between Projects, Experience, and Education

**Props:**
```typescript
interface SectionTabsProps {
  activeSection: 'projects' | 'experience' | 'education';
  onSectionChange: (section: 'projects' | 'experience' | 'education') => void;
}
```

**Implementation:**
```typescript
export function SectionTabs({ activeSection, onSectionChange }) {
  return (
    <div className="flex items-center gap-2 border-b">
      <Button
        variant={activeSection === 'projects' ? 'default' : 'ghost'}
        onClick={() => onSectionChange('projects')}
      >
        <FolderKanban className="h-4 w-4 mr-2" />
        Projects
      </Button>
      
      <Button
        variant={activeSection === 'experience' ? 'default' : 'ghost'}
        onClick={() => onSectionChange('experience')}
      >
        <Briefcase className="h-4 w-4 mr-2" />
        Experience
      </Button>
      
      <Button
        variant={activeSection === 'education' ? 'default' : 'ghost'}
        onClick={() => onSectionChange('education')}
      >
        <GraduationCap className="h-4 w-4 mr-2" />
        Education
      </Button>
    </div>
  );
}
```

### 2. ProjectGrid Component

**File:** `src/components/catalog/ProjectGrid.tsx`

**Purpose:** Display projects with filtering, sorting, grouping, and comparison

**State:**
```typescript
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<'recent' | 'name' | 'impact'>('recent');
const [groupBy, setGroupBy] = useState<'none' | 'category' | 'year'>('none');
const [compareMode, setCompareMode] = useState(false);
const [compareItems, setCompareItems] = useState<string[]>([]);
```

**Features:**

#### a. Category Filtering

```typescript
// Available categories
const categories = ['AI/ML', 'Full-Stack', 'Data Engineering', 'Mobile', 'DevOps', 'Open Source'];

// Filter projects
const filteredProjects = projects.filter(project => {
  if (selectedCategories.length === 0) return true;
  return selectedCategories.includes(project.category);
});
```

**UI:**
```typescript
<div className="flex flex-wrap gap-2">
  {categories.map(category => (
    <Badge
      key={category}
      variant={selectedCategories.includes(category) ? 'default' : 'outline'}
      onClick={() => toggleCategory(category)}
      className="cursor-pointer"
    >
      {category}
    </Badge>
  ))}
</div>
```

#### b. Sorting

```typescript
function sortProjects(projects: Project[], sortBy: SortOption) {
  switch (sortBy) {
    case 'recent':
      return [...projects].sort((a, b) => b.year - a.year);
    
    case 'name':
      return [...projects].sort((a, b) => a.title.localeCompare(b.title));
    
    case 'impact':
      // Sort by number of metrics (proxy for impact)
      return [...projects].sort((a, b) => b.metrics.length - a.metrics.length);
    
    default:
      return projects;
  }
}
```

**UI:**
```typescript
<Select value={sortBy} onValueChange={setSortBy}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recent">Most Recent</SelectItem>
    <SelectItem value="name">Alphabetical</SelectItem>
    <SelectItem value="impact">By Impact</SelectItem>
  </SelectContent>
</Select>
```

#### c. Grouping

```typescript
function groupProjects(projects: Project[], groupBy: GroupOption) {
  if (groupBy === 'none') {
    return { 'All Projects': projects };
  }
  
  if (groupBy === 'category') {
    return projects.reduce((groups, project) => {
      const category = project.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(project);
      return groups;
    }, {} as Record<string, Project[]>);
  }
  
  if (groupBy === 'year') {
    return projects.reduce((groups, project) => {
      const year = project.year.toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(project);
      return groups;
    }, {} as Record<string, Project[]>);
  }
  
  return { 'All Projects': projects };
}
```

**UI:**
```typescript
{Object.entries(groupedProjects).map(([groupName, groupProjects]) => (
  <div key={groupName}>
    <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groupProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </div>
))}
```

#### d. Compare Mode

```typescript
// Toggle compare mode
function toggleCompareMode() {
  setCompareMode(!compareMode);
  setCompareItems([]);
}

// Select project for comparison
function toggleCompareItem(projectId: string) {
  if (compareItems.includes(projectId)) {
    setCompareItems(compareItems.filter(id => id !== projectId));
  } else if (compareItems.length < 2) {
    setCompareItems([...compareItems, projectId]);
  }
}

// Trigger comparison
function handleCompare() {
  if (compareItems.length === 2) {
    const [id1, id2] = compareItems;
    const project1 = projects.find(p => p.id === id1);
    const project2 = projects.find(p => p.id === id2);
    
    // Navigate to chat with compare query
    const query = `Compare ${project1.title} vs ${project2.title} - problem, approach, impact, and technologies`;
    router.push(`/?query=${encodeURIComponent(query)}`);
  }
}
```

**UI:**
```typescript
<div className="flex items-center gap-2">
  <Button
    variant={compareMode ? 'default' : 'outline'}
    onClick={toggleCompareMode}
  >
    <GitCompare className="h-4 w-4 mr-2" />
    Compare
  </Button>
  
  {compareMode && compareItems.length === 2 && (
    <Button onClick={handleCompare}>
      Compare Selected
    </Button>
  )}
</div>

{/* In ProjectCard */}
{compareMode && (
  <Checkbox
    checked={compareItems.includes(project.id)}
    onCheckedChange={() => toggleCompareItem(project.id)}
  />
)}
```

### 3. ProjectCard Component

**File:** `src/components/catalog/ProjectCard.tsx`

**Purpose:** Display individual project in grid/list

**Props:**
```typescript
interface ProjectCardProps {
  project: Project;
  compareMode?: boolean;
  isSelected?: boolean;
  onToggleCompare?: (id: string) => void;
}
```

**Layout:**
```typescript
export function ProjectCard({ project, compareMode, isSelected, onToggleCompare }) {
  const { setSelectedItem } = useUIStore();
  
  return (
    <motion.div
      className="border rounded-lg p-6 hover:border-accent-color/50 cursor-pointer"
      onClick={() => setSelectedItem(project.id, 'project')}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={getCategoryClass(project.category)}>
              {project.category}
            </Badge>
            <span>•</span>
            <span>{project.year}</span>
            <span>•</span>
            <span>{project.duration}</span>
          </div>
        </div>
        
        {compareMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleCompare?.(project.id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
      
      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {project.summary}
      </p>
      
      {/* Metrics Preview */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {project.metrics.slice(0, 2).map(metric => (
          <div key={metric.label} className="bg-muted/50 rounded p-2">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-sm font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      
      {/* Technologies */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies.slice(0, 4).map(tech => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{project.technologies.length - 4}
          </Badge>
        )}
      </div>
      
      {/* Links */}
      <div className="flex items-center gap-2">
        {project.links.live && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.links.live, '_blank');
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Live
          </Button>
        )}
        {project.links.github && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.links.github, '_blank');
            }}
          >
            <Github className="h-3 w-3 mr-1" />
            Code
          </Button>
        )}
      </div>
    </motion.div>
  );
}
```

**Category Styling:**
```typescript
function getCategoryClass(category: string) {
  const classes = {
    'AI/ML': 'category-ai',
    'Full-Stack': 'category-fullstack',
    'Data Engineering': 'category-data',
    'Mobile': 'category-mobile',
    'DevOps': 'category-devops',
    'Open Source': 'category-opensource',
  };
  return classes[category] || '';
}
```

### 4. ExperienceSection Component

**File:** `src/components/catalog/ExperienceSection.tsx`

**Purpose:** Display work experience in timeline format

**Layout:**
```typescript
export function ExperienceSection() {
  return (
    <div className="space-y-6">
      {experiences.map(experience => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}
```

### 5. ExperienceCard Component

**File:** `src/components/catalog/ExperienceCard.tsx`

**Props:**
```typescript
interface ExperienceCardProps {
  experience: Experience;
}
```

**Layout:**
```typescript
export function ExperienceCard({ experience }) {
  const { setSelectedItem } = useUIStore();
  
  return (
    <motion.div
      className="border rounded-lg p-6 hover:border-accent-color/50 cursor-pointer"
      onClick={() => setSelectedItem(experience.id, 'experience')}
      whileHover={{ x: 4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-xl mb-1">{experience.role}</h3>
          <p className="text-lg text-muted-foreground mb-2">{experience.company}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{experience.type}</Badge>
            <span>•</span>
            <span>{experience.location}</span>
            <span>•</span>
            <span>
              {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
            </span>
          </div>
        </div>
        
        {experience.current && (
          <Badge variant="default" className="bg-green-500">
            Current
          </Badge>
        )}
      </div>
      
      {/* Summary */}
      <p className="text-muted-foreground mb-4">{experience.summary}</p>
      
      {/* Highlights Preview */}
      <div className="space-y-2 mb-4">
        {experience.highlights.slice(0, 3).map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <span className="text-accent-color mt-1">•</span>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{highlight.text}</p>
              {highlight.metric && (
                <p className="text-sm font-semibold text-accent-color">
                  {highlight.metric}
                </p>
              )}
            </div>
          </div>
        ))}
        {experience.highlights.length > 3 && (
          <p className="text-sm text-muted-foreground">
            +{experience.highlights.length - 3} more achievements
          </p>
        )}
      </div>
      
      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {experience.technologies.slice(0, 6).map(tech => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
        {experience.technologies.length > 6 && (
          <Badge variant="secondary" className="text-xs">
            +{experience.technologies.length - 6}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
```

### 6. EducationSection Component

**File:** `src/components/catalog/EducationSection.tsx`

**Purpose:** Display education history

**Layout:**
```typescript
export function EducationSection() {
  return (
    <div className="space-y-6">
      {education.map(edu => (
        <EducationCard key={edu.id} education={edu} />
      ))}
    </div>
  );
}
```

### 7. EducationCard Component

**File:** `src/components/catalog/EducationCard.tsx`

**Props:**
```typescript
interface EducationCardProps {
  education: Education;
}
```

**Layout:**
```typescript
export function EducationCard({ education: edu }) {
  const { setSelectedItem } = useUIStore();
  
  return (
    <motion.div
      className="border rounded-lg p-6 hover:border-accent-color/50 cursor-pointer"
      onClick={() => setSelectedItem(edu.id, 'education')}
      whileHover={{ x: 4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-xl mb-1">{edu.degree}</h3>
          <p className="text-lg text-muted-foreground mb-2">{edu.field}</p>
          <p className="text-base text-muted-foreground mb-2">{edu.institution}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{edu.location}</span>
            <span>•</span>
            <span>{edu.startYear} - {edu.endYear}</span>
          </div>
        </div>
        
        {edu.gpa && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">GPA</p>
            <p className="text-lg font-semibold">{edu.gpa}</p>
          </div>
        )}
      </div>
      
      {/* Achievements */}
      {edu.achievements && edu.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Achievements</h4>
          <ul className="space-y-1">
            {edu.achievements.map((achievement, index) => (
              <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-accent-color">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Coursework */}
      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Relevant Coursework</h4>
          <div className="flex flex-wrap gap-2">
            {edu.relevantCoursework.map(course => (
              <Badge key={course} variant="secondary" className="text-xs">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
```

### 8. FilterBar Component

**File:** `src/components/catalog/FilterBar.tsx`

**Purpose:** Unified filter/sort/group controls for projects

**Props:**
```typescript
interface FilterBarProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  groupBy: GroupOption;
  onGroupChange: (group: GroupOption) => void;
  compareMode: boolean;
  onCompareModeToggle: () => void;
  compareCount: number;
  onCompare: () => void;
}
```

**Layout:**
```typescript
export function FilterBar({
  selectedCategories,
  onCategoriesChange,
  sortBy,
  onSortChange,
  groupBy,
  onGroupChange,
  compareMode,
  onCompareModeToggle,
  compareCount,
  onCompare,
}) {
  return (
    <div className="space-y-4 mb-6">
      {/* Category Filters */}
      <div>
        <label className="text-sm font-medium mb-2 block">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? 'default' : 'outline'}
              onClick={() => {
                if (selectedCategories.includes(category)) {
                  onCategoriesChange(selectedCategories.filter(c => c !== category));
                } else {
                  onCategoriesChange([...selectedCategories, category]);
                }
              }}
              className="cursor-pointer"
            >
              {category}
            </Badge>
          ))}
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoriesChange([])}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Sort, Group, Compare */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort:</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
              <SelectItem value="impact">By Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Group */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Group:</label>
          <Select value={groupBy} onValueChange={onGroupChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="year">By Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Compare */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={compareMode ? 'default' : 'outline'}
            onClick={onCompareModeToggle}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare
          </Button>
          
          {compareMode && compareCount === 2 && (
            <Button onClick={onCompare}>
              Compare Selected
            </Button>
          )}
          
          {compareMode && (
            <span className="text-sm text-muted-foreground">
              {compareCount}/2 selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 9. CompareView Component

**File:** `src/components/catalog/CompareView.tsx`

**Purpose:** Side-by-side comparison of two projects

**Props:**
```typescript
interface CompareViewProps {
  project1: Project;
  project2: Project;
  onClose: () => void;
}
```

**Layout:**
```typescript
export function CompareView({ project1, project2, onClose }) {
  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="container max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Project Comparison</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Project 1 */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{project1.title}</h3>
              <Badge variant="outline">{project1.category}</Badge>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Problem</h4>
                  <p className="text-sm text-muted-foreground">{project1.problem}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Approach</h4>
                  <p className="text-sm text-muted-foreground">{project1.approach}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Impact</h4>
                  <p className="text-sm text-muted-foreground">{project1.impact}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project1.metrics.map(metric => (
                      <div key={metric.label} className="bg-muted/50 rounded p-2">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="text-sm font-semibold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project1.technologies.map(tech => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Project 2 */}
          <div className="space-y-6">
            {/* Same structure as Project 1 */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Animations

### Card Hover Effects

```typescript
// ProjectCard
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>

// ExperienceCard & EducationCard
<motion.div
  whileHover={{ x: 4 }}
  transition={{ duration: 0.2 }}
>
```

### Entrance Animations

```typescript
// Staggered card entrance
{projects.map((project, index) => (
  <motion.div
    key={project.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
  >
    <ProjectCard project={project} />
  </motion.div>
))}
```

## Responsive Design

### Grid Breakpoints

```typescript
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Filter Bar Mobile

```typescript
// Stack vertically on mobile
<div className="flex items-center gap-4 flex-wrap">
  {/* Controls wrap to new lines */}
</div>
```

## Performance Optimizations

1. **Memoization:** Memoize filtered/sorted/grouped results
2. **Virtual Scrolling:** (Not implemented, but recommended for 50+ items)
3. **Lazy Loading:** Load images on demand
4. **Debounced Filtering:** Debounce filter changes

## Accessibility

1. **Keyboard Navigation:** Tab through cards, Enter to open
2. **ARIA Labels:** All interactive elements labeled
3. **Focus Indicators:** Clear focus states
4. **Screen Reader:** Semantic HTML, proper headings

## Common Patterns

### Opening Details Panel

```typescript
const { setSelectedItem } = useUIStore();

// In card click handler
onClick={() => setSelectedItem(project.id, 'project')}
```

### Navigating to Chat with Context

```typescript
const router = useRouter();
const { setChatContext } = useUIStore();

// Set context and navigate
setChatContext({ enabled: true, itemId: project.id, itemType: 'project' });
router.push('/');
```

### Filtering by Multiple Criteria

```typescript
const filteredProjects = projects.filter(project => {
  // Category filter
  if (selectedCategories.length > 0 && !selectedCategories.includes(project.category)) {
    return false;
  }
  
  // Year filter (if implemented)
  if (selectedYears.length > 0 && !selectedYears.includes(project.year)) {
    return false;
  }
  
  // Search filter (if implemented)
  if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
    return false;
  }
  
  return true;
});
```

## Future Enhancements

1. **Search Bar:** Full-text search across all fields
2. **Advanced Filters:** Year range, technology stack, team size
3. **View Modes:** Grid vs List toggle
4. **Bookmarks:** Save favorite projects
5. **Export:** Export filtered results as PDF/CSV
6. **Pagination:** For large datasets
7. **Infinite Scroll:** Load more on scroll
8. **Quick Actions:** Hover menu with actions
