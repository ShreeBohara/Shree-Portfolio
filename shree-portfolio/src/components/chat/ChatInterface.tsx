'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, X, FolderKanban, Briefcase, GraduationCap, ArrowDown, RefreshCw, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from './Message';
import { TerminalInput, TerminalInputRef } from '@/components/ui/terminal-input';
import { PromptSuggestions, promptCategories } from './PromptSuggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';
import { Citation } from '@/data/types';
import { readChatResponse } from '@/lib/ai/chat-stream';
import { Badge } from '@/components/ui/badge';
// Removed placeholder import - using streaming API instead
import { personalInfo, projects, experiences, education } from '@/data/portfolio';
import { cn } from '@/lib/utils';
import { ACCENT, accentAlpha } from '@/lib/accent';
import Image from 'next/image';
import Link from 'next/link';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

// Hero text. This used to type character by character at 80ms, which meant the
// h1 shipped as an empty span at opacity 0 and the whole shell (nav, input,
// suggestions) stayed hidden until the chain finished ~5s after hydration — in a
// backgrounded tab the timers never ran and the page stayed blank. The text now
// renders server-side; only the caret animates.
function TypingAnimation({ text, accentColor, showBlinkingCursor = true, hideCursor = false, onComplete }: { text: string; accentColor: string; showBlinkingCursor?: boolean; hideCursor?: boolean; onComplete?: () => void }) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!showBlinkingCursor || hideCursor) return;
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, [showBlinkingCursor, hideCursor]);

  return (
    <span className="inline-flex items-center">
      <span>{text}</span>
      {showBlinkingCursor && !hideCursor && (
        <span
          className="inline-block ml-1 motion-reduce:opacity-100"
          style={{
            backgroundColor: accentColor,
            width: '6px',
            height: '1.2em',
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
                textShadow: `0 0 10px ${accentAlpha(25)}`,
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
  // One accent, defined in CSS. Previously this was per-visitor state applied
  // after hydration, which flashed a different colour on every load.
  const accentColor = ACCENT;
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
  const activeRequestRef = useRef<AbortController | null>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const textWrapperRef = useRef<HTMLSpanElement>(null);
  const MIN_LOADING_DISPLAY_TIME = 2000; // 2 seconds minimum loading display

  const { chatContext, clearChatContext, newChatTrigger, isInitialAnimationComplete, setInitialAnimationComplete, hasLayoutAnimatedOnce, setHasLayoutAnimatedOnce } = useUIStore();

  // DEBUG: Track container and positions
  const containerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousPositionRef = useRef<{ top: number; left: number } | null>(null);

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

  useEffect(() => () => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
  }, []);


  // Track state changes for animation coordination
  useEffect(() => {
    // Empty effect to coordinate name and tagline typing completion
  }, [nameTypingComplete, taglineTypingComplete, isInitialAnimationComplete]);

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
      if (e.defaultPrevented) return;
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
    if (scrollAreaRef.current) {
      const { scrollHeight } = scrollAreaRef.current;
      scrollAreaRef.current.scrollTo({
        top: scrollHeight,
        behavior
      });
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

  // Mobile keyboard optimization
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    let initialHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportResize = () => {
      // Detect if viewport height changed (keyboard opened/closed)
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // If keyboard opened (viewport shrunk by more than 150px)
      if (heightDifference > 150) {
        // Ensure input remains visible and scroll to bottom
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          scrollToBottom('auto');
        }, 100);
      } else if (Math.abs(heightDifference) < 50) {
        // Keyboard closed (viewport back to normal)
        initialHeight = currentHeight;
      }
    };

    // Listen to visual viewport resize (better for mobile keyboards)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', handleViewportResize);
    }

    return () => {
      clearTimeout(resizeTimer);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      } else {
        window.removeEventListener('resize', handleViewportResize);
      }
    };
  }, [scrollToBottom]);

  // Helper function to ensure minimum loading display time
  const ensureMinimumLoadingTime = async () => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = MIN_LOADING_DISPLAY_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
  };

  const streamAnswer = async (message: string) => {
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    setError(null);
    setCurrentChat({ role: 'user', content: message });
    setResponse(null);
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now();

    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message, context: chatContext, stream: true }),
        signal: controller.signal,
      });
      let citations: Citation[] = [];
      let accumulatedContent = '';
      let isFirstChunk = true;

      for await (const event of readChatResponse(apiResponse)) {
        if (controller.signal.aborted || activeRequestRef.current !== controller) return;
        if (event.type === 'metadata') {
          citations = event.citations;
        } else if (event.type === 'chunk') {
          if (isFirstChunk) {
            await ensureMinimumLoadingTime();
            isFirstChunk = false;
          }
          if (controller.signal.aborted || activeRequestRef.current !== controller) return;
          accumulatedContent += event.content;
          setResponse({ role: 'assistant', content: accumulatedContent, citations });
        }
      }
    } catch (err) {
      if (controller.signal.aborted || activeRequestRef.current !== controller) return;
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request.');
      setCurrentChat(null);
      setResponse(null);
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleSubmitInput = async () => {
    if (!query.trim() || isLoading) return;
    const userMessage = query.trim();
    setLastQuery(userMessage);
    setQuery('');
    setShowSuggestions(false);
    await streamAnswer(userMessage);
  };

  const handlePromptSelect = (prompt: string) => {
    setQuery(prompt);
    inputRef.current?.focus();
  };

  const handleRetry = async () => {
    if (!lastQuery || isLoading) return;
    await streamAnswer(lastQuery);
  };

  const handleDismissError = () => {
    setError(null);
    setCurrentChat(null);
    setResponse(null);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    activeRequestRef.current?.abort();
    activeRequestRef.current = null;
    setIsLoading(false);
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
    <div className="flex flex-col h-full min-h-0">
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
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
        {!currentChat && !response && !error ? (
          /* Empty state - properly centered */
          <div ref={outerContainerRef} className="flex-1 px-3 sm:px-4 relative overflow-y-auto flex flex-col">
            <div ref={containerRef} className="w-full max-w-3xl relative z-10 m-auto py-8">
              {/* Title at FINAL position - both shrink together after ALL typing completes */}
              {/* Wrapper to prevent layout shift during scale */}
              <div className="text-center mb-4 sm:mb-6 relative">
                <div className="flex flex-col items-center justify-start">
                  {/* Name - stays big until BOTH done typing (only on first load) */}
                  <motion.h1
                    ref={nameRef}
                    className={cn(
                      "text-2xl sm:text-4xl font-semibold group",
                      hasLayoutAnimatedOnce && "cursor-pointer"
                    )}
                    data-cursor-expand={hasLayoutAnimatedOnce ? true : undefined}
                    initial={{
                      opacity: 1,
                      scale: 1,
                      marginBottom: 12
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      marginBottom: 12
                    }}
                    transition={{
                      opacity: { duration: 0.4, delay: 0.2 },
                      scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                      marginBottom: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }  // Same timing as scale
                    }}
                    onAnimationStart={() => {
                      // Track position for animation frame cleanup
                      if (nameRef.current) {
                        const nameRect = nameRef.current.getBoundingClientRect();
                        previousPositionRef.current = { top: nameRect.top, left: nameRect.left };
                      }
                    }}
                    onAnimationComplete={() => {
                      // Stop frame-by-frame tracking
                      if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                        animationFrameRef.current = null;
                      }

                      // Animation complete - mark layout as animated if tagline is done
                      if (taglineTypingComplete && !hasLayoutAnimatedOnce) {
                        setHasLayoutAnimatedOnce(true);
                      }
                    }}
                    style={{
                      transformOrigin: 'center top',

                      willChange: 'transform',
                      position: 'relative',
                      display: 'inline-flex',
                      justifyContent: 'center'
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
                        // Disable glow effect during first load animation
                        if (textWrapperRef.current && hasLayoutAnimatedOnce) {
                          const rect = textWrapperRef.current.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          setMousePosition({ x, y });
                          setIsMouseOverText(true);
                        }
                      }}
                      onMouseEnter={() => hasLayoutAnimatedOnce && setIsMouseOverText(true)}
                      onMouseLeave={() => setIsMouseOverText(false)}
                    >
                      {/* Base text that shows without hover */}
                      <span className={cn(
                        "transition-opacity duration-200",
                        hasLayoutAnimatedOnce && "group-hover:opacity-0"
                      )}>
                        <TypingAnimation
                          text={`Hi, I'm ${personalInfo.name.split(' ')[0]}`}
                          accentColor={accentColor}
                          hideCursor={nameTypingComplete}
                          onComplete={() => {
                            setNameTypingComplete(true);
                          }}
                        />
                      </span>

                      {/* Gradient text that shows on hover - ONLY through letters (disabled during first load) */}
                      <span
                        className="absolute inset-0 pointer-events-none select-none transition-opacity duration-150"
                        style={{
                          opacity: (isMouseOverText && hasLayoutAnimatedOnce) ? 1 : 0,
                          backgroundImage: `radial-gradient(circle 60px at ${mousePosition.x}px ${mousePosition.y}px, ${accentColor} 0%, ${accentAlpha(65)} 25%, currentColor 60%)`,
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
                        Hi, I&apos;m {personalInfo.name.split(' ')[0]}
                      </span>
                    </span>
                  </motion.h1>

                  {/* Tagline - stays big until typing completes, then BOTH shrink together (only on first load) */}
                  <motion.p
                    className="text-sm sm:text-lg text-muted-foreground"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                    }}
                    style={{
                      transformOrigin: 'center top',
                      willChange: 'transform',
                      position: 'relative',
                      display: 'inline-flex',
                      justifyContent: 'center'
                    }}
                  >
                    {(
                      <TypingAnimation
                        text={personalInfo.tagline}
                        accentColor={accentColor}
                        showBlinkingCursor={true}
                        onComplete={() => {
                          setTaglineTypingComplete(true);
                          setTimeout(() => {
                            setInitialAnimationComplete(true);
                          }, 400);
                        }}
                      />
                    )}
                  </motion.p>

                  {/* Quick Stats - appear after typing animation */}
                  <motion.div
                    className="flex items-center justify-center gap-3 sm:gap-6 mt-4 flex-wrap"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Projects count */}
                    <Link href="/browse?section=projects">
                      <motion.div
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground/80 hover:text-accent-color transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FolderKanban className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: accentColor }} />
                        <span className="hidden sm:inline">Projects</span>
                      </motion.div>
                    </Link>



                    <span className="text-muted-foreground/30">|</span>

                    {/* QuinStreet */}
                    <Link href="/browse?section=experience">
                      <motion.div
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground/80 hover:text-accent-color transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: accentColor }} />
                        <span>QuinStreet</span>
                      </motion.div>
                    </Link>

                    <span className="text-muted-foreground/30">|</span>

                    {/* Location */}
                    <Link href="/browse?section=education">
                      <motion.div
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground/80 hover:text-accent-color transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: accentColor }} />
                        <span>San Francisco</span>
                      </motion.div>
                    </Link>

                    {/* Availability badge */}
                    <motion.div
                      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: accentAlpha(10),
                        color: accentColor,
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Open to conversations</span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Suggestions - always rendered, control visibility with opacity */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: showSuggestions ? 1 : 0 }}
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
            </div>
          </div>
        ) : (
          // Chat messages with scroll container
          <>
            <div ref={scrollAreaRef} className="flex-1 overflow-y-auto scroll-smooth relative min-h-0">
              <div className="space-y-0 pb-4">
                {currentChat && <Message {...currentChat} accentColor={accentColor} />}
                {response && (
                  <Message
                    {...response}
                    isStreaming={isLoading && response.content.length > 0}
                    accentColor={accentColor}
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
                      boxShadow: `0 4px 12px ${accentAlpha(19)}, 0 2px 4px ${accentAlpha(12)}`,
                    }}
                  >
                    <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Input area - always rendered, control visibility with opacity */}
      <motion.div
        className="flex-shrink-0 bg-background/95 backdrop-blur-xl backdrop-saturate-150 z-20"
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: 1,
          y: 0
        }}
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
            onRandomPrompt={() => {
              // Get all questions from FAQs
              const faqQuestions = personalInfo.faqs?.map(faq => faq.question) || [];

              // Get all prompts from categories
              const categoryPrompts = promptCategories.flatMap(cat => cat.prompts);

              // Combine all prompts
              const allQuestions = [...faqQuestions, ...categoryPrompts];

              if (allQuestions.length === 0) return;

              // Pick a random one
              const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
              setQuery(randomQuestion);
              inputRef.current?.focus();
            }}
          />
        </div>
      </motion.div>
    </div >
  );
}
