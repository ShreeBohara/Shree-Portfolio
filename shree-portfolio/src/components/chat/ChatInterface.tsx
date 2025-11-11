'use client';

import { useState, useRef, FormEvent } from 'react';
import { Send, Loader2, AlertCircle, X } from 'lucide-react';
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
import { personalInfo } from '@/data/portfolio';

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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { chatContext, clearChatContext } = useUIStore();

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
            <div className="container-max py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Context:</span>
                <Badge variant="secondary">
                  {chatContext.itemType === 'project' && '📁'}
                  {chatContext.itemType === 'experience' && '💼'}
                  {chatContext.itemType === 'education' && '🎓'}
                  <span className="ml-1">Focused on specific item</span>
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChatContext}
                className="h-7"
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
          /* Empty state - centered input like Claude */
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
              {/* Centered title */}
              <div className="text-center mb-12">
                <h1 className="text-3xl font-semibold mb-3">
                  Hi, I'm {personalInfo.name.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground">
                  {personalInfo.tagline}
                </p>
              </div>

              {/* Centered input */}
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about projects, experience, or skills..."
                    disabled={isLoading}
                    className="w-full h-14 text-base px-5 pr-14 rounded-xl shadow-sm"
                  />
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isLoading}
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Compact suggestions below input */}
              {showSuggestions && (
                <PromptSuggestions 
                  onSelectPrompt={handlePromptSelect}
                  isVisible={true}
                />
              )}
            </div>
          </div>
        ) : (
          // Chat messages
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
              {currentChat && <Message {...currentChat} />}
              {response && (
                <Message 
                  {...response} 
                  isStreaming={isLoading && response.content.length > 0}
                />
              )}
              {isLoading && !response && (
                <div className="flex items-center gap-3 text-muted-foreground pl-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ai-primary to-ai-primary/80 flex items-center justify-center shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                  <span className="text-sm font-medium">Thinking...</span>
                </div>
              )}
              {error && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input area - only shown when in conversation */}
      {(currentChat || response) && (
        <div className="border-t bg-background">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  disabled={isLoading}
                  className="w-full h-14 text-base px-5 pr-28 rounded-xl"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChat}
                    disabled={isLoading}
                  >
                    New
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
