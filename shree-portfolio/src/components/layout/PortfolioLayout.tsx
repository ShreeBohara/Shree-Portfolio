'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DetailsPanel } from './DetailsPanel';
import { ProjectGrid } from '@/components/catalog/ProjectGrid';
import { ExperienceSection } from '@/components/catalog/ExperienceSection';
import { EducationSection } from '@/components/catalog/EducationSection';
import { SectionTabs } from '@/components/catalog/SectionTabs';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PortfolioLayoutProps {
  children: React.ReactNode;
  showCatalog?: boolean;
  initialSection?: 'projects' | 'experience' | 'education';
}

export function PortfolioLayout({ children, showCatalog = false, initialSection = 'projects' }: PortfolioLayoutProps) {
  const {
    isDetailsPanelOpen,
    isSidebarOpen,
    isInitialAnimationComplete,
    hasLayoutAnimatedOnce,
    setHasLayoutAnimatedOnce
  } = useUIStore();
  const [activeSection, setActiveSection] = useState<'projects' | 'experience' | 'education'>(initialSection);

  // Update activeSection when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  // Mark layout as animated once the initial animation completes
  useEffect(() => {
    if (isInitialAnimationComplete && !hasLayoutAnimatedOnce) {
      setHasLayoutAnimatedOnce(true);
    }
  }, [isInitialAnimationComplete, hasLayoutAnimatedOnce, setHasLayoutAnimatedOnce]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Always rendered, control visibility with opacity */}
      <motion.div
        initial={hasLayoutAnimatedOnce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: isInitialAnimationComplete ? 1 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <Sidebar
          activeSection={showCatalog ? activeSection : undefined}
          onSectionChange={showCatalog ? setActiveSection : undefined}
        />
      </motion.div>

      {/* Main layout - starts after sidebar */}
      <div className={cn(
        "flex flex-col h-screen transition-all duration-300",
        // On mobile: no margin when closed, on desktop: always account for sidebar
        isSidebarOpen ? "ml-0 lg:ml-[280px]" : "ml-0 lg:ml-[60px]"
      )}>
        {/* Header - Always rendered, control visibility with opacity */}
        <motion.div
          initial={hasLayoutAnimatedOnce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: isInitialAnimationComplete ? 1 : 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <Header />
        </motion.div>

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 pt-[var(--header-height)]",
            isDetailsPanelOpen && "lg:mr-[400px]" // Reserve space for details panel on desktop
          )}
        >
          <div className="h-full overflow-y-auto">
            {showCatalog ? (
              <div className="flex flex-col h-full">
                {/* Section Tabs */}
                <div className="px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                  <SectionTabs
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                </div>

                {/* Catalog Content */}
                <div className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                  {activeSection === 'projects' && <ProjectGrid />}
                  {activeSection === 'experience' && <ExperienceSection />}
                  {activeSection === 'education' && <EducationSection />}
                </div>
              </div>
            ) : (
              <div className="h-full">
                {children}
              </div>
            )}
          </div>
        </main>

        {/* Details panel */}
        <DetailsPanel />
      </div>
    </div>
  );
}
