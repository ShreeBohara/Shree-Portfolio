'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Briefcase, Target, Sparkles, ChevronDown } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  isVisible: boolean;
  contextType?: 'project' | 'experience' | 'education' | null;
}

export interface PromptCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  prompts: string[];
}

// Main categories with their prompts
export const promptCategories: PromptCategory[] = [
  {
    id: 'projects',
    icon: Zap,
    title: 'Projects',
    prompts: [
      "What are your top 3 AI/ML projects?",
      "Tell me about EchoLens",
      "Tell me about GlobaLens",
      "Biggest technical challenge?",
      "Tell me about Pond"
    ]
  },
  {
    id: 'experience',
    icon: Briefcase,
    title: 'Experience',
    prompts: [
      "Full-stack experience?",
      "Work at QuinStreet?",
      "What did you learn at DeepTek?",
      "How do you learn new tech?",
      "Why USC?"
    ]
  },
  {
    id: 'hire-me',
    icon: Target,
    title: 'Hire Me',
    prompts: [
      "Why should we hire you?",
      "What motivates you?",
      "Greatest strength?",
      "Where in 5 years?",
      "Biggest weakness?"
    ]
  },
  {
    id: 'fun',
    icon: Sparkles,
    title: 'Fun Stuff',
    prompts: [
      "Favorite book?",
      "What do you do for fun?",
      "Favorite podcasts?",
      "Fun fact about Shree?",
      "Favorite chess opening?",
      "Dream travel destination?"
    ]
  }
];

// Context-specific prompts
const contextPrompts: Record<string, PromptCategory[]> = {
  project: [
    {
      id: 'tech',
      icon: Zap,
      title: 'Tech',
      prompts: [
        "Technologies used?",
        "Architecture decisions?",
        "How did you handle scale?"
      ]
    },
    {
      id: 'challenges',
      icon: Target,
      title: 'Challenges',
      prompts: [
        "Biggest challenges?",
        "How did you debug?",
        "What would you change?"
      ]
    },
    {
      id: 'impact',
      icon: Briefcase,
      title: 'Impact',
      prompts: [
        "How did you measure success?",
        "Business impact?",
        "User feedback?"
      ]
    },
    {
      id: 'role',
      icon: Sparkles,
      title: 'Role',
      prompts: [
        "Your contribution?",
        "Team collaboration?",
        "What did you learn?"
      ]
    }
  ],
  experience: [
    {
      id: 'responsibilities',
      icon: Briefcase,
      title: 'Day-to-day',
      prompts: [
        "Main responsibilities?",
        "Typical day?",
        "Team size?"
      ]
    },
    {
      id: 'achievements',
      icon: Target,
      title: 'Wins',
      prompts: [
        "Biggest achievements?",
        "Most proud of?",
        "Recognition received?"
      ]
    },
    {
      id: 'tech',
      icon: Zap,
      title: 'Tech',
      prompts: [
        "Technologies used?",
        "Dev workflow?",
        "New tools introduced?"
      ]
    },
    {
      id: 'learning',
      icon: Sparkles,
      title: 'Growth',
      prompts: [
        "What did you learn?",
        "How did it shape you?",
        "Skills developed?"
      ]
    }
  ],
  education: [
    {
      id: 'coursework',
      icon: Zap,
      title: 'Classes',
      prompts: [
        "Relevant courses?",
        "Favorite class?",
        "Theory to practice?"
      ]
    },
    {
      id: 'projects',
      icon: Target,
      title: 'Projects',
      prompts: [
        "Academic projects?",
        "Research experience?",
        "Capstone project?"
      ]
    },
    {
      id: 'skills',
      icon: Briefcase,
      title: 'Skills',
      prompts: [
        "Skills developed?",
        "Theory applied?",
        "Certifications?"
      ]
    },
    {
      id: 'experience',
      icon: Sparkles,
      title: 'Overall',
      prompts: [
        "How did it prepare you?",
        "Extracurriculars?",
        "Why this program?"
      ]
    }
  ]
};

function CategoryPill({
  category,
  isActive,
  onToggle,
}: {
  category: PromptCategory;
  isActive: boolean;
  onToggle: () => void;
}) {
  const Icon = category.icon;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`
        flex items-center gap-2 px-4 py-2
        rounded-xl border transition-all duration-200
        text-sm font-medium
        ${isActive
          ? 'bg-accent-color/10 border-accent-color/50 text-accent-color shadow-lg shadow-accent-color/10'
          : 'bg-card/40 border-border/40 text-muted-foreground hover:border-accent-color/30 hover:text-foreground hover:bg-card/60'
        }
        backdrop-blur-sm
        touch-manipulation
        group
      `}
    >
      <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-accent-color' : 'text-muted-foreground group-hover:text-accent-color'}`} />
      <span>{category.title}</span>
      <ChevronDown
        className={`
          h-3.5 w-3.5 ml-0.5 transition-transform duration-200 opacity-50 group-hover:opacity-100
          ${isActive ? 'rotate-180 text-accent-color opacity-100' : ''}
        `}
      />
    </button>
  );
}

export function PromptSuggestions({ onSelectPrompt, isVisible, contextType }: PromptSuggestionsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveCategoryId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isVisible) return null;

  // Select appropriate categories based on context
  const categories = contextType && contextPrompts[contextType]
    ? contextPrompts[contextType]
    : promptCategories;

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto flex flex-col items-center relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative z-10"
      >
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isActive={activeCategoryId === category.id}
            onToggle={() => setActiveCategoryId(activeCategoryId === category.id ? null : category.id)}
          />
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-2 w-full"
          >
            <div className="bg-card/95 dark:bg-zinc-900/95 backdrop-blur-md border border-border/40 rounded-xl p-3 shadow-xl">
              <div className="columns-1 sm:columns-2 gap-2">
                {activeCategory.prompts.map((prompt, index) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onSelectPrompt(prompt)}
                    className="w-full text-left p-2.5 mb-2 rounded-lg hover:bg-accent-color/10 hover:text-accent-color transition-colors duration-200 flex items-start gap-2.5 group break-inside-avoid"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-color/40 group-hover:bg-accent-color transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground leading-relaxed">{prompt}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
