# Chat Interface Documentation

## Overview

The chat interface is the primary user interaction point. It provides a conversational way to explore Shree's portfolio with AI-powered responses, streaming animations, and contextual suggestions.

## File Location

`src/components/chat/ChatInterface.tsx` (838 lines)

## Component Structure

```
ChatInterface
├── Context Indicator (conditional)
├── Chat Area
│   ├── Empty State (hero + suggestions)
│   └── Messages + Loading + Errors
└── Input Area (TerminalInput)
```

## State Management

### Local State

```typescript
const [query, setQuery] = useState('');                    // Current input
const [currentChat, setCurrentChat] = useState<ChatMessage | null>(null);  // User message
const [response, setResponse] = useState<ChatMessage | null>(null);        // AI response
const [isLoading, setIsLoading] = useState(false);         // Loading state
const [error, setError] = useState<string | null>(null);   // Error message
const [showSuggestions, setShowSuggestions] = useState(true);  // Show prompt chips
const [lastQuery, setLastQuery] = useState<string>('');    // For retry
const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');  // Theme color
const [nameTypingComplete, setNameTypingComplete] = useState(false);  // Animation state
const [showScrollButton, setShowScrollButton] = useState(false);  // Scroll to bottom button
const [isAtBottom, setIsAtBottom] = useState(true);        // Scroll position
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });  // Spotlight effect
const [isMouseOverText, setIsMouseOverText] = useState(false);  // Hover state
```

### Refs

```typescript
const inputRef = useRef<TerminalInputRef>(null);           // Input focus control
const messagesEndRef = useRef<HTMLDivElement>(null);       // Scroll anchor
const scrollAreaRef = useRef<HTMLDivElement>(null);        // Scroll container
const userScrolledRef = useRef(false);                     // Manual scroll detection
const loadingStartTimeRef = useRef<number>(0);             // Minimum loading time
const nameRef = useRef<HTMLHeadingElement>(null);          // Name element
const textWrapperRef = useRef<HTMLSpanElement>(null);      // Text wrapper for spotlight
```

### Global State (Zustand)

```typescript
const {
  chatContext,              // { enabled, itemId, itemType }
  clearChatContext,         // Clear context
  newChatTrigger,          // Trigger from navbar
  isInitialAnimationComplete,  // Animation state
  setInitialAnimationComplete, // Set animation state
} = useUIStore();
```

## Key Features

### 1. Empty State (Hero)

**When Shown:** No messages, no errors

**Components:**
- Typing animation for name
- Typing animation for tagline
- Prompt suggestions (4 chips)
- Subtle background gradient

**Code:**
```typescript
{!currentChat && !response && !error ? (
  <div className="flex-1 flex items-center justify-center">
    <motion.div className="w-full max-w-3xl">
      {/* Name with spotlight effect */}
      <h1 ref={nameRef} onMouseMove={handleMouseMove}>
        <TypingAnimation
          text={`Hi, I'm ${personalInfo.name.split(' ')[0]}`}
          accentColor={accentColor}
          onComplete={() => setNameTypingComplete(true)}
        />
      </h1>
      
      {/* Tagline (after name completes) */}
      {nameTypingComplete && (
        <TypingAnimation
          text={personalInfo.tagline}
          accentColor={accentColor}
          showBlinkingCursor={false}
          onComplete={() => setInitialAnimationComplete(true)}
        />
      )}
      
      {/* Suggestions (after tagline completes) */}
      {isInitialAnimationComplete && (
        <PromptSuggestions
          onSelectPrompt={handlePromptSelect}
          contextType={chatContext.itemType}
        />
      )}
    </motion.div>
  </div>
) : (
  // Messages view
)}
```

### 2. Typing Animation

**Component:** `TypingAnimation`

**Props:**
```typescript
interface TypingAnimationProps {
  text: string;
  accentColor: string;
  showBlinkingCursor?: boolean;  // Default true
  hideCursor?: boolean;          // Hide after typing
  onComplete?: () => void;       // Callback when done
}
```

**Implementation:**
```typescript
function TypingAnimation({ text, accentColor, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Type one character every 80ms
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      // Typing complete
      if (onComplete) {
        setTimeout(() => onComplete(), 200);
      }
      
      // Blink cursor every 530ms
      const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, text, onComplete]);
  
  return (
    <span>
      {displayedText}
      <span
        style={{
          backgroundColor: accentColor,
          width: '4px',
          height: '1.2em',
          opacity: cursorVisible ? 1 : 0,
        }}
      />
    </span>
  );
}
```

### 3. Spotlight Effect

**Feature:** Name text glows on hover with radial gradient following mouse

**Implementation:**
```typescript
// Track mouse position
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const [isMouseOverText, setIsMouseOverText] = useState(false);

// Update on mouse move
<span
  onMouseMove={(e) => {
    const rect = textWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setIsMouseOverText(true);
  }}
  onMouseLeave={() => setIsMouseOverText(false)}
>
  {/* Base text (visible when not hovering) */}
  <span className="group-hover:opacity-0">
    Hi, I'm Shree
  </span>
  
  {/* Gradient text (visible on hover) */}
  <span
    style={{
      opacity: isMouseOverText ? 1 : 0,
      backgroundImage: `radial-gradient(
        circle 60px at ${mousePosition.x}px ${mousePosition.y}px,
        ${accentColor} 0%,
        ${accentColor.replace(')', ' / 0.65)')} 25%,
        currentColor 60%
      )`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    Hi, I'm Shree
  </span>
</span>
```

### 4. Message Submission

**Function:** `handleSubmitInput()`

**Flow:**
```typescript
async function handleSubmitInput() {
  // 1. Validation
  if (!query.trim() || isLoading) return;
  
  // 2. Setup
  const userMessage = query.trim();
  setLastQuery(userMessage);
  setQuery('');
  setError(null);
  setShowSuggestions(false);
  
  // 3. Display user message
  setCurrentChat({ role: 'user', content: userMessage });
  setResponse(null);
  setIsLoading(true);
  loadingStartTimeRef.current = Date.now();
  
  // 4. Call API
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userMessage,
        context: chatContext,
        stream: true,
      }),
    });
    
    // 5. Handle streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let citations = [];
    let accumulatedContent = '';
    let isFirstChunk = true;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const data = JSON.parse(line);
        
        if (data.type === 'metadata') {
          citations = data.citations;
          // Wait for minimum display time
          if (isFirstChunk) {
            await ensureMinimumLoadingTime();
            isFirstChunk = false;
          }
          setResponse({ role: 'assistant', content: '', citations });
        }
        else if (data.type === 'chunk') {
          if (isFirstChunk) {
            await ensureMinimumLoadingTime();
            isFirstChunk = false;
          }
          accumulatedContent += data.content;
          setResponse({ role: 'assistant', content: accumulatedContent, citations });
        }
      }
    }
  } catch (err) {
    setError(err.message);
    setCurrentChat(null);
    setResponse(null);
  } finally {
    setIsLoading(false);
  }
}
```

### 5. Minimum Loading Time

**Purpose:** Prevent flickering for fast responses

**Implementation:**
```typescript
const MIN_LOADING_DISPLAY_TIME = 2000; // 2 seconds

async function ensureMinimumLoadingTime() {
  const elapsedTime = Date.now() - loadingStartTimeRef.current;
  const remainingTime = MIN_LOADING_DISPLAY_TIME - elapsedTime;
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
}
```

**Why:** If AI responds in 200ms, showing loading for only 200ms feels jarring. Minimum 2s provides smooth UX.

### 6. Terminal Loading Animation

**Component:** `TerminalLoading`

**Features:**
- Spinning frames (⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
- Rotating log messages
- Accent color styling

**Code:**
```typescript
function TerminalLoading({ accentColor }) {
  const [frame, setFrame] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const terminalLogs = [
    '$ Analyzing query...',
    '$ Loading context...',
    '$ Processing request...',
    '$ Searching knowledge base...',
    '$ Generating response...',
    '$ Optimizing output...',
  ];
  
  // Update spinner every 80ms
  useEffect(() => {
    const spinnerInterval = setInterval(() => {
      setFrame(prev => (prev + 1) % spinnerFrames.length);
    }, 80);
    return () => clearInterval(spinnerInterval);
  }, []);
  
  // Update log every 600ms
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % terminalLogs.length);
    }, 600);
    return () => clearInterval(logInterval);
  }, []);
  
  return (
    <div>
      <span style={{ color: accentColor }}>
        {spinnerFrames[frame]}
      </span>
      <span>Processing request...</span>
      <div>
        <span style={{ color: accentColor }}>›</span>
        {terminalLogs[logIndex]}
      </div>
    </div>
  );
}
```

### 7. Auto-Scroll Behavior

**Features:**
- Auto-scroll on new messages
- Detect manual scroll up
- Show "scroll to bottom" button
- Smooth scroll animation

**Implementation:**
```typescript
// Check if at bottom
function checkIfAtBottom() {
  const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
  const atBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
  setIsAtBottom(atBottom);
  setShowScrollButton(!atBottom && (currentChat || response));
}

// Auto-scroll on new content
useEffect(() => {
  if (!userScrolledRef.current || isAtBottom) {
    scrollToBottom('smooth');
  }
}, [response?.content, currentChat]);

// Scroll to bottom function
function scrollToBottom(behavior = 'smooth') {
  messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  userScrolledRef.current = false;
  setIsAtBottom(true);
  setShowScrollButton(false);
}

// Detect manual scroll
useEffect(() => {
  const handleScroll = () => {
    userScrolledRef.current = true;
    checkIfAtBottom();
  };
  
  scrollAreaRef.current?.addEventListener('scroll', handleScroll);
  return () => scrollAreaRef.current?.removeEventListener('scroll', handleScroll);
}, []);
```

### 8. Keyboard Shortcuts

**Shortcuts:**
- `Cmd/Ctrl + K`: Focus input
- `Escape`: Clear input or dismiss error
- `Cmd/Ctrl + Enter`: New chat

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K: Focus input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
    }
    
    // Escape: Clear input or dismiss error
    if (e.key === 'Escape') {
      if (query) {
        setQuery('');
      } else if (error) {
        handleDismissError();
      } else {
        inputRef.current?.focus();
      }
    }
    
    // Cmd/Ctrl + Enter: New chat
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleNewChat();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [query, error]);
```

### 9. Context Indicator

**When Shown:** `chatContext.enabled === true`

**Display:**
```typescript
{chatContext.enabled && (
  <motion.div className="border-b bg-muted/50">
    <div className="container-max py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Context:</span>
        <Badge variant="secondary">
          {chatContext.itemType === 'project' && <FolderKanban />}
          {chatContext.itemType === 'experience' && <Briefcase />}
          {chatContext.itemType === 'education' && <GraduationCap />}
          <span>{contextItemTitle}</span>
        </Badge>
      </div>
      <Button onClick={clearChatContext}>
        <X /> Clear
      </Button>
    </div>
  </motion.div>
)}
```

**Context Title Lookup:**
```typescript
function getContextItemTitle() {
  if (!chatContext.enabled || !chatContext.itemId) return null;
  
  if (chatContext.itemType === 'project') {
    const project = projects.find(p => p.id === chatContext.itemId);
    return project?.title;
  }
  else if (chatContext.itemType === 'experience') {
    const experience = experiences.find(e => e.id === chatContext.itemId);
    return experience?.role;
  }
  else if (chatContext.itemType === 'education') {
    const edu = education.find(e => e.id === chatContext.itemId);
    return `${edu?.degree} - ${edu?.institution}`;
  }
  
  return null;
}
```

### 10. New Chat

**Function:** `handleNewChat()`

**Actions:**
```typescript
function handleNewChat() {
  setCurrentChat(null);
  setResponse(null);
  setError(null);
  setShowSuggestions(true);
  setLastQuery('');
  setNameTypingComplete(false);
  setInitialAnimationComplete(false);
  clearChatContext();
  inputRef.current?.focus();
}
```

**Triggers:**
- Navbar "New Chat" button (via `newChatTrigger`)
- Keyboard shortcut (Cmd+Enter)
- Manual call

### 11. Error Handling

**Display:**
```typescript
{error && (
  <Alert variant="destructive">
    <AlertCircle />
    <AlertDescription>{error}</AlertDescription>
    <Button onClick={handleRetry}>
      <RefreshCw /> Retry
    </Button>
    <Button onClick={handleDismissError}>
      <X />
    </Button>
  </Alert>
)}
```

**Retry Logic:**
```typescript
async function handleRetry() {
  if (!lastQuery || isLoading) return;
  
  setError(null);
  setIsLoading(true);
  
  // Same logic as handleSubmitInput but with lastQuery
  // ...
}
```

## Sub-Components

### Message Component

**File:** `src/components/chat/Message.tsx`

**Props:**
```typescript
interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
  accentColor?: string;
}
```

**Features:**
- User/assistant icons
- Markdown rendering (ReactMarkdown + remark-gfm)
- Code blocks with copy button
- Citation badges
- Calendly CTA (if keywords detected)
- Streaming cursor

**See:** [Message Component Details](#message-component-details)

### PromptSuggestions Component

**File:** `src/components/chat/PromptSuggestions.tsx`

**Props:**
```typescript
interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  isVisible: boolean;
  contextType?: 'project' | 'experience' | 'education' | null;
}
```

**Features:**
- 4 suggestion chips
- Context-aware prompts
- Animated border on hover
- Click to populate input

**See:** [Prompt Suggestions Details](#prompt-suggestions-details)

### TerminalInput Component

**File:** `src/components/ui/terminal-input.tsx`

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
```

**Features:**
- Terminal-style input
- Enter to submit
- Shift+Enter for newline
- Auto-resize textarea
- Send button (mobile)
- Focus management

## Animations

### Entrance Animations

```typescript
// Input area
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
>
  <TerminalInput />
</motion.div>

// Messages
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>
  <Message />
</motion.div>

// Loading
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -5 }}
  transition={{ duration: 0.2 }}
>
  <TerminalLoading />
</motion.div>
```

### Scroll Button

```typescript
<AnimatePresence>
  {showScrollButton && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Button onClick={() => scrollToBottom('smooth')}>
        <ArrowDown />
      </Button>
    </motion.div>
  )}
</AnimatePresence>
```

## Responsive Design

### Mobile Optimizations

1. **Input Area:**
   - Show send button on mobile
   - Larger touch targets
   - Adjusted padding

2. **Messages:**
   - Reduced padding
   - Smaller font sizes
   - Stack citations vertically

3. **Scroll Button:**
   - Larger size (48px vs 40px)
   - Better positioning

### Breakpoints

```css
/* Mobile: < 640px */
.px-4 sm:px-6

/* Tablet: 640px - 1024px */
.sm:text-4xl

/* Desktop: > 1024px */
.lg:px-8
```

## Performance Considerations

1. **Streaming:** Reduces time to first byte
2. **Minimum Loading:** Prevents flickering
3. **Debounced Scroll:** Throttle scroll events
4. **Memoization:** (Not yet implemented, but recommended for Message component)
5. **Lazy Loading:** AnimatePresence only renders visible components

## Accessibility

1. **Keyboard Navigation:** Full keyboard support
2. **ARIA Labels:** All interactive elements labeled
3. **Focus Management:** Auto-focus input after actions
4. **Screen Reader:** Semantic HTML, proper roles
5. **Color Contrast:** Meets WCAG AA standards

## Common Issues & Solutions

### Issue: Messages don't auto-scroll

**Cause:** User manually scrolled up

**Solution:** Check `userScrolledRef.current` and only auto-scroll if false or at bottom

### Issue: Loading flickers for fast responses

**Cause:** No minimum display time

**Solution:** Implement `ensureMinimumLoadingTime()` with 2s minimum

### Issue: Multiple cursors appear during streaming

**Cause:** Multiple renders adding cursor elements

**Solution:** Remove existing cursors before adding new one

### Issue: Input doesn't focus after new chat

**Cause:** Missing `inputRef.current?.focus()` call

**Solution:** Call focus in `handleNewChat()` and after errors

## Testing Recommendations

### Unit Tests

```typescript
describe('ChatInterface', () => {
  it('should display empty state initially', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Hi, I'm/)).toBeInTheDocument();
  });
  
  it('should submit query on Enter', async () => {
    render(<ChatInterface />);
    const input = screen.getByPlaceholderText(/Ask about/);
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('test query')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

```typescript
describe('Chat Flow', () => {
  it('should display streaming response', async () => {
    mockFetch('/api/chat', streamingResponse);
    render(<ChatInterface />);
    
    // Submit query
    const input = screen.getByPlaceholderText(/Ask about/);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(input);
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText(/response content/)).toBeInTheDocument();
    });
  });
});
```
