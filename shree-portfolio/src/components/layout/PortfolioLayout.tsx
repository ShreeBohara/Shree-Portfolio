'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DetailsPanel } from './DetailsPanel';
import { ProjectGrid } from '@/components/catalog/ProjectGrid';
import { ExperienceSection } from '@/components/catalog/ExperienceSection';
import { EducationSection } from '@/components/catalog/EducationSection';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

interface PortfolioLayoutProps {
  children: React.ReactNode;
  showCatalog?: boolean;
  initialSection?: 'projects' | 'experience' | 'education';
}

export function PortfolioLayout({ children, showCatalog = false, initialSection = 'projects' }: PortfolioLayoutProps) {
  const { isDetailsPanelOpen } = useUIStore();
  const [activeSection, setActiveSection] = useState<'projects' | 'experience' | 'education'>(initialSection);

  // Update activeSection when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main layout */}
      <div className="flex h-screen pt-[var(--header-height)]">
        {/* Sidebar */}
        <Sidebar 
          activeSection={showCatalog ? activeSection : undefined} 
          onSectionChange={showCatalog ? setActiveSection : undefined} 
        />

        {/* Main content area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 px-6 lg:px-8",
            isDetailsPanelOpen && "lg:mr-[400px]" // Reserve space for details panel on desktop
          )}
        >
          <div className="h-full overflow-y-auto">
            {showCatalog ? (
              <>
                {activeSection === 'projects' && <ProjectGrid />}
                {activeSection === 'experience' && <ExperienceSection />}
                {activeSection === 'education' && <EducationSection />}
              </>
            ) : (
              children
            )}
          </div>
        </main>

        {/* Details panel */}
        <DetailsPanel />
      </div>
    </div>
  );
}
