'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { Send, Loader2, AlertCircle, X, FolderKanban, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from './Message';
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

export function ChatInterface() {
  const [query, setQuery] = useState('');
  const [currentChat, setCurrentChat] = useState<ChatMessage | null>(null);
  const [response, setResponse] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');
  const inputRef = useRef<HTMLInputElement>(null);

  const { chatContext, clearChatContext, newChatTrigger } = useUIStore();

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

  // Helper function to get glow style based on state
  const getInputGlowStyle = (focused: boolean, hovered: boolean) => {
    if (focused) {
      // Intense glow when focused (clicked)
      return `0 0 0 2px ${accentColor.replace(')', ' / 0.5)')}, 0 0 30px ${accentColor.replace(')', ' / 0.5)')}, 0 0 60px ${accentColor.replace(')', ' / 0.3)')}, 0 0 90px ${accentColor.replace(')', ' / 0.15)')}`;
    } else if (hovered) {
      // Medium glow when hovered
      return `0 0 0 1px ${accentColor.replace(')', ' / 0.3)')}, 0 0 20px ${accentColor.replace(')', ' / 0.3)')}, 0 0 40px ${accentColor.replace(')', ' / 0.15)')}`;
    } else {
      // Normal shadow
      return '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery('');
    setError(null);
    setShowSuggestions(false);

    // Set user message
    setCurrentChat({ role: 'user', content: userMessage });
    setResponse({ role: 'assistant', content: '', citations: [] });
    setIsLoading(true);

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
              setResponse({ role: 'assistant', content: '', citations });
            } else if (data.type === 'chunk') {
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

  const handleNewChat = () => {
    setCurrentChat(null);
    setResponse(null);
    setError(null);
    setShowSuggestions(true);
    setIsInputFocused(false);
    setIsInputHovered(false);
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
          /* Empty state - clean minimal design */
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
              {/* Centered title */}
              <div className="text-center mb-12">
                <h1
                  className="text-4xl font-semibold mb-3 transition-all duration-300 hover:scale-105 cursor-pointer"
                  data-cursor-expand
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textShadow = `0 0 20px ${accentColor.replace(')', ' / 0.5)')}, 0 0 40px ${accentColor.replace(')', ' / 0.3)')}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  Hi, I'm {personalInfo.name.split(' ')[0]}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {personalInfo.tagline}
                </p>
              </div>

              {/* Larger centered input */}
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about projects, experience, or skills..."
                    disabled={isLoading}
                    className="w-full h-16 text-base px-6 pr-16 rounded-xl shadow-sm focus-visible:ring-accent-color transition-all duration-300"
                    style={{
                      transition: 'all 0.3s ease',
                      boxShadow: getInputGlowStyle(isInputFocused, isInputHovered),
                    }}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onMouseEnter={() => setIsInputHovered(true)}
                    onMouseLeave={() => setIsInputHovered(false)}
                    data-cursor-expand
                  />
                  <Button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-accent-color hover:bg-accent-color/90 text-white border-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Suggestions */}
              {showSuggestions && (
                <PromptSuggestions
                  onSelectPrompt={handlePromptSelect}
                  isVisible={true}
                  contextType={chatContext.enabled ? chatContext.itemType : null}
                />
              )}
            </div>
          </div>
        ) : (
          // Chat messages
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-0">
              {currentChat && <Message {...currentChat} />}
              {response && (
                <Message 
                  {...response} 
                  isStreaming={isLoading && response.content.length > 0}
                />
              )}
              {isLoading && !response && (
                <div className="w-full">
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground pt-0.5">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="w-full py-6">
                  <div className="max-w-3xl mx-auto px-4 sm:px-6">
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input area - only shown when in conversation */}
      {(currentChat || response) && (
        <div className="bg-background">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  disabled={isLoading}
                  className="w-full h-14 text-base px-5 pr-16 rounded-xl focus-visible:ring-accent-color transition-all duration-300"
                  style={{
                    transition: 'all 0.3s ease',
                    boxShadow: getInputGlowStyle(isInputFocused, isInputHovered),
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onMouseEnter={() => setIsInputHovered(true)}
                  onMouseLeave={() => setIsInputHovered(false)}
                  data-cursor-expand
                />
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isLoading}
                    size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-accent-color hover:bg-accent-color/90 text-white border-0"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
