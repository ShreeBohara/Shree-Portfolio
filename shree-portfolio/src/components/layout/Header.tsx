'use client';

import { Menu, Download, Calendar, Mail, Github, Linkedin, Moon, Sun, Monitor } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { personalInfo } from '@/data/portfolio';

export function Header() {
  const { toggleSidebar, theme, setTheme } = useUIStore();
  const pathname = usePathname();

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
    <header className="fixed top-0 left-0 right-0 z-40 glass header-height">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side - Menu toggle and logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold">
            {personalInfo.name.split(' ')[0]} <span className="text-muted-foreground">Portfolio</span>
          </h1>
          
          {/* Navigation tabs */}
          <div className="hidden sm:flex items-center gap-1 ml-8 border rounded-lg p-1">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className="h-8"
            >
              <Link href="/">Chat</Link>
            </Button>
            <Button
              variant={pathname === '/browse' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className="h-8"
            >
              <Link href="/browse">Browse</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Quick actions */}
        <div className="flex items-center gap-2">
          {/* Desktop quick links */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4" />
                Book Call
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <a href={`mailto:${personalInfo.links.email}`}>
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </Button>
            
            <div className="h-6 w-px bg-border mx-2" />
            
            <Button variant="ghost" size="icon" asChild>
              <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2" asChild>
                <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" asChild>
                <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-4 w-4" />
                  Book a Call
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" asChild>
                <a href={`mailto:${personalInfo.links.email}`}>
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" asChild>
                <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" asChild>
                <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle theme">
                {themeIcon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
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
