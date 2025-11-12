'use client';

import { Menu, Download, Calendar, Mail, Github as GithubIcon, Linkedin, Moon, Sun, Monitor } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { personalInfo } from '@/data/portfolio';
import { ThemeColorPicker } from '@/components/ui/theme-color-picker';

export function Header() {
  const { toggleSidebar, isSidebarOpen, theme, setTheme, triggerNewChat } = useUIStore();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    // If already on chat page, start new conversation
    if (pathname === '/') {
      e.preventDefault();
      triggerNewChat();
    }
  };

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const themeIcon = theme === 'dark' ? <Sun className="h-4 w-4" /> : 
                    theme === 'light' ? <Moon className="h-4 w-4" /> : 
                    <Monitor className="h-4 w-4" />;

  return (
    <header className={cn(
      "fixed top-0 right-0 z-40 bg-background/80 backdrop-blur-sm header-height left-0 transition-all duration-300",
      isSidebarOpen ? "lg:left-[280px]" : "lg:left-[60px]"
    )}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Navigation tabs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:text-accent-color hover:bg-accent-color/10"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Navigation tabs */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                "h-8",
                pathname !== '/' && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
              <Link href="/" onClick={handleChatClick}>Chat</Link>
            </Button>
            <Button
              variant={pathname === '/browse' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                "h-8",
                pathname !== '/browse' && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
              <Link href="/browse">Browse</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Actions and Theme toggle */}
        <div className="flex items-center gap-2">
          {/* More About Me dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex hover:text-accent-color hover:bg-accent-color/10"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                More About Me
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <DropdownMenuItem asChild className="hover:text-accent-color hover:bg-accent-color/10">
                <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:text-accent-color hover:bg-accent-color/10">
                <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:text-accent-color hover:bg-accent-color/10">
                <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <GithubIcon className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Book a Call button */}
          <Button size="sm" className="hidden sm:flex bg-accent-color hover:bg-accent-color/90 text-white border-0" asChild>
            <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
              <Calendar className="h-4 w-4 mr-2" />
              Book a Call
            </a>
          </Button>

          {/* Theme Color Picker */}
          <ThemeColorPicker />

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle theme" className="hover:text-accent-color hover:bg-accent-color/10">
                {themeIcon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')} className="hover:text-accent-color hover:bg-accent-color/10">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:text-accent-color hover:bg-accent-color/10">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="hover:text-accent-color hover:bg-accent-color/10">
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
