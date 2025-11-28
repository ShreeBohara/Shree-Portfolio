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
  onSelectPrompt,
  index,
  totalCount
}: {
  category: PromptCategory;
  onSelectPrompt: (prompt: string) => void;
  index: number;
  totalCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always open upward since pills are near bottom of content area
  useEffect(() => {
    if (isOpen) {
      setOpenUpward(true);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
    }
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handlePromptClick = (prompt: string) => {
    onSelectPrompt(prompt);
    setIsOpen(false);
  };

  const Icon = category.icon;

  // Determine dropdown horizontal position
  const isRightSide = index >= totalCount / 2;

  return (
    <motion.div
      ref={pillRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pill button */}
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2
          rounded-xl border transition-all duration-200
          text-sm font-medium
          ${isOpen
            ? 'bg-accent-color/10 border-accent-color/50 text-accent-color shadow-lg shadow-accent-color/10'
            : 'bg-card/40 border-border/40 text-muted-foreground hover:border-accent-color/30 hover:text-foreground hover:bg-card/60'
          }
          backdrop-blur-sm
          touch-manipulation
          group
        `}
      >
        <Icon className={`h-4 w-4 transition-colors duration-200 ${isOpen ? 'text-accent-color' : 'text-muted-foreground group-hover:text-accent-color'}`} />
        <span>{category.title}</span>
        <ChevronDown
          className={`
            h-3.5 w-3.5 ml-0.5 transition-transform duration-200 opacity-50 group-hover:opacity-100
            ${isOpen ? 'rotate-180 text-accent-color opacity-100' : ''}
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? -8 : 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? -8 : 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`
              absolute z-50 min-w-[220px]
              ${openUpward ? 'bottom-full mb-3' : 'top-full mt-3'}
              ${isRightSide ? 'right-0' : 'left-0'}
            `}
          >
            <div className="bg-card/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-border/50 dark:border-zinc-700/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden ring-1 ring-white/5">
              <div className="py-1.5">
                {category.prompts.map((prompt, promptIndex) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: promptIndex * 0.03 + 0.05 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent-color/10 transition-all duration-200 flex items-center gap-3 group/item"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-color/40 group-hover/item:bg-accent-color group-hover/item:scale-125 transition-all duration-200" />
                    <span className="truncate">{prompt}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PromptSuggestions({ onSelectPrompt, isVisible, contextType }: PromptSuggestionsProps) {
  if (!isVisible) return null;

  // Select appropriate categories based on context
  const categories = contextType && contextPrompts[contextType]
    ? contextPrompts[contextType]
    : promptCategories;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto"
    >
      {categories.map((category, index) => (
        <CategoryPill
          key={category.id}
          category={category}
          onSelectPrompt={onSelectPrompt}
          index={index}
          totalCount={categories.length}
        />
      ))}
    </motion.div>
  );
}
