'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, X, FolderKanban, Briefcase, GraduationCap, ArrowDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from './Message';
import { TerminalInput, TerminalInputRef } from '@/components/ui/terminal-input';
import { PromptSuggestions } from './PromptSuggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';
import { Citation } from '@/data/types';
import { Badge } from '@/components/ui/badge';
// Removed placeholder import - using streaming API instead
import { personalInfo, projects, experiences, education } from '@/data/portfolio';
import { getCurrentAccentColor } from '@/hooks/useThemeColor';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

// Typing animation component for welcome text
function TypingAnimation({ text, accentColor, showBlinkingCursor = true, hideCursor = false, onComplete }: { text: string; accentColor: string; showBlinkingCursor?: boolean; hideCursor?: boolean; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      // Mark typing as complete
      if (!typingComplete) {
        setTypingComplete(true);
        // Call onComplete when typing finishes
        if (onComplete) {
          setTimeout(() => onComplete(), 200);
        }
      }

      if (showBlinkingCursor && !hideCursor) {
        // Blinking cursor after typing is complete
        const cursorInterval = setInterval(() => {
          setCursorVisible(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
      }
    }
  }, [currentIndex, text, showBlinkingCursor, hideCursor, onComplete, typingComplete]);

  return (
    <span className="inline-flex items-center">
      <span>{displayedText}</span>
      {showBlinkingCursor && !hideCursor && (
        <span
          className="inline-block ml-1"
          style={{
            backgroundColor: accentColor,
            width: '6px',
            height: '1.2em',
            boxShadow: `0 0 10px ${accentColor.replace(')', ' / 0.6)')}`,
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.1s ease',
          }}
        />
      )}
    </span>
  );
}

// Clean terminal-style loading component
function TerminalLoading({ accentColor }: { accentColor: string }) {
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

  useEffect(() => {
    const spinnerInterval = setInterval(() => {
      setFrame((prev) => (prev + 1) % spinnerFrames.length);
    }, 80);

    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % terminalLogs.length);
    }, 600);

    return () => {
      clearInterval(spinnerInterval);
      clearInterval(logInterval);
    };
  }, [spinnerFrames.length, terminalLogs.length]);

  return (
    <motion.div
      className="w-full py-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="space-y-2 font-mono text-sm">
          {/* Spinner and main status */}
          <div className="flex items-center gap-3">
            <span
              className="text-xl"
              style={{
                color: accentColor,
                textShadow: `0 0 10px ${accentColor.replace(')', ' / 0.4)')}`,
              }}
            >
              {spinnerFrames[frame]}
            </span>
            <span className="text-muted-foreground">
              Processing request<motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >...</motion.span>
            </span>
          </div>

          {/* Terminal logs */}
          <div className="pl-8 space-y-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={logIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-muted-foreground/70"
              >
                <span style={{ color: accentColor }}>›</span> {terminalLogs[logIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ChatInterface() {
  const [query, setQuery] = useState('');
  const [currentChat, setCurrentChat] = useState<ChatMessage | null>(null);
  const [response, setResponse] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');
  const [nameTypingComplete, setNameTypingComplete] = useState(false);
  const [taglineTypingComplete, setTaglineTypingComplete] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // For spotlight effect in pixels
  const [isMouseOverText, setIsMouseOverText] = useState(false);
  const inputRef = useRef<TerminalInputRef>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const loadingStartTimeRef = useRef<number>(0);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const textWrapperRef = useRef<HTMLSpanElement>(null);
  const MIN_LOADING_DISPLAY_TIME = 2000; // 2 seconds minimum loading display

  const { chatContext, clearChatContext, newChatTrigger, isInitialAnimationComplete, setInitialAnimationComplete } = useUIStore();

  // Get context item title
  const getContextItemTitle = () => {
    if (!chatContext.enabled || !chatContext.itemId || !chatContext.itemType) return null;

    if (chatContext.itemType === 'project') {
      const project = projects.find(p => p.id === chatContext.itemId);
      return project?.title;
    } else if (chatContext.itemType === 'experience') {
      const experience = experiences.find(e => e.id === chatContext.itemId);
      return experience?.role;
    } else if (chatContext.itemType === 'education') {
      const edu = education.find(e => e.id === chatContext.itemId);
      return `${edu?.degree} - ${edu?.institution}`;
    }
    return null;
  };

  const contextItemTitle = getContextItemTitle();

  // Update accent color when it changes
  useEffect(() => {
    const updateAccentColor = () => {
      const color = getCurrentAccentColor();
      if (color) setAccentColor(color);
    };

    updateAccentColor();

    // Watch for changes to the CSS variable
    const observer = new MutationObserver(updateAccentColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  // Listen for new chat trigger from navbar
  useEffect(() => {
    if (newChatTrigger > 0) {
      handleNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChatTrigger]);

  // Keyboard shortcuts
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
  }, [query, error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom with smooth animation
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      userScrolledRef.current = false;
      setIsAtBottom(true);
      setShowScrollButton(false);
    }
  }, []);

  // Check if user is at bottom
  const checkIfAtBottom = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom && (currentChat !== null || response !== null));
  }, [currentChat, response]);

  // Handle scroll events
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      userScrolledRef.current = true;
      checkIfAtBottom();
    };

    scrollArea.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [checkIfAtBottom]);

  // Auto-scroll on new messages or streaming content
  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up, or if it's a new message
    if (!userScrolledRef.current || isAtBottom) {
      scrollToBottom('smooth');
    }
  }, [response?.content, currentChat, scrollToBottom, isAtBottom]);

  // Scroll to bottom when conversation starts
  useEffect(() => {
    if (currentChat && !userScrolledRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [currentChat, scrollToBottom]);

  // Helper function to ensure minimum loading display time
  const ensureMinimumLoadingTime = async () => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = MIN_LOADING_DISPLAY_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
  };

  const handleSubmitInput = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setLastQuery(userMessage);
    setQuery('');
    setError(null);
    setShowSuggestions(false);

    // Set user message
    setCurrentChat({ role: 'user', content: userMessage });
    setResponse(null); // Don't set response until we get data
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now(); // Track loading start time

    try {
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          context: chatContext,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let citations: Citation[] = [];
      let accumulatedContent = '';
      let isFirstChunk = true;

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === 'metadata') {
              citations = data.citations || [];
              // Wait for minimum display time before showing response
              if (isFirstChunk) {
                await ensureMinimumLoadingTime();
                isFirstChunk = false;
              }
              // Initialize response with citations
              setResponse({ role: 'assistant', content: accumulatedContent, citations });
            } else if (data.type === 'chunk') {
              // Wait for minimum display time before showing first chunk
              if (isFirstChunk) {
                await ensureMinimumLoadingTime();
                isFirstChunk = false;
              }
              accumulatedContent += data.content;
              setResponse({ role: 'assistant', content: accumulatedContent, citations });
            } else if (data.type === 'error') {
              throw new Error(data.error || 'Streaming error');
            } else if (data.type === 'done') {
              // Streaming complete
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            console.warn('Failed to parse chunk:', parseError);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request.');
      setCurrentChat(null);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setQuery(prompt);
    inputRef.current?.focus();
  };

  const handleRetry = async () => {
    if (!lastQuery || isLoading) return;

    setError(null);
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now(); // Track loading start time

    // Set user message
    setCurrentChat({ role: 'user', content: lastQuery });
    setResponse(null); // Don't set response until we get data

    try {
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: lastQuery,
          context: chatContext,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let citations: Citation[] = [];
      let accumulatedContent = '';
      let isFirstChunk = true;

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === 'metadata') {
              citations = data.citations || [];
              // Wait for minimum display time before showing response
              if (isFirstChunk) {
                await ensureMinimumLoadingTime();
                isFirstChunk = false;
              }
              // Initialize response with citations
              setResponse({ role: 'assistant', content: accumulatedContent, citations });
            } else if (data.type === 'chunk') {
              // Wait for minimum display time before showing first chunk
              if (isFirstChunk) {
                await ensureMinimumLoadingTime();
                isFirstChunk = false;
              }
              accumulatedContent += data.content;
              setResponse({ role: 'assistant', content: accumulatedContent, citations });
            } else if (data.type === 'error') {
              throw new Error(data.error || 'Streaming error');
            } else if (data.type === 'done') {
              // Streaming complete
            }
          } catch (parseError) {
            // Skip invalid JSON lines
            console.warn('Failed to parse chunk:', parseError);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request.');
      setCurrentChat(null);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
    setCurrentChat(null);
    setResponse(null);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setResponse(null);
    setError(null);
    setShowSuggestions(true);
    setLastQuery('');
    // Reset typing animations for welcome text only
    setNameTypingComplete(false);
    setTaglineTypingComplete(false);
    // DON'T reset isInitialAnimationComplete - keep UI components visible!
    clearChatContext();
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat context indicator */}
      <AnimatePresence>
        {chatContext.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-muted/50"
          >
            <div className="container-max py-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm text-muted-foreground flex-shrink-0">Context:</span>
                <Badge variant="secondary" className="max-w-full flex items-center gap-1.5">
                  {chatContext.itemType === 'project' && <FolderKanban className="h-3 w-3" />}
                  {chatContext.itemType === 'experience' && <Briefcase className="h-3 w-3" />}
                  {chatContext.itemType === 'education' && <GraduationCap className="h-3 w-3" />}
                  <span className="truncate">{contextItemTitle || 'Specific item'}</span>
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatContext}
                className="h-7 flex-shrink-0 hover:text-accent-color hover:bg-accent-color/10"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {!currentChat && !response && !error ? (
          /* Empty state - properly centered */
          <div className="flex-1 px-4 relative overflow-hidden flex items-center justify-center">
            {/* Subtle background gradient animation */}
            <motion.div
              className="absolute inset-0 opacity-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
            >
              <div
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${accentColor.replace(')', ' / 0.1)')}, transparent)`,
                }}
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${accentColor.replace(')', ' / 0.08)')}, transparent)`,
                }}
              />
            </motion.div>

            <div className="w-full max-w-3xl relative z-10">
              {/* Title at FINAL position - both shrink together after ALL typing completes */}
              {/* Wrapper to prevent layout shift during scale */}
              <div className="text-center mb-6 relative">
                <div className="flex flex-col items-center justify-start">
                  {/* Name - stays big until BOTH done typing */}
                  <motion.h1
                    ref={nameRef}
                    className="text-3xl sm:text-4xl font-semibold mb-3 cursor-pointer group"
                    data-cursor-expand
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{
                      opacity: 1,
                      scale: taglineTypingComplete ? 1 : 1.5  // Shrinks only after tagline completes
                    }}
                    transition={{
                      opacity: { duration: 0.4, delay: 0.2 },
                      scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                    }}
                    style={{
                      transformOrigin: 'center center',
                      willChange: 'transform',
                      position: 'relative',
                      display: 'inline-block'
                    }}
                  >
                  {/* Text with spotlight effect */}
                  <span
                    ref={textWrapperRef}
                    className="relative inline-block"
                    style={{
                      color: 'currentColor',
                      position: 'relative',
                    }}
                    onMouseMove={(e) => {
                      if (textWrapperRef.current) {
                        const rect = textWrapperRef.current.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        setMousePosition({ x, y });
                        setIsMouseOverText(true);
                      }
                    }}
                    onMouseEnter={() => setIsMouseOverText(true)}
                    onMouseLeave={() => setIsMouseOverText(false)}
                  >
                    {/* Base text that shows without hover */}
                    <span className="group-hover:opacity-0 transition-opacity duration-200">
                      <TypingAnimation
                        text={`Hi, I'm ${personalInfo.name.split(' ')[0]}`}
                        accentColor={accentColor}
                        hideCursor={nameTypingComplete}
                        onComplete={() => setNameTypingComplete(true)}
                      />
                    </span>

                    {/* Gradient text that shows on hover - ONLY through letters */}
                    <span
                      className="absolute inset-0 pointer-events-none select-none transition-opacity duration-150"
                      style={{
                        opacity: isMouseOverText ? 1 : 0,
                        backgroundImage: `radial-gradient(circle 60px at ${mousePosition.x}px ${mousePosition.y}px, ${accentColor} 0%, ${accentColor.replace(')', ' / 0.65)')} 25%, currentColor 60%)`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        letterSpacing: 'inherit',
                        lineHeight: 'inherit',
                      }}
                      aria-hidden="true"
                    >
                      Hi, I'm {personalInfo.name.split(' ')[0]}
                    </span>
                  </span>
                  </motion.h1>

                  {/* Tagline - stays big until typing completes, then BOTH shrink together */}
                  <motion.p
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0, scale: 1.4 }}
                    animate={{
                      opacity: nameTypingComplete ? 1 : 0,
                      scale: taglineTypingComplete ? 1 : 1.4  // Shrinks at same time as name
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                    }}
                    style={{
                      transformOrigin: 'center center',
                      willChange: 'transform',
                      position: 'relative',
                      display: 'inline-block'
                    }}
                  >
                    {nameTypingComplete && (
                      <TypingAnimation
                        text={personalInfo.tagline}
                        accentColor={accentColor}
                        showBlinkingCursor={true}
                        onComplete={() => {
                          setTaglineTypingComplete(true);
                          setTimeout(() => setInitialAnimationComplete(true), 400);
                        }}
                      />
                    )}
                  </motion.p>
                </div>
              </div>

              {/* Suggestions - reserve exact space to prevent position shift */}
              <div style={{ minHeight: '220px' }}>
                {showSuggestions && isInitialAnimationComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <PromptSuggestions
                      onSelectPrompt={handlePromptSelect}
                      isVisible={true}
                      contextType={chatContext.enabled ? chatContext.itemType : null}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Chat messages with scroll container
          <div ref={scrollAreaRef} className="flex-1 overflow-y-auto scroll-smooth relative">
            <div className="space-y-0 pb-4">
              {currentChat && <Message {...currentChat} />}
              {response && (
                <Message
                  {...response}
                  isStreaming={isLoading && response.content.length > 0}
                />
              )}
              <AnimatePresence mode="wait">
                {isLoading && !response && (
                  <TerminalLoading key="loading" accentColor={accentColor} />
                )}
              </AnimatePresence>
              {error && (
                <motion.div
                  className="w-full py-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Alert variant="destructive" className="border-destructive/50 relative">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium pr-24">{error}</AlertDescription>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <Button
                          onClick={handleRetry}
                          size="sm"
                          variant="outline"
                          className="h-8 gap-2 border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span className="hidden sm:inline">Retry</span>
                        </Button>
                        <Button
                          onClick={handleDismissError}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Alert>
                  </div>
                </motion.div>
              )}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Floating scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10"
                >
                  <Button
                    onClick={() => scrollToBottom('smooth')}
                    size="sm"
                    className="rounded-full shadow-lg bg-accent-color hover:bg-accent-color/90 active:bg-accent-color/80 text-white border-0 h-10 w-10 sm:h-12 sm:w-12 p-0 touch-manipulation"
                    style={{
                      boxShadow: `0 4px 12px ${accentColor.replace(')', ' / 0.3)')}, 0 2px 4px ${accentColor.replace(')', ' / 0.2)')}`,
                    }}
                  >
                    <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input area - reveal after typing completes */}
      <AnimatePresence>
        {(isInitialAnimationComplete || currentChat || response) && (
          <motion.div
            className=" bg-background/95 backdrop-blur-xl backdrop-saturate-150 sticky bottom-0 z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div
              className="absolute inset-x-0 bottom-full h-12 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent, hsl(var(--background) / 0.95))',
              }}
            />
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
              <TerminalInput
                ref={inputRef}
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmitInput}
                placeholder={
                  currentChat || response
                    ? "Ask a follow-up question..."
                    : "Ask about projects, experience, or skills..."
                }
                disabled={isLoading}
                accentColor={accentColor}
                showMobileSendButton={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
