# State Management Documentation

## Overview

State management uses Zustand for global UI state with localStorage persistence for user preferences. Local component state uses React's useState/useReducer hooks.

## File Location

`src/store/ui-store.ts` - Single Zustand store for all UI state

## Store Structure

```typescript
interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Details Panel
  isDetailsPanelOpen: boolean;
  selectedItemId: string | null;
  selectedItemType: 'project' | 'experience' | 'education' | null;
  setSelectedItem: (id: string | null, type: 'project' | 'experience' | 'education' | null) => void;
  closeDetailsPanel: () => void;
  
  // Chat Context
  chatContext: {
    enabled: boolean;
    itemId: string | null;
    itemType: 'project' | 'experience' | 'education' | null;
  };
  setChatContext: (context: Partial<UIState['chatContext']>) => void;
  clearChatContext: () => void;
  
  // New Chat Trigger
  newChatTrigger: number;
  triggerNewChat: () => void;
  
  // View Preferences
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Theme Accent Color
  accentColor: 'teal' | 'blue' | 'pink' | 'orange' | 'yellow' | 'green' | 'red' | 'violet';
  setAccentColor: (color: string) => void;
  
  // Initial Animation State
  isInitialAnimationComplete: boolean;
  setInitialAnimationComplete: (complete: boolean) => void;
}
```

## Implementation

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // Details panel
      isDetailsPanelOpen: false,
      selectedItemId: null,
      selectedItemType: null,
      setSelectedItem: (id, type) => set({
        selectedItemId: id,
        selectedItemType: type,
        isDetailsPanelOpen: id !== null,
      }),
      closeDetailsPanel: () => set({
        isDetailsPanelOpen: false,
        selectedItemId: null,
        selectedItemType: null,
      }),
      
      // Chat context
      chatContext: {
        enabled: false,
        itemId: null,
        itemType: null,
      },
      setChatContext: (context) => set((state) => ({
        chatContext: { ...state.chatContext, ...context },
      })),
      clearChatContext: () => set({
        chatContext: { enabled: false, itemId: null, itemType: null },
      }),
      
      // New chat trigger
      newChatTrigger: 0,
      triggerNewChat: () => set((state) => ({ 
        newChatTrigger: state.newChatTrigger + 1,
        chatContext: { enabled: false, itemId: null, itemType: null },
      })),
      
      // View preferences
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      // Theme accent color
      accentColor: 'teal',
      setAccentColor: (color) => set({ accentColor: color }),
      
      // Initial animation state
      isInitialAnimationComplete: false,
      setInitialAnimationComplete: (complete) => set({ 
        isInitialAnimationComplete: complete 
      }),
    }),
    {
      name: 'portfolio-ui-preferences',
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        accentColor: state.accentColor,
      }),
    }
  )
);
```

## Persisted State

**Stored in localStorage as `portfolio-ui-preferences`:**
- `theme` - 'light' or 'dark'
- `viewMode` - 'grid' or 'list'
- `accentColor` - Color name

**Session-only (resets on reload):**
- Sidebar open/closed
- Selected item
- Chat context
- Animation state
- New chat trigger

## Usage Patterns

### Basic Usage

```typescript
import { useUIStore } from '@/store/ui-store';

function MyComponent() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  
  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Sidebar
    </button>
  );
}
```

### Selecting Multiple Values

```typescript
function MyComponent() {
  const { theme, accentColor, toggleTheme, setAccentColor } = useUIStore();
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <p>Color: {accentColor}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setAccentColor('blue')}>Blue</button>
    </div>
  );
}
```

### Selector Pattern (Optimized)

```typescript
// Only re-render when theme changes
function MyComponent() {
  const theme = useUIStore((state) => state.theme);
  
  return <div>Theme: {theme}</div>;
}
```

### Outside React Components

```typescript
// Get current state
const { theme, accentColor } = useUIStore.getState();

// Update state
useUIStore.setState({ theme: 'dark' });

// Subscribe to changes
const unsubscribe = useUIStore.subscribe(
  (state) => console.log('State changed:', state)
);
```

## State Flows

### Opening Details Panel

```
User clicks ProjectCard
    │
    ▼
setSelectedItem(projectId, 'project')
    │
    ├─ selectedItemId = projectId
    ├─ selectedItemType = 'project'
    └─ isDetailsPanelOpen = true
         │
         ▼
    DetailsPanel renders
         │
         ▼
    Display project details
```

### Context-Aware Chat

```
User in Browse mode
    │
    ▼
Clicks "Ask about this project"
    │
    ├─ setChatContext({ enabled: true, itemId, itemType })
    ├─ router.push('/')
    └─ closeDetailsPanel()
         │
         ▼
    ChatInterface loads
         │
         ├─ Shows context pill
         ├─ Adapts prompt suggestions
         └─ Filters RAG retrieval
```

### New Chat Trigger

```
User clicks "Chat" in header (already on chat page)
    │
    ▼
triggerNewChat()
    │
    ├─ newChatTrigger++
    └─ clearChatContext()
         │
         ▼
    ChatInterface useEffect detects trigger
         │
         ▼
    handleNewChat()
         │
         ├─ Clear messages
         ├─ Reset animations
         └─ Focus input
```

### Theme Toggle

```
User clicks theme button
    │
    ▼
toggleTheme()
    │
    ├─ theme = theme === 'dark' ? 'light' : 'dark'
    └─ Persist to localStorage
         │
         ▼
    Header useEffect detects change
         │
         ▼
    document.documentElement.classList.toggle('dark')
         │
         ▼
    CSS variables update
```

## Common Patterns

### Opening/Closing Panels

```typescript
// Open details panel
const { setSelectedItem } = useUIStore();
setSelectedItem(item.id, 'project');

// Close details panel
const { closeDetailsPanel } = useUIStore();
closeDetailsPanel();

// Toggle sidebar
const { toggleSidebar } = useUIStore();
toggleSidebar();

// Set sidebar explicitly
const { setSidebarOpen } = useUIStore();
setSidebarOpen(false);
```

### Chat Context Management

```typescript
// Enable context for specific item
const { setChatContext } = useUIStore();
setChatContext({
  enabled: true,
  itemId: 'project-1',
  itemType: 'project',
});

// Clear context
const { clearChatContext } = useUIStore();
clearChatContext();

// Check if context is enabled
const { chatContext } = useUIStore();
if (chatContext.enabled) {
  // Filter RAG retrieval
}
```

### Theme Management

```typescript
// Toggle theme
const { toggleTheme } = useUIStore();
toggleTheme();

// Set theme explicitly
const { setTheme } = useUIStore();
setTheme('dark');

// Get current theme
const theme = useUIStore((state) => state.theme);

// Change accent color
const { setAccentColor } = useUIStore();
setAccentColor('blue');
```

### Animation State

```typescript
// Mark animation complete
const { setInitialAnimationComplete } = useUIStore();
setInitialAnimationComplete(true);

// Check if animation complete
const { isInitialAnimationComplete } = useUIStore();
if (isInitialAnimationComplete) {
  // Show sidebar/header
}
```

## Performance Optimization

### Selector Pattern

**Bad (re-renders on any state change):**
```typescript
function MyComponent() {
  const store = useUIStore();
  return <div>{store.theme}</div>;
}
```

**Good (only re-renders when theme changes):**
```typescript
function MyComponent() {
  const theme = useUIStore((state) => state.theme);
  return <div>{theme}</div>;
}
```

### Multiple Selectors

**Bad (multiple subscriptions):**
```typescript
function MyComponent() {
  const theme = useUIStore((state) => state.theme);
  const accentColor = useUIStore((state) => state.accentColor);
  const viewMode = useUIStore((state) => state.viewMode);
  // ...
}
```

**Good (single subscription):**
```typescript
function MyComponent() {
  const { theme, accentColor, viewMode } = useUIStore((state) => ({
    theme: state.theme,
    accentColor: state.accentColor,
    viewMode: state.viewMode,
  }));
  // ...
}
```

### Shallow Equality

```typescript
import { shallow } from 'zustand/shallow';

function MyComponent() {
  const { theme, accentColor } = useUIStore(
    (state) => ({ theme: state.theme, accentColor: state.accentColor }),
    shallow
  );
  // Only re-renders if theme OR accentColor changes
}
```

## Debugging

### DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // ... state
      }),
      { name: 'portfolio-ui-preferences' }
    ),
    { name: 'UIStore' }
  )
);
```

### Logging

```typescript
// Log all state changes
useUIStore.subscribe((state) => {
  console.log('State changed:', state);
});

// Log specific changes
useUIStore.subscribe(
  (state) => state.theme,
  (theme) => console.log('Theme changed:', theme)
);
```

### Inspect State

```typescript
// In browser console
window.useUIStore = useUIStore;

// Then in console:
useUIStore.getState()
useUIStore.setState({ theme: 'dark' })
```

## Testing

### Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '@/store/ui-store';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      isSidebarOpen: false,
      theme: 'dark',
      // ... reset all state
    });
  });
  
  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.isSidebarOpen).toBe(false);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.isSidebarOpen).toBe(true);
  });
  
  it('should set selected item', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSelectedItem('project-1', 'project');
    });
    
    expect(result.current.selectedItemId).toBe('project-1');
    expect(result.current.selectedItemType).toBe('project');
    expect(result.current.isDetailsPanelOpen).toBe(true);
  });
  
  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    const stored = JSON.parse(localStorage.getItem('portfolio-ui-preferences')!);
    expect(stored.state.theme).toBe('light');
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useUIStore } from '@/store/ui-store';

describe('Theme Toggle Integration', () => {
  it('should toggle theme when button clicked', () => {
    render(<Header />);
    
    const themeButton = screen.getByLabelText('Toggle theme');
    const initialTheme = useUIStore.getState().theme;
    
    fireEvent.click(themeButton);
    
    const newTheme = useUIStore.getState().theme;
    expect(newTheme).not.toBe(initialTheme);
  });
});
```

## Best Practices

1. **Use selectors** for performance optimization
2. **Keep actions simple** - one responsibility per action
3. **Avoid nested state** - flatten when possible
4. **Persist only preferences** - not transient UI state
5. **Reset state** when appropriate (e.g., new chat clears context)
6. **Type everything** - full TypeScript support
7. **Document state** - add comments for complex logic
8. **Test state changes** - unit test all actions
9. **Use shallow equality** for object selectors
10. **Avoid derived state** - compute in components

## Migration Guide

### From Redux

**Redux:**
```typescript
// Action
const toggleSidebar = () => ({ type: 'TOGGLE_SIDEBAR' });

// Reducer
function uiReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
  }
}

// Usage
dispatch(toggleSidebar());
```

**Zustand:**
```typescript
// Store
const useUIStore = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

// Usage
const { toggleSidebar } = useUIStore();
toggleSidebar();
```

### From Context API

**Context:**
```typescript
const UIContext = createContext();

function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <UIContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}

// Usage
const { isSidebarOpen, setIsSidebarOpen } = useContext(UIContext);
```

**Zustand:**
```typescript
const useUIStore = create((set) => ({
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

// Usage
const { isSidebarOpen, setSidebarOpen } = useUIStore();
```

## Advanced Patterns

### Computed Values

```typescript
// In store
const useUIStore = create((set, get) => ({
  theme: 'dark',
  accentColor: 'teal',
  
  // Computed value
  isDarkMode: () => get().theme === 'dark',
}));

// Usage
const isDarkMode = useUIStore((state) => state.isDarkMode());
```

### Middleware

```typescript
import { devtools, persist } from 'zustand/middleware';

const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        // ... state
      }),
      { name: 'portfolio-ui-preferences' }
    ),
    { name: 'UIStore' }
  )
);
```

### Slices

```typescript
// Sidebar slice
const createSidebarSlice = (set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
});

// Theme slice
const createThemeSlice = (set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
});

// Combined store
const useUIStore = create((set) => ({
  ...createSidebarSlice(set),
  ...createThemeSlice(set),
}));
```

## Troubleshooting

### State Not Persisting

**Problem:** Changes not saved to localStorage

**Solution:**
```typescript
// Check partialize function
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'portfolio-ui-preferences',
    partialize: (state) => ({
      theme: state.theme,  // Make sure field is included
      viewMode: state.viewMode,
      accentColor: state.accentColor,
    }),
  }
)
```

### Stale State

**Problem:** Component not re-rendering on state change

**Solution:**
```typescript
// Use selector pattern
const theme = useUIStore((state) => state.theme);

// Not this
const store = useUIStore();
const theme = store.theme;  // Won't trigger re-render
```

### Performance Issues

**Problem:** Too many re-renders

**Solution:**
```typescript
// Use shallow equality
import { shallow } from 'zustand/shallow';

const { theme, accentColor } = useUIStore(
  (state) => ({ theme: state.theme, accentColor: state.accentColor }),
  shallow
);
```
