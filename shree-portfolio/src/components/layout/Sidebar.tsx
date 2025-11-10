'use client';

import { ChevronLeft, ChevronRight, Briefcase, GraduationCap, Folder } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

type Section = 'projects' | 'experience' | 'education';

interface SidebarProps {
  activeSection?: Section;
  onSectionChange?: (section: Section) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const isBrowsePage = pathname === '/browse';

  const handleSectionClick = (section: Section) => {
    if (isBrowsePage && onSectionChange) {
      // If already on browse page, just change the section
      onSectionChange(section);
    } else {
      // If on chat page, navigate to browse with the section
      router.push(`/browse?section=${section}`);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-full bg-sidebar border-r transition-all duration-300",
          "pt-[calc(var(--header-height)+1rem)]",
          isSidebarOpen ? "w-[280px]" : "w-0 lg:w-[60px]",
          "lg:relative lg:pt-0"
        )}
      >
        <div className={cn(
          "h-full flex flex-col",
          !isSidebarOpen && "lg:items-center"
        )}>
          {/* Toggle button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-3 top-6 z-40 h-6 w-6 rounded-full border bg-background shadow-sm"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>

          {/* Section tabs */}
          <div className={cn(
            "flex flex-col gap-1 p-4",
            !isSidebarOpen && "lg:p-2"
          )}>
            <Button
              variant={isBrowsePage && activeSection === 'projects' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('projects')}
              className={cn(
                "justify-start",
                !isSidebarOpen && "lg:justify-center"
              )}
            >
              <Folder className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Projects</span>}
            </Button>
            <Button
              variant={isBrowsePage && activeSection === 'experience' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('experience')}
              className={cn(
                "justify-start",
                !isSidebarOpen && "lg:justify-center"
              )}
            >
              <Briefcase className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Experience</span>}
            </Button>
            <Button
              variant={isBrowsePage && activeSection === 'education' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('education')}
              className={cn(
                "justify-start",
                !isSidebarOpen && "lg:justify-center"
              )}
            >
              <GraduationCap className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Education</span>}
            </Button>
          </div>

          {/* Section info - only when sidebar is open */}
          {isSidebarOpen && (
            <div className="flex-1 px-4 pb-4">
              {!isBrowsePage ? (
                // On chat page, show general info
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Quick Navigation</p>
                  <p className="text-xs">Click any section to browse my portfolio</p>
                </div>
              ) : (
                // On browse page, show section-specific info
                <>
                  {activeSection === 'projects' && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Browse my portfolio projects</p>
                      <p className="text-xs">Filter and explore my work</p>
                    </div>
                  )}

                  {activeSection === 'experience' && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Professional Experience</p>
                      <p className="text-xs">My career journey and achievements</p>
                    </div>
                  )}

                  {activeSection === 'education' && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Education Background</p>
                      <p className="text-xs">Academic qualifications and coursework</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
