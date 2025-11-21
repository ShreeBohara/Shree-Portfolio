'use client';

import { ReactNode } from 'react';
import { ArchiveHeader } from '@/components/archive/ArchiveHeader';

interface ArchiveLayoutProps {
  children: ReactNode;
}

export default function ArchiveLayout({ children }: ArchiveLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <ArchiveHeader />
      {children}
    </div>
  );
}
