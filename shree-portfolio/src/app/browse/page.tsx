'use client';

import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') as 'projects' | 'experience' | 'education' | null;
  
  return (
    <PortfolioLayout showCatalog={true} initialSection={section || 'projects'}>
      <div />
    </PortfolioLayout>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<PortfolioLayout showCatalog={true} initialSection="projects"><div /></PortfolioLayout>}>
      <BrowseContent />
    </Suspense>
  );
}
