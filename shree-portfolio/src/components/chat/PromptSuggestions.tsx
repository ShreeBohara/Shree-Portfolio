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
  const suggestions = contextType === 'project'
    ? projectSuggestions
    : contextType === 'experience'
    ? experienceSuggestions
    : contextType === 'education'
    ? educationSuggestions
    : defaultSuggestions;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-3 sm:grid-cols-2 max-w-3xl mx-auto"
    >
      {suggestions.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.prompt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group text-left px-5 py-4 rounded-xl border border-border/50 bg-card hover:bg-accent-color/5 hover:border-accent-color/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2.5 rounded-lg group-hover:bg-muted transition-all">
                <Icon className="h-5 w-5 text-accent-color transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1 text-foreground group-hover:text-accent-color transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
