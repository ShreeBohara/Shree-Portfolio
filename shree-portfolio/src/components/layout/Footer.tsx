'use client';

import { Github, Linkedin, Mail, Calendar, Heart, Code2 } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">{personalInfo.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {personalInfo.tagline}. USC CS Graduate Student seeking full-time opportunities starting May 2026.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.links.github}
                target="_blank"
                rel="noopener noreferrer me"
                className="p-2 rounded-lg hover:bg-accent-color/10 hover:text-accent-color transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={personalInfo.links.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                className="p-2 rounded-lg hover:bg-accent-color/10 hover:text-accent-color transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${personalInfo.links.email}`}
                className="p-2 rounded-lg hover:bg-accent-color/10 hover:text-accent-color transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={personalInfo.links.calendar}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent-color/10 hover:text-accent-color transition-colors"
                aria-label="Schedule a Call"
              >
                <Calendar className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-accent-color transition-colors">
                  Chat with AI
                </Link>
              </li>
              <li>
                <Link href="/browse?section=projects" className="text-sm text-muted-foreground hover:text-accent-color transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/browse?section=experience" className="text-sm text-muted-foreground hover:text-accent-color transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-accent-color transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#A142F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
                >
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={personalInfo.links.calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-color transition-colors"
                >
                  Schedule a Call
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${personalInfo.links.email}`}
                  className="text-sm text-muted-foreground hover:text-accent-color transition-colors"
                >
                  {personalInfo.links.email}
                </a>
              </li>
              <li>
                <a
                  href={personalInfo.links.resume.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-color transition-colors"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © {currentYear} {personalInfo.name}. Built with
            <Heart className="h-3.5 w-3.5 text-red-500 mx-1" />
            using Next.js
          </p>
          <p className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span>React • TypeScript • Tailwind • Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}


