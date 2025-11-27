'use client';

import { ReactNode } from 'react';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';
import { MobileArchiveRestriction } from '@/components/archive/MobileArchiveRestriction';

interface ArchiveLayoutProps {
  children: ReactNode;
}

export default function ArchiveLayout({ children }: ArchiveLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <MobileArchiveRestriction />
      <ArchiveHeader />
      {children}
    </div>
  );
}
