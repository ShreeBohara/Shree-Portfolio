'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';

/**
 * MobileDetector component
 * Monitors window size and updates the UI store with mobile state
 * Should be mounted once in the app layout
 */
export function MobileDetector() {
  const setWindowDimensions = useUIStore((state) => state.setWindowDimensions);

  useEffect(() => {
    // Function to check if device is mobile based on width
    const checkMobile = (width: number): boolean => {
      return width < 1024; // lg breakpoint in Tailwind
    };

    // Update dimensions on mount
    const updateDimensions = () => {
      const width = window.innerWidth;
      const isMobile = checkMobile(width);
      setWindowDimensions(width, isMobile);
    };

    // Initial update
    updateDimensions();

    // Add resize listener with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', handleResize);

    // Also listen to orientation changes on mobile
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(updateDimensions, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [setWindowDimensions]);

  // This component doesn't render anything
  return null;
}
