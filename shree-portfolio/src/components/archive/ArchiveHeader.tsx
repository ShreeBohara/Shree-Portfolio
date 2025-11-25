'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArchiveStore } from '@/store/archive-store';

export function ArchiveHeader() {
  const currentState = useArchiveStore((state) => state.currentState);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="flex justify-between items-center">
        {/* Left side - Archive title */}
        <div className="text-white">
          <h1 className="text-sm font-medium tracking-widest opacity-70">ARCHIVE</h1>
        </div>

        {/* Right side - Close button (Hide in lightbox) */}
        <div className={`transition-opacity duration-300 ${currentState === 'lightbox' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white hover:bg-white/10 h-10 w-10 pointer-events-auto"
          >
            <Link href="/" aria-label="Close archive">
              <X className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
