'use client';

import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get('section');
  const section = requestedSection === 'experience' || requestedSection === 'education'
    ? requestedSection
    : 'projects';
  
  return (
    <PortfolioLayout showCatalog={true} initialSection={section}>
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
