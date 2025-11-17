'use client';

import { ChevronLeft, ChevronRight, Briefcase, GraduationCap, Folder, Download, Github as GithubIcon, Calendar, Mail, Linkedin } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { personalInfo } from '@/data/portfolio';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useSwipeable } from 'react-swipeable';

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

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      // Only open on mobile when closed
      if (!isSidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(true);
      }
    },
    onSwipedLeft: () => {
      // Only close on mobile when open
      if (isSidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum swipe distance
    preventScrollOnSwipe: false,
  });

  // Swipe handlers for edge swipe to open (swipe from left edge)
  const edgeSwipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (!isSidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(true);
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 30,
    preventScrollOnSwipe: false,
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Edge swipe detector - swipe from left edge to open sidebar */}
      {!isSidebarOpen && (
        <div
          {...edgeSwipeHandlers}
          className="fixed left-0 top-0 h-screen w-6 z-20 lg:hidden touch-pan-y"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        {...swipeHandlers}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r transition-all duration-300 touch-pan-y overflow-hidden",
          isSidebarOpen ? "w-[280px]" : "w-0 lg:w-[60px]"
        )}
      >
        <div className={cn(
          "h-full flex flex-col",
          !isSidebarOpen && "lg:items-center"
        )}>
          {/* Logo/Brand at top */}
          <div className={cn(
            "border-b h-[var(--header-height)] flex items-center overflow-hidden",
            isSidebarOpen ? "px-4 justify-between" : "lg:px-2 lg:justify-center"
          )}>
            {isSidebarOpen && (
              <h2 className="text-lg font-semibold whitespace-nowrap">
                {personalInfo.name.split(' ')[0]}
              </h2>
            )}
          {/* Toggle button - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
              className={cn(
                "hidden lg:flex h-8 w-8 shrink-0 hover:text-accent-color hover:bg-accent-color/10",
                !isSidebarOpen && "mx-auto"
              )}
          >
            {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
            ) : (
                <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          </div>

          {/* Section tabs */}
          <TooltipProvider delayDuration={300}>
          <div className={cn(
            "flex flex-col gap-1 p-4",
            !isSidebarOpen && "lg:p-2"
          )}>
              <Tooltip>
                <TooltipTrigger asChild>
            <Button
              variant={isBrowsePage && activeSection === 'projects' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('projects')}
              className={cn(
                      "justify-start shrink-0",
                      !isSidebarOpen && "lg:justify-center lg:w-10",
                      !(isBrowsePage && activeSection === 'projects') && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
                    <Folder className="h-4 w-4 shrink-0" />
                    {isSidebarOpen && <span className="ml-2 whitespace-nowrap">Projects</span>}
            </Button>
                </TooltipTrigger>
                {!isSidebarOpen && (
                  <TooltipContent side="right">
                    <p>Projects</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
            <Button
              variant={isBrowsePage && activeSection === 'experience' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('experience')}
              className={cn(
                      "justify-start shrink-0",
                      !isSidebarOpen && "lg:justify-center lg:w-10",
                      !(isBrowsePage && activeSection === 'experience') && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
                    <Briefcase className="h-4 w-4 shrink-0" />
                    {isSidebarOpen && <span className="ml-2 whitespace-nowrap">Experience</span>}
            </Button>
                </TooltipTrigger>
                {!isSidebarOpen && (
                  <TooltipContent side="right">
                    <p>Experience</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
            <Button
              variant={isBrowsePage && activeSection === 'education' ? 'secondary' : 'ghost'}
              size={isSidebarOpen ? 'sm' : 'icon'}
              onClick={() => handleSectionClick('education')}
              className={cn(
                      "justify-start shrink-0",
                      !isSidebarOpen && "lg:justify-center lg:w-10",
                      !(isBrowsePage && activeSection === 'education') && "hover:text-accent-color hover:bg-accent-color/10"
                    )}
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    {isSidebarOpen && <span className="ml-2 whitespace-nowrap">Education</span>}
                  </Button>
                </TooltipTrigger>
                {!isSidebarOpen && (
                  <TooltipContent side="right">
                    <p>Education</p>
                  </TooltipContent>
                    )}
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Quick Actions - at bottom */}
          <TooltipProvider delayDuration={300}>
            <div className={cn(
              "border-t mt-auto",
              isSidebarOpen ? "px-4 py-3" : "hidden lg:block px-2 py-3"
            )}>
              <div className={cn(
                "flex items-center",
                isSidebarOpen ? "gap-2" : "flex-col gap-2"
              )}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-accent-color hover:bg-accent-color/10" asChild>
                <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer" aria-label="Resume">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Resume</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-accent-color hover:bg-accent-color/10" asChild>
                <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon className="h-4 w-4" />
                </a>
              </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>GitHub</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-accent-color hover:bg-accent-color/10" asChild>
                <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>LinkedIn</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-accent-color hover:bg-accent-color/10" asChild>
                <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer" aria-label="Schedule Call">
                  <Calendar className="h-4 w-4" />
                </a>
              </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Schedule Call</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-accent-color hover:bg-accent-color/10" asChild>
                <a href={`mailto:${personalInfo.links.email}`} aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Email</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </aside>
    </>
  );
}
