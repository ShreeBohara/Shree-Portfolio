'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, MessageCircle, User } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  isVisible: boolean;
}

// Only 4 carefully selected prompts
const suggestions = [
  {
    icon: Zap,
    prompt: "What are your top 3 AI/ML projects with impact metrics?",
    color: "text-yellow-500"
  },
  {
    icon: TrendingUp,
    prompt: "Tell me about your current role and key achievements",
    color: "text-green-500"
  },
  {
    icon: MessageCircle,
    prompt: "What's your experience with full-stack development?",
    color: "text-blue-500"
  },
  {
    icon: User,
    prompt: "Give me a quick introduction about yourself",
    color: "text-purple-500"
  }
];

export function PromptSuggestions({ onSelectPrompt, isVisible }: PromptSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-2 sm:grid-cols-2"
    >
      {suggestions.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectPrompt(item.prompt)}
            className="text-left px-4 py-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
              <p className="text-sm text-foreground/70">
                {item.prompt}
              </p>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
