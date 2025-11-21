'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';
import { ArchiveCanvas } from '@/components/archive/ArchiveCanvas';

export default function ArchivePage() {
  // Hide sidebar for full immersive experience
  const { setSidebarOpen } = useUIStore();

  useEffect(() => {
    // Close sidebar on archive page
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return <ArchiveCanvas />;
}
