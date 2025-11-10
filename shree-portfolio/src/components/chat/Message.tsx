'use client';

import { motion } from 'framer-motion';
import { User, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Citation } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/store/ui-store';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export function Message({ role, content, citations, isStreaming }: MessageProps) {
  const { setSelectedItem } = useUIStore();

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
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 max-w-4xl",
        role === 'user' ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        role === 'user' ? "bg-primary text-primary-foreground" : "bg-ai-primary text-white"
      )}>
        {role === 'user' ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-2">
        <div className={cn(
          "px-4 py-3 rounded-2xl",
          role === 'user' 
            ? "message-user bg-primary text-primary-foreground" 
            : "message-ai bg-muted"
        )}>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Streaming indicator */}
          {isStreaming && (
            <span className="inline-flex gap-1 ml-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-1 h-1 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="w-1 h-1 bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                className="w-1 h-1 bg-current rounded-full"
              />
            </span>
          )}
        </div>

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {citations.map((citation, index) => (
              <Badge
                key={index}
                variant="outline"
                className="citation-chip cursor-pointer hover:bg-citation/20"
                onClick={() => handleCitationClick(citation)}
              >
                {citation.type === 'project' && '📁'}
                {citation.type === 'experience' && '💼'}
                {citation.type === 'education' && '🎓'}
                {citation.type === 'skill' && '🛠️'}
                {citation.type === 'resume' && '📄'}
                <span className="ml-1">{citation.title}</span>
                {citation.url && <ExternalLink className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
