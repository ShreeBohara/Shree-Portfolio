# Styling & Theming Documentation

## Overview

The portfolio uses Tailwind CSS 4 with CSS variables for theming, supporting dark/light modes and 8 accent colors. Framer Motion handles animations.

## File Structure

```
src/
├── app/
│   └── globals.css          # Global styles, CSS variables, Tailwind directives
├── components/ui/
│   └── theme-color-picker.tsx  # Color picker component
└── hooks/
    └── useThemeColor.ts     # Theme color hook
```

## CSS Variables

### File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Layout */
  --header-height: 64px;
  
  /* Colors - Light Mode */
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
  
  /* Accent Color (dynamic) */
  --accent-color: oklch(0.72 0.12 185); /* Teal default */
}

.dark {
  /* Colors - Dark Mode */
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

/* Base Styles */
* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}

/* Custom Utilities */
.container-max {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.heading-1 {
  @apply text-4xl font-bold tracking-tight;
}

.heading-2 {
  @apply text-2xl font-semibold tracking-tight;
}

.heading-3 {
  @apply text-xl font-semibold;
}

/* Category Badge Styles */
.category-ai {
  @apply bg-purple-500/10 text-purple-500 border-purple-500/20;
}

.category-fullstack {
  @apply bg-blue-500/10 text-blue-500 border-blue-500/20;
}

.category-data {
  @apply bg-green-500/10 text-green-500 border-green-500/20;
}

.category-mobile {
  @apply bg-orange-500/10 text-orange-500 border-orange-500/20;
}

.category-devops {
  @apply bg-red-500/10 text-red-500 border-red-500/20;
}

.category-opensource {
  @apply bg-yellow-500/10 text-yellow-500 border-yellow-500/20;
}

/* Animations */
@keyframes borderSlide {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
```

## Accent Colors

### Available Colors

```typescript
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
```

### Setting Accent Color

**In Zustand Store:**
```typescript
const { setAccentColor } = useUIStore();
setAccentColor('blue');
```

**In CSS:**
```typescript
// Update CSS variable
document.documentElement.style.setProperty('--accent-color', 'oklch(0.70 0.14 240)');
```

**Hook: `useThemeColor.ts`**
```typescript
export function getCurrentAccentColor(): string | null {
  if (typeof window === 'undefined') return null;
  
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue('--accent-color').trim();
}

export function setAccentColor(color: string): void {
  document.documentElement.style.setProperty('--accent-color', color);
}
```

### Using Accent Color

**In Tailwind Classes:**
```typescript
className="bg-accent-color text-white"
className="border-accent-color/50"
className="hover:text-accent-color"
className="shadow-accent-color/20"
```

**In Inline Styles:**
```typescript
style={{ color: accentColor }}
style={{ backgroundColor: accentColor }}
style={{ borderColor: accentColor }}
style={{ boxShadow: `0 0 10px ${accentColor}` }}
```

**With Opacity:**
```typescript
// Replace closing parenthesis with opacity
const colorWithOpacity = accentColor.replace(')', ' / 0.5)');
// Result: 'oklch(0.72 0.12 185 / 0.5)'

style={{ backgroundColor: colorWithOpacity }}
```

## Theme Toggle

### Implementation

**In Header Component:**
```typescript
const { theme, toggleTheme } = useUIStore();

// Apply theme class
useEffect(() => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}, [theme]);

// Toggle button
<button onClick={toggleTheme}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

### Theme-Specific Styles

```typescript
// Conditional classes
className={cn(
  "bg-background",
  theme === 'dark' ? "border-white/10" : "border-black/10"
)}

// CSS approach (preferred)
className="bg-background border-border"
// CSS variables handle theme automatically
```

## Tailwind Configuration

### File: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'accent-color': 'var(--accent-color)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

## Animations

### Framer Motion

**Entrance Animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>
  Content
</motion.div>
```

**Hover Effects:**
```typescript
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Card
</motion.div>
```

**Staggered Children:**
```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

**Exit Animations:**
```typescript
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### CSS Animations

**Spin:**
```typescript
className="animate-spin"
```

**Pulse:**
```typescript
className="animate-pulse"
```

**Bounce:**
```typescript
className="animate-bounce"
```

**Custom Animation:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

## Responsive Design

### Breakpoints

```typescript
// Tailwind default breakpoints
sm: '640px'   // Tablet
md: '768px'   // Small laptop
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

### Mobile-First Approach

```typescript
// Base styles apply to mobile
className="text-sm px-4 py-2"

// Add styles for larger screens
className="text-sm sm:text-base lg:text-lg"
className="px-4 sm:px-6 lg:px-8"
className="py-2 sm:py-3 lg:py-4"
```

### Responsive Grid

```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Hide/Show by Breakpoint

```typescript
className="hidden sm:block"      // Hide on mobile
className="block sm:hidden"      // Show only on mobile
className="hidden lg:flex"       // Hide until desktop
```

## Typography

### Font Families

**Sans Serif (Inter):**
```typescript
className="font-sans"
```

**Monospace (JetBrains Mono):**
```typescript
className="font-mono"
```

### Font Sizes

```typescript
className="text-xs"     // 0.75rem (12px)
className="text-sm"     // 0.875rem (14px)
className="text-base"   // 1rem (16px)
className="text-lg"     // 1.125rem (18px)
className="text-xl"     // 1.25rem (20px)
className="text-2xl"    // 1.5rem (24px)
className="text-3xl"    // 1.875rem (30px)
className="text-4xl"    // 2.25rem (36px)
```

### Font Weights

```typescript
className="font-normal"    // 400
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700
```

### Line Heights

```typescript
className="leading-none"      // 1
className="leading-tight"     // 1.25
className="leading-snug"      // 1.375
className="leading-normal"    // 1.5
className="leading-relaxed"   // 1.625
className="leading-loose"     // 2
```

## Spacing

### Padding

```typescript
className="p-4"      // All sides
className="px-4"     // Horizontal
className="py-4"     // Vertical
className="pt-4"     // Top
className="pr-4"     // Right
className="pb-4"     // Bottom
className="pl-4"     // Left
```

### Margin

```typescript
className="m-4"      // All sides
className="mx-4"     // Horizontal
className="my-4"     // Vertical
className="mt-4"     // Top
className="mr-4"     // Right
className="mb-4"     // Bottom
className="ml-4"     // Left
```

### Gap (Flexbox/Grid)

```typescript
className="gap-4"    // All directions
className="gap-x-4"  // Horizontal
className="gap-y-4"  // Vertical
```

## Colors

### Semantic Colors

```typescript
className="bg-background"           // Page background
className="text-foreground"         // Primary text
className="bg-card"                 // Card background
className="text-card-foreground"    // Card text
className="bg-muted"                // Muted background
className="text-muted-foreground"   // Secondary text
className="bg-accent"               // Accent background
className="text-accent-foreground"  // Accent text
className="bg-destructive"          // Error background
className="text-destructive"        // Error text
```

### Opacity

```typescript
className="bg-accent-color/10"   // 10% opacity
className="bg-accent-color/20"   // 20% opacity
className="bg-accent-color/50"   // 50% opacity
className="bg-accent-color/80"   // 80% opacity
```

## Borders

### Border Width

```typescript
className="border"      // 1px all sides
className="border-2"    // 2px all sides
className="border-t"    // Top only
className="border-r"    // Right only
className="border-b"    // Bottom only
className="border-l"    // Left only
```

### Border Radius

```typescript
className="rounded"      // 0.25rem
className="rounded-md"   // 0.375rem
className="rounded-lg"   // 0.5rem
className="rounded-xl"   // 0.75rem
className="rounded-full" // 9999px (circle)
```

### Border Color

```typescript
className="border-border"        // Default border
className="border-accent-color"  // Accent color
className="border-destructive"   // Error color
```

## Shadows

```typescript
className="shadow-sm"    // Small shadow
className="shadow"       // Default shadow
className="shadow-md"    // Medium shadow
className="shadow-lg"    // Large shadow
className="shadow-xl"    // Extra large shadow
```

**Custom Shadow:**
```typescript
style={{ boxShadow: `0 4px 12px ${accentColor.replace(')', ' / 0.3)')}` }}
```

## Transitions

```typescript
className="transition-colors"    // Color transitions
className="transition-transform" // Transform transitions
className="transition-all"       // All properties
className="duration-200"         // 200ms
className="duration-300"         // 300ms
className="ease-in-out"          // Easing function
```

## Hover States

```typescript
className="hover:bg-accent"
className="hover:text-accent-color"
className="hover:scale-105"
className="hover:shadow-lg"
```

## Focus States

```typescript
className="focus:outline-none"
className="focus-visible:ring-2"
className="focus-visible:ring-ring"
className="focus-visible:ring-offset-2"
```

## Disabled States

```typescript
className="disabled:opacity-50"
className="disabled:pointer-events-none"
className="disabled:cursor-not-allowed"
```

## Best Practices

1. **Use CSS variables** for theme-aware colors
2. **Mobile-first** responsive design
3. **Semantic color names** (background, foreground, muted)
4. **Consistent spacing** (use Tailwind scale)
5. **Accessible focus states** (ring on focus-visible)
6. **Smooth transitions** (200-300ms duration)
7. **Framer Motion** for complex animations
8. **CSS animations** for simple effects
9. **Test both themes** (light and dark)
10. **Optimize animations** (use transform, opacity)

## Common Patterns

### Card with Hover Effect

```typescript
<motion.div
  className="border rounded-lg p-6 bg-card hover:border-accent-color/50 cursor-pointer"
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### Button with Loading State

```typescript
<button
  className={cn(
    "px-4 py-2 rounded-md bg-accent-color text-white",
    "hover:bg-accent-color/90 transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  )}
  disabled={isLoading}
>
  {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
</button>
```

### Gradient Background

```typescript
className="bg-gradient-to-br from-card/80 via-card/80 to-muted/40"
```

### Backdrop Blur

```typescript
className="bg-background/80 backdrop-blur-sm"
```

### Text Gradient

```typescript
<span
  className="bg-clip-text text-transparent"
  style={{
    backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor.replace('185', '240')})`,
  }}
>
  Gradient Text
</span>
```
