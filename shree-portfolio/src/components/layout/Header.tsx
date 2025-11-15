'use client';

import { Menu, Download, Calendar, Mail, Github as GithubIcon, Linkedin, Moon, Sun } from 'lucide-react';
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
import { getCurrentAccentColor } from '@/hooks/useThemeColor';

export function Header() {
  const { toggleSidebar, isSidebarOpen, theme, toggleTheme, triggerNewChat } = useUIStore();
  const pathname = usePathname();
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');

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
    root.classList.add(theme);
  }, [theme]);

  // Update accent color when it changes
  useEffect(() => {
    const updateAccentColor = () => {
      const color = getCurrentAccentColor();
      if (color) setAccentColor(color);
    };

    updateAccentColor();

    // Watch for changes to the CSS variable
    const observer = new MutationObserver(updateAccentColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  const themeIcon = theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;

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
        <div className="flex items-center gap-3">
          {/* Links dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium text-foreground/70 hover:text-accent-color hover:bg-accent-color/5 transition-all cursor-pointer bg-transparent border-0 outline-none"
              >
                <span>Links</span>
                <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                asChild 
                className="group transition-colors"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = accentColor;
                  const bgColor = accentColor.replace(')', ' / 0.1)');
                  target.style.backgroundColor = bgColor;
                  // Update icon color
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = '';
                  target.style.backgroundColor = '';
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = '';
                }}
              >
                <a href={personalInfo.links.resume.pdf} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem 
                asChild 
                className="group transition-colors"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = accentColor;
                  const bgColor = accentColor.replace(')', ' / 0.1)');
                  target.style.backgroundColor = bgColor;
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = '';
                  target.style.backgroundColor = '';
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = '';
                }}
              >
                <a href={personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem 
                asChild 
                className="group transition-colors"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.color = accentColor;
                  const bgColor = accentColor.replace(')', ' / 0.1)');
                  target.style.backgroundColor = bgColor;
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = '';
                  target.style.backgroundColor = '';
                  const icon = target.querySelector('svg');
                  if (icon) icon.style.color = '';
                }}
              >
                <a href={personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <GithubIcon className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Book a Call - Primary CTA */}
          <a
            href={personalInfo.links.calendar}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-color hover:bg-accent-color/90 transition-all text-sm font-medium text-white shadow-sm hover:shadow-md"
          >
            <Calendar className="h-4 w-4" />
            <span>Book a Call</span>
          </a>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Tools section */}
          <div className="flex items-center gap-1">
            {/* Theme Color Picker */}
            <ThemeColorPicker />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-10 w-10 rounded-md flex items-center justify-center transition-colors hover:text-accent-color hover:bg-accent-color/10"
            >
              {themeIcon}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
