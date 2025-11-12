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

interface PortfolioLayoutProps {
  children: React.ReactNode;
  showCatalog?: boolean;
  initialSection?: 'projects' | 'experience' | 'education';
}

export function PortfolioLayout({ children, showCatalog = false, initialSection = 'projects' }: PortfolioLayoutProps) {
  const { isDetailsPanelOpen, isSidebarOpen } = useUIStore();
  const [activeSection, setActiveSection] = useState<'projects' | 'experience' | 'education'>(initialSection);

  // Update activeSection when initialSection changes
  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Full height */}
        <Sidebar 
          activeSection={showCatalog ? activeSection : undefined} 
          onSectionChange={showCatalog ? setActiveSection : undefined} 
        />

      {/* Main layout - starts after sidebar */}
      <div className={cn(
        "flex flex-col h-screen transition-all duration-300",
        isSidebarOpen ? "lg:ml-[280px]" : "lg:ml-[60px]"
      )}>
        {/* Header */}
        <Header />

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
                <div className="px-6 lg:px-8 pt-6">
                  <SectionTabs
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                </div>

                {/* Catalog Content */}
                <div className="flex-1 px-6 lg:px-8 py-6">
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
