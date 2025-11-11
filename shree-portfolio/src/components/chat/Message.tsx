'use client';

import { motion } from 'framer-motion';
import { User, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Citation } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/store/ui-store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CalendlyCTA } from './CalendlyCTA';
import { useMemo } from 'react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
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

export function Message({ role, content, citations, isStreaming }: MessageProps) {
  const { setSelectedItem } = useUIStore();

  // Check if content mentions booking a call or similar keywords
  const shouldShowCalendlyCTA = useMemo(() => {
    if (role !== 'assistant' || isStreaming) return false;
    const lowerContent = content.toLowerCase();
    return CALENDLY_TRIGGERS.some(trigger => lowerContent.includes(trigger));
  }, [role, content, isStreaming]);

  const handleCitationClick = (citation: Citation) => {
    if (citation.type === 'project' || citation.type === 'experience' || citation.type === 'education') {
      setSelectedItem(citation.id, citation.type);
    } else if (citation.url) {
      window.open(citation.url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-4 max-w-4xl",
        role === 'user' ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm",
        role === 'user' 
          ? "bg-primary text-primary-foreground" 
          : "bg-gradient-to-br from-ai-primary to-ai-primary/80 text-white"
      )}>
        {role === 'user' ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-3 min-w-0">
        <div className={cn(
          "rounded-2xl shadow-sm border",
          role === 'user' 
            ? "message-user bg-primary text-primary-foreground border-primary/20 px-5 py-3.5" 
            : "message-ai bg-card border-border/50 px-5 py-4"
        )}>
          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            role === 'user' 
              ? "prose-invert text-primary-foreground" 
              : "text-foreground"
          )}>
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
                    <code className="block p-3 rounded-lg bg-muted text-sm font-mono overflow-x-auto" {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="mb-3 overflow-x-auto" {...props} />,
                
                // Style links
                a: ({node, ...props}: any) => (
                  <a 
                    className="text-ai-primary hover:underline font-medium" 
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
            
            {/* Streaming indicator */}
            {isStreaming && (
              <span className="inline-flex gap-1 ml-2 align-middle">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 bg-current rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-current rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-current rounded-full"
                />
              </span>
            )}
          </div>
        </div>

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {citations.map((citation, index) => (
              <Badge
                key={index}
                variant="outline"
                className="citation-chip cursor-pointer hover:bg-citation/20 transition-colors border-border/50"
                onClick={() => handleCitationClick(citation)}
              >
                {citation.type === 'project' && '📁'}
                {citation.type === 'experience' && '💼'}
                {citation.type === 'education' && '🎓'}
                {citation.type === 'skill' && '🛠️'}
                {citation.type === 'resume' && '📄'}
                <span className="ml-1.5 text-xs font-medium">{citation.title}</span>
                {citation.url && <ExternalLink className="h-3 w-3 ml-1.5 opacity-60" />}
              </Badge>
            ))}
          </div>
        )}

        {/* Calendly CTA - shown when AI suggests booking a call */}
        {shouldShowCalendlyCTA && (
          <div className="px-1">
            <CalendlyCTA compact />
          </div>
        )}
      </div>
    </motion.div>
  );
}
