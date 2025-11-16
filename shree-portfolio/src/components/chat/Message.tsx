'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, ExternalLink, FolderKanban, Briefcase, GraduationCap, Wrench, FileText, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Citation } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/store/ui-store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CalendlyCTA } from './CalendlyCTA';
import { useMemo, useRef, useEffect, useState } from 'react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
  accentColor?: string;
  isLoading?: boolean;
  noBorder?: boolean;
}

// Keywords that trigger showing the Calendly CTA
const CALENDLY_TRIGGERS = [
  'book a call',
  'schedule a call',
  'calendly',
  'let\'s chat',
  'connect with shree',
  'discuss further',
  'talk more about',
  'schedule time',
  'set up a call',
  'hop on a call',
  'reach out',
  'get in touch'
];

// Code Block component with copy functionality
function CodeBlock({ children, className, accentColor = 'oklch(0.72 0.12 185)', ...props }: any) {
  const [copied, setCopied] = useState(false);
  const codeContent = String(children).trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group my-3">
      <pre className="overflow-x-auto rounded-lg bg-muted/50 border border-border/50 p-4">
        <code className={cn("text-sm font-mono block", className)} {...props}>
          {children}
        </code>
      </pre>
      <motion.button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          color: copied ? accentColor : 'inherit',
        }}
        whileHover={{
          borderColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}30`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" style={{ color: accentColor }} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.2 }}
            >
              <Copy className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export function Message({ role, content, citations, isStreaming, accentColor = 'oklch(0.72 0.12 185)', isLoading = false, noBorder = false }: MessageProps) {
  const { setSelectedItem } = useUIStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content mentions booking a call or similar keywords
  const shouldShowCalendlyCTA = useMemo(() => {
    if (role !== 'assistant' || isStreaming) return false;
    const lowerContent = content.toLowerCase();
    return CALENDLY_TRIGGERS.some(trigger => lowerContent.includes(trigger));
  }, [role, content, isStreaming]);

  // Append cursor to the last text node when streaming
  useEffect(() => {
    if (!contentRef.current || !isStreaming) {
      // Remove cursor when not streaming
      const existingCursor = contentRef.current?.querySelector('.terminal-cursor');
      if (existingCursor) {
        existingCursor.remove();
      }
      return;
    }

    // Use requestAnimationFrame to batch cursor updates and prevent multiple cursors
    const frameId = requestAnimationFrame(() => {
      if (!contentRef.current) return;

      // Remove ALL existing cursors first (in case multiple were added)
      const existingCursors = contentRef.current.querySelectorAll('.terminal-cursor');
      existingCursors.forEach(cursor => cursor.remove());

      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      let lastTextNode: Text | null = null;
      let currentNode: Node | null;

      while ((currentNode = walker.nextNode())) {
        if (currentNode.textContent?.trim()) {
          lastTextNode = currentNode as Text;
        }
      }

      if (lastTextNode) {
        // Create cursor element with stable rendering
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'terminal-cursor';
        cursorSpan.style.cssText = `
          display: inline-block;
          background-color: ${accentColor};
          color: #000000;
          width: 0.65em;
          height: 1.2em;
          vertical-align: text-bottom;
          margin-left: 2px;
          box-shadow: 0 0 10px ${accentColor}60, 0 0 5px ${accentColor}40;
          will-change: transform;
        `;
        cursorSpan.textContent = ' ';

        // Insert cursor after the last text node
        const parent = lastTextNode.parentNode;
        if (parent) {
          parent.insertBefore(cursorSpan, lastTextNode.nextSibling);
        }
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      // Clean up cursor on unmount or when dependencies change
      const existingCursor = contentRef.current?.querySelector('.terminal-cursor');
      if (existingCursor) {
        existingCursor.remove();
      }
    };
  }, [content, isStreaming, accentColor]);

  const handleCitationClick = (citation: Citation) => {
    if (citation.type === 'project' || citation.type === 'experience' || citation.type === 'education') {
      setSelectedItem(citation.id, citation.type);
    } else if (citation.url) {
      window.open(citation.url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "w-full",
        !noBorder && "border-b border-border/30",
        role === 'user' && "bg-muted/20",
        role === 'assistant' && "bg-background"
      )}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-4 items-start">
          {/* Icon with background - staggered animation */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring",
            }}
          >
        {role === 'user' ? (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-foreground" />
              </div>
        ) : (
              <div className="w-8 h-8 rounded-full bg-accent-color/10 flex items-center justify-center ring-1 ring-accent-color/20">
                <Bot className="h-4 w-4 text-accent-color" />
              </div>
        )}
          </motion.div>

      {/* Message content - staggered animation */}
      <motion.div
        className="flex-1 space-y-3 min-w-0"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
          {isLoading && !content ? (
            // Loading state - show simple animation
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="text-sm text-muted-foreground">Thinking</span>
            </div>
          ) : (
            <div
              ref={contentRef}
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none font-sans",
                role === 'user'
                    ? "text-foreground font-medium"
                  : "text-foreground"
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                // Style headings
                h1: ({node, ...props}) => <h1 className="text-xl font-semibold mb-3 mt-4 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2 mt-3 first:mt-0" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props} />,

                // Style paragraphs
                p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,

                // Style lists
                ul: ({node, ...props}) => <ul className="mb-3 ml-4 list-disc space-y-1.5" {...props} />,
                ol: ({node, ...props}) => <ol className="mb-3 ml-4 list-decimal space-y-1.5" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,

                // Style bold and italic
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,

                // Style code
                code: ({node, inline, ...props}: any) =>
                  inline ? (
                    <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono" {...props} />
                  ) : (
                    <CodeBlock accentColor={accentColor} {...props} />
                  ),
                pre: ({node, children, ...props}) => <>{children}</>,

                // Style links
                a: ({node, ...props}: any) => (
                  <a
                      className="text-accent-color underline underline-offset-2 hover:text-accent-color/80 transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),

                // Style blockquotes
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-3" {...props} />
                ),

                // Style horizontal rules
                hr: ({node, ...props}) => <hr className="my-4 border-border" {...props} />,
              }}
            >
                {content}
              </ReactMarkdown>
            </div>
          )}

        {/* Citations - staggered animation */}
        {citations && citations.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.4,
              ease: "easeOut",
            }}
          >
            {citations.map((citation, index) => {
              const Icon = citation.type === 'project' ? FolderKanban
                : citation.type === 'experience' ? Briefcase
                : citation.type === 'education' ? GraduationCap
                : citation.type === 'skill' ? Wrench
                : FileText;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleCitationClick(citation)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted hover:border-accent-color/50 transition-all group font-mono text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.5 + index * 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-color transition-colors" />
                  <span className="text-foreground group-hover:text-accent-color transition-colors">
                    {citation.title}
                  </span>
                  {citation.url && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover:text-accent-color/60 transition-colors" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Calendly CTA - shown when AI suggests booking a call */}
        {shouldShowCalendlyCTA && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5,
              ease: "easeOut",
            }}
          >
            <CalendlyCTA compact />
          </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
