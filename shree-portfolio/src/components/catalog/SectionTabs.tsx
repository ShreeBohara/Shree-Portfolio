'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FolderKanban, Briefcase, GraduationCap } from 'lucide-react';

interface SectionTabsProps {
  activeSection: 'projects' | 'experience' | 'education';
  onSectionChange: (section: 'projects' | 'experience' | 'education') => void;
}

const tabs = [
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'experience', label: 'Experience', Icon: Briefcase },
  { id: 'education', label: 'Education', Icon: GraduationCap },
] as const;

export function SectionTabs({ activeSection, onSectionChange }: SectionTabsProps) {
  const router = useRouter();

  const handleTabClick = (tabId: typeof activeSection) => {
    onSectionChange(tabId);

    // Update URL with query param
    const params = new URLSearchParams();
    params.set('section', tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="border-b border-border overflow-x-auto">
      <div className="flex items-center gap-0.5 sm:gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative px-3 sm:px-6 py-3 text-sm font-medium transition-colors touch-manipulation min-h-[44px]",
                "hover:text-accent-color",
                isActive
                  ? "text-accent-color"
                  : "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                <tab.Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-color"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
