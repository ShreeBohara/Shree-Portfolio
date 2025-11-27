'use client';

import { Menu, Download, Calendar, Mail, Github as GithubIcon, Linkedin, Images } from 'lucide-react';
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
  const { toggleSidebar, isSidebarOpen, triggerNewChat } = useUIStore();
  const pathname = usePathname();
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');

  const handleChatClick = (e: React.MouseEvent) => {
    // If already on chat page, start new conversation
    if (pathname === '/') {
      e.preventDefault();
      triggerNewChat();
    }
  };



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



  return (
    <header className={cn(
      "fixed top-0 right-0 z-40 bg-background/80 backdrop-blur-sm header-height left-0 transition-all duration-300",
      isSidebarOpen ? "lg:left-[280px]" : "lg:left-[60px]"
    )}>
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
        {/* Left side - Navigation tabs */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:text-accent-color hover:bg-accent-color/10 h-10 w-10"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Navigation tabs */}
          <div className="flex items-center gap-0.5 sm:gap-1 border rounded-lg p-0.5 sm:p-1">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                "h-9 min-h-[44px] sm:h-8 sm:min-h-0 px-3 text-sm",
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
                "h-9 min-h-[44px] sm:h-8 sm:min-h-0 px-3 text-sm",
                pathname !== '/browse' && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
              <Link href="/browse">Browse</Link>
            </Button>
            <Button
              variant={pathname === '/about' ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                "h-9 min-h-[44px] sm:h-8 sm:min-h-0 px-3 text-sm",
                pathname !== '/about' && "hover:text-accent-color hover:bg-accent-color/10"
              )}
            >
              <Link href="/about">About</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Actions and Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Links dropdown - Now visible on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium text-foreground/70 hover:text-accent-color hover:bg-accent-color/5 transition-all cursor-pointer bg-transparent border-0 outline-none"
                aria-label="External links menu"
              >
                <span className="hidden xs:inline">Links</span>
                <svg className="h-4 w-4 xs:h-3 xs:w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {/* Book a Call - visible in dropdown on mobile */}
              <DropdownMenuItem
                asChild
                className="group transition-colors sm:hidden"
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
                <a href={personalInfo.links.calendar} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Call
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
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Archive link with rainbow gradient icon */}
            <Link
              href="/archive"
              className={cn(
                "h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-md flex items-center justify-center transition-all group",
                pathname === '/archive'
                  ? "bg-accent-color/10"
                  : "hover:bg-white/5"
              )}
              aria-label="Photo Archive"
              title="Archive"
            >
              {/* Rainbow gradient SVG icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 transition-transform group-hover:scale-110"
              >
                <defs>
                  <linearGradient id="gemini-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="25%" stopColor="#A142F4" />
                    <stop offset="50%" stopColor="#EA4335" />
                    <stop offset="75%" stopColor="#FBBC05" />
                    <stop offset="100%" stopColor="#34A853" />
                  </linearGradient>
                </defs>
                {/* Images icon paths */}
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="url(#gemini-rainbow)" />
                <circle cx="9" cy="9" r="2" stroke="url(#gemini-rainbow)" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="url(#gemini-rainbow)" />
              </svg>
            </Link>

            {/* Theme Color Picker */}
            <ThemeColorPicker />


          </div>
        </div>
      </div>
    </header>
  );
}
