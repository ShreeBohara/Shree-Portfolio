# UI Components Documentation

## Overview

UI components are reusable, accessible primitives built on Radix UI. They follow a consistent API pattern and support theming through CSS variables.

## Component Location

`src/components/ui/` - All reusable UI components

## Design Principles

1. **Accessibility First:** Built on Radix UI primitives with ARIA support
2. **Composable:** Small, focused components that work together
3. **Themeable:** Use CSS variables for colors, support accent color
4. **Type-Safe:** Full TypeScript support with proper prop types
5. **Flexible:** Accept `className` prop for customization

## Core Components

### 1. Button

**File:** `src/components/ui/button.tsx`

**Variants:**
- `default` - Primary button (accent color background)
- `destructive` - Danger actions (red)
- `outline` - Secondary button (border only)
- `secondary` - Tertiary button (muted background)
- `ghost` - Minimal button (no background)
- `link` - Text link style

**Sizes:**
- `default` - Standard size (h-10 px-4 py-2)
- `sm` - Small (h-9 px-3)
- `lg` - Large (h-11 px-8)
- `icon` - Square icon button (h-10 w-10)

**Usage:**
```typescript
import { Button } from '@/components/ui/button';

// Basic
<Button>Click me</Button>

// With variant and size
<Button variant="outline" size="sm">
  Small Outline
</Button>

// As link (using asChild)
<Button asChild>
  <Link href="/browse">Browse</Link>
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <X className="h-4 w-4" />
</Button>
```

**Implementation:**
```typescript
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent-color text-white hover:bg-accent-color/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### 2. Badge

**File:** `src/components/ui/badge.tsx`

**Variants:**
- `default` - Primary badge (accent color)
- `secondary` - Muted badge
- `destructive` - Error badge
- `outline` - Border only

**Usage:**
```typescript
import { Badge } from '@/components/ui/badge';

<Badge>New</Badge>
<Badge variant="secondary">AI/ML</Badge>
<Badge variant="outline">2024</Badge>
```

### 3. Card

**File:** `src/components/ui/card.tsx`

**Sub-components:**
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content
- `CardFooter` - Bottom section

**Usage:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### 4. Input

**File:** `src/components/ui/input.tsx`

**Usage:**
```typescript
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Search..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Implementation:**
```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### 5. TerminalInput

**File:** `src/components/ui/terminal-input.tsx`

**Purpose:** Chat input with terminal styling and auto-resize

**Props:**
```typescript
interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  accentColor?: string;
  showMobileSendButton?: boolean;
}

export interface TerminalInputRef {
  focus: () => void;
}
```

**Features:**
- Auto-resize textarea
- Enter to submit, Shift+Enter for newline
- Terminal-style prompt (›)
- Mobile send button
- Focus management

**Usage:**
```typescript
import { TerminalInput, TerminalInputRef } from '@/components/ui/terminal-input';

const inputRef = useRef<TerminalInputRef>(null);

<TerminalInput
  ref={inputRef}
  value={query}
  onChange={setQuery}
  onSubmit={handleSubmit}
  placeholder="Ask about projects..."
  disabled={isLoading}
  accentColor={accentColor}
  showMobileSendButton={true}
/>

// Focus programmatically
inputRef.current?.focus();
```

### 6. Select

**File:** `src/components/ui/select.tsx`

**Sub-components:**
- `Select` - Root
- `SelectTrigger` - Button to open
- `SelectValue` - Display selected value
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option

**Usage:**
```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={sortBy} onValueChange={setSortBy}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Sort by..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recent">Most Recent</SelectItem>
    <SelectItem value="name">Alphabetical</SelectItem>
    <SelectItem value="impact">By Impact</SelectItem>
  </SelectContent>
</Select>
```

### 7. Dropdown Menu

**File:** `src/components/ui/dropdown-menu.tsx`

**Sub-components:**
- `DropdownMenu` - Root
- `DropdownMenuTrigger` - Button to open
- `DropdownMenuContent` - Menu content
- `DropdownMenuItem` - Individual item
- `DropdownMenuSeparator` - Divider
- `DropdownMenuLabel` - Section label

**Usage:**
```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete}>
      <Trash className="h-4 w-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 8. Tooltip

**File:** `src/components/ui/tooltip.tsx`

**Sub-components:**
- `TooltipProvider` - Context provider
- `Tooltip` - Root
- `TooltipTrigger` - Element to hover
- `TooltipContent` - Tooltip content

**Usage:**
```typescript
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>Additional information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 9. Alert

**File:** `src/components/ui/alert.tsx`

**Variants:**
- `default` - Info alert
- `destructive` - Error alert

**Sub-components:**
- `Alert` - Container
- `AlertTitle` - Title
- `AlertDescription` - Description

**Usage:**
```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    An error occurred while processing your request.
  </AlertDescription>
</Alert>
```

### 10. Separator

**File:** `src/components/ui/separator.tsx`

**Orientations:**
- `horizontal` (default)
- `vertical`

**Usage:**
```typescript
import { Separator } from '@/components/ui/separator';

<div className="space-y-4">
  <div>Section 1</div>
  <Separator />
  <div>Section 2</div>
</div>

<div className="flex items-center gap-4">
  <span>Item 1</span>
  <Separator orientation="vertical" className="h-6" />
  <span>Item 2</span>
</div>
```

### 11. Skeleton

**File:** `src/components/ui/skeleton.tsx`

**Purpose:** Loading placeholder with shimmer effect

**Usage:**
```typescript
import { Skeleton } from '@/components/ui/skeleton';

// Loading card
<div className="space-y-3">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-20 w-full" />
</div>
```

### 12. Tabs

**File:** `src/components/ui/tabs.tsx`

**Sub-components:**
- `Tabs` - Root
- `TabsList` - Tab buttons container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage:**
```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="projects">
  <TabsList>
    <TabsTrigger value="projects">Projects</TabsTrigger>
    <TabsTrigger value="experience">Experience</TabsTrigger>
    <TabsTrigger value="education">Education</TabsTrigger>
  </TabsList>
  <TabsContent value="projects">
    <ProjectGrid />
  </TabsContent>
  <TabsContent value="experience">
    <ExperienceSection />
  </TabsContent>
  <TabsContent value="education">
    <EducationSection />
  </TabsContent>
</Tabs>
```

### 13. ScrollArea

**File:** `src/components/ui/scroll-area.tsx`

**Purpose:** Custom scrollbar styling

**Usage:**
```typescript
import { ScrollArea } from '@/components/ui/scroll-area';

<ScrollArea className="h-[400px] w-full">
  <div className="p-4">
    {/* Long content */}
  </div>
</ScrollArea>
```

### 14. Avatar

**File:** `src/components/ui/avatar.tsx`

**Sub-components:**
- `Avatar` - Container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback text/icon

**Usage:**
```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>SB</AvatarFallback>
</Avatar>
```

### 15. ThemeColorPicker

**File:** `src/components/ui/theme-color-picker.tsx`

**Purpose:** Color picker for accent color selection

**Colors:**
- Teal (default)
- Blue
- Pink
- Orange
- Yellow
- Green
- Red
- Violet

**Usage:**
```typescript
import { ThemeColorPicker } from '@/components/ui/theme-color-picker';

<ThemeColorPicker />
```

**Implementation:**
```typescript
export function ThemeColorPicker() {
  const { accentColor, setAccentColor } = useUIStore();
  
  const colors = [
    { name: 'teal', value: 'oklch(0.72 0.12 185)' },
    { name: 'blue', value: 'oklch(0.70 0.14 240)' },
    { name: 'pink', value: 'oklch(0.72 0.15 350)' },
    { name: 'orange', value: 'oklch(0.75 0.15 50)' },
    { name: 'yellow', value: 'oklch(0.80 0.15 90)' },
    { name: 'green', value: 'oklch(0.70 0.14 145)' },
    { name: 'red', value: 'oklch(0.65 0.20 25)' },
    { name: 'violet', value: 'oklch(0.68 0.18 290)' },
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="grid grid-cols-4 gap-2 p-2">
          {colors.map(color => (
            <button
              key={color.name}
              onClick={() => setAccentColor(color.name)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                accentColor === color.name ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Utility Functions

### cn() - Class Name Merger

**File:** `src/lib/utils.ts`

**Purpose:** Merge Tailwind classes with proper precedence

**Implementation:**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
// Merge classes
cn("px-4 py-2", "bg-blue-500")
// Result: "px-4 py-2 bg-blue-500"

// Override classes (last wins)
cn("px-4", "px-6")
// Result: "px-6"

// Conditional classes
cn("px-4", isActive && "bg-blue-500", !isActive && "bg-gray-500")

// With className prop
cn("base-classes", className)
```

## Theming

### CSS Variables

**File:** `src/app/globals.css`

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --radius: 0.5rem;
  
  /* Accent color (dynamic) */
  --accent-color: oklch(0.72 0.12 185); /* Teal default */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}
```

### Accent Color Usage

```typescript
// In Tailwind classes
className="bg-accent-color text-white"
className="border-accent-color/50"
className="hover:text-accent-color"

// In inline styles
style={{ color: accentColor }}
style={{ backgroundColor: accentColor }}
style={{ boxShadow: `0 0 10px ${accentColor}` }}
```

## Accessibility Features

1. **Keyboard Navigation:**
   - All interactive elements focusable
   - Proper tab order
   - Enter/Space to activate

2. **ARIA Attributes:**
   - `aria-label` on icon buttons
   - `aria-expanded` on dropdowns
   - `aria-selected` on tabs
   - `aria-disabled` on disabled elements

3. **Focus Indicators:**
   - `focus-visible:ring-2` on all interactive elements
   - Clear focus states
   - Skip to content link (if needed)

4. **Screen Reader Support:**
   - Semantic HTML
   - Descriptive labels
   - Hidden text for icons (`sr-only`)

## Responsive Patterns

```typescript
// Mobile-first approach
className="text-sm sm:text-base lg:text-lg"
className="px-4 sm:px-6 lg:px-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hide/show based on breakpoint
className="hidden sm:block"  // Hide on mobile
className="block sm:hidden"  // Show only on mobile
```

## Animation Patterns

```typescript
// Hover effects
className="transition-colors hover:bg-accent hover:text-accent-foreground"
className="transition-transform hover:scale-105"

// Focus effects
className="focus-visible:ring-2 focus-visible:ring-ring"

// Disabled state
className="disabled:opacity-50 disabled:pointer-events-none"
```

## Common Patterns

### Form Field

```typescript
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  {error && (
    <p className="text-sm text-destructive">{error}</p>
  )}
</div>
```

### Loading State

```typescript
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Icon with Text

```typescript
<Button>
  <Download className="h-4 w-4 mr-2" />
  Download
</Button>
```

### Conditional Styling

```typescript
<Badge
  variant={isActive ? 'default' : 'outline'}
  className={cn(
    "cursor-pointer",
    isActive && "ring-2 ring-accent-color"
  )}
>
  {label}
</Badge>
```

## Testing UI Components

```typescript
describe('Button', () => {
  it('should render with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent-color');
  });
  
  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Best Practices

1. **Always use `cn()` for className merging**
2. **Forward refs for components that need imperative access**
3. **Use `asChild` pattern for polymorphic components**
4. **Provide proper TypeScript types**
5. **Support dark mode through CSS variables**
6. **Include focus states for accessibility**
7. **Use semantic HTML elements**
8. **Test keyboard navigation**
9. **Provide loading and error states**
10. **Document component APIs**
