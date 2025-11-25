'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp, MessageCircle, User } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  isVisible: boolean;
  contextType?: 'project' | 'experience' | 'education' | null;
}

// Default prompts (no context)
const defaultSuggestions = [
  {
    icon: Zap,
    title: "Top Projects",
    prompt: "What are your top 3 AI/ML projects with impact metrics?",
  },
  {
    icon: TrendingUp,
    title: "Experience",
    prompt: "Tell me about your current role and key achievements",
  },
  {
    icon: MessageCircle,
    title: "Skills",
    prompt: "What's your experience with full-stack development?",
  },
  {
    icon: User,
    title: "About Me",
    prompt: "Give me a quick introduction about yourself",
  }
];

// Context-specific prompts for projects
const projectSuggestions = [
  {
    icon: Zap,
    title: "Technologies",
    prompt: "What technologies did you use and why?",
  },
  {
    icon: TrendingUp,
    title: "Challenges",
    prompt: "What were the biggest technical challenges?",
  },
  {
    icon: MessageCircle,
    title: "Impact",
    prompt: "How did you measure the success and impact?",
  },
  {
    icon: User,
    title: "Your Role",
    prompt: "What was your specific role and contribution?",
  }
];

// Context-specific prompts for experience
const experienceSuggestions = [
  {
    icon: Zap,
    title: "Responsibilities",
    prompt: "What were your main responsibilities?",
  },
  {
    icon: TrendingUp,
    title: "Achievements",
    prompt: "What were your biggest achievements in this role?",
  },
  {
    icon: MessageCircle,
    title: "Technologies",
    prompt: "What technologies and tools did you work with?",
  },
  {
    icon: User,
    title: "Learning",
    prompt: "What did you learn from this experience?",
  }
];

// Context-specific prompts for education
const educationSuggestions = [
  {
    icon: Zap,
    title: "Coursework",
    prompt: "What relevant courses did you take?",
  },
  {
    icon: TrendingUp,
    title: "Projects",
    prompt: "What academic projects did you work on?",
  },
  {
    icon: MessageCircle,
    title: "Skills",
    prompt: "What technical skills did you develop?",
  },
  {
    icon: User,
    title: "Experience",
    prompt: "How has your education prepared you for your career?",
  }
];

export function PromptSuggestions({ onSelectPrompt, isVisible, contextType }: PromptSuggestionsProps) {
  if (!isVisible) return null;

  // Select the appropriate suggestions based on context
  const allSuggestions = contextType === 'project'
    ? projectSuggestions
    : contextType === 'experience'
      ? experienceSuggestions
      : contextType === 'education'
        ? educationSuggestions
        : defaultSuggestions;

  // Show only first 2 suggestions on mobile for minimalist design
  const suggestions = allSuggestions;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-2 sm:gap-3 grid-cols-2 max-w-3xl mx-auto"
    >
      {suggestions.map((item, index) => {
        const Icon = item.icon;
        // Hide last 2 cards on mobile
        const isHiddenOnMobile = index >= 2;

        return (
          <motion.div
            key={item.prompt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            className={`relative group ${isHiddenOnMobile ? 'hidden sm:block' : ''}`}
          >
            {/* Sharp gradient border on hover */}
            <div
              className="absolute -inset-px rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, var(--accent-color), transparent, var(--accent-color))',
                backgroundSize: '200% 100%',
                animation: 'borderSlide 3s linear infinite',
                padding: '1px',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
            />

            <button
              onClick={() => onSelectPrompt(item.prompt)}
              className="relative w-full text-left px-3 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl border bg-gradient-to-br transition-all duration-200 backdrop-blur-sm hover:shadow-xl hover:shadow-accent-color/10 border-border/50 from-card/80 via-card/80 to-muted/40 dark:border-zinc-700/50 dark:from-zinc-900/50 dark:via-zinc-900/50 dark:to-zinc-800/50 group-hover:border-transparent touch-manipulation"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-muted/80 dark:bg-zinc-800/50 p-1.5 sm:p-2.5 rounded-lg group-hover:bg-accent-color/10 transition-all shrink-0">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent-color transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 text-foreground group-hover:text-accent-color transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1 sm:mb-2 hidden sm:block">
                    {item.prompt}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground/60 group-hover:text-accent-color/70 transition-colors">
                    $ click to ask
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
