'use client';

import { useEffect, useState } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { getStackPhotos } from '@/data/archive-photos';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const {
    preloadProgress,
    setPreloadProgress,
    incrementLoadedImages,
    resetLoadedImages,
    setState,
    setPhotos,
    loadedImagesCount
  } = useArchiveStore();

  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stackPhotos, setStackPhotos] = useState<any[]>([])

  useEffect(() => {
    // Reset on mount
    resetLoadedImages();
    setPreloadProgress(0);
    // Fetch photos from API
    const loadPhotos = async () => {
      try {
        const res = await fetch('/api/archive');
        if (res.ok) {
          const apiPhotos = await res.json();

          if (apiPhotos && apiPhotos.length > 0) {
            setStackPhotos(apiPhotos);
            setIsLoading(false);
          } else {
            // Fallback to placeholder if no photos in database
            const { getStackPhotos } = await import('@/data/archive-photos');
            setStackPhotos(getStackPhotos(50));
            setIsLoading(false);
          }
        } else {
          // API error - use placeholders
          const { getStackPhotos } = await import('@/data/archive-photos');
          setStackPhotos(getStackPhotos(50));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
        // Error - use placeholders
        const { getStackPhotos } = await import('@/data/archive-photos');
        setStackPhotos(getStackPhotos(50));
        setIsLoading(false);
      }
    };
    loadPhotos();
  }, []);

  // Update progress based on loaded images
  useEffect(() => {
    if (isLoading || stackPhotos.length === 0) return;
    const progress = Math.round((loadedImagesCount / stackPhotos.length) * 100);
    setPreloadProgress(progress);

    if (progress === 100 && !isComplete) {
      // Add initial positions for stack
      const photosWithPositions = stackPhotos.map((photo, index) => ({
        ...photo,
        position: {
          x: 0,
          y: 0,
          rotation: (Math.random() - 0.5) * 6, // -3 to +3 degrees
          scale: 1,
          zIndex: index,
        },
        zDepth: 0.5 + Math.random() * 1.3, // 0.5 to 1.8 for deeper parallax
      }));

      setPhotos(photosWithPositions);
      setIsComplete(true);

      // Transition to stack state after a brief pause
      setTimeout(() => {
        setState('stack');
      }, 500);
    }
  }, [loadedImagesCount, stackPhotos.length, isComplete]);

  useEffect(() => {
    if (isLoading || stackPhotos.length === 0) return;
    // Preload images
    const loadImages = async () => {
      const loadPromises = stackPhotos.map((photo) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            incrementLoadedImages();
            resolve();
          };
          img.onerror = () => {
            // Still increment to avoid hanging
            incrementLoadedImages();
            resolve();
          };
          img.src = photo.thumbnail || photo.src;
        });
      });
      await Promise.all(loadPromises);
    };
    loadImages();
  }, [isLoading, stackPhotos]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="text-center">
            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-white/70 text-sm font-medium tracking-widest uppercase mb-2">
                Loading Archive
              </h2>
              <p className="text-white/50 text-xs tracking-wider">
                Preparing your collection
              </p>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(to right, #4285F4, #A142F4, #EA4335, #FBBC05, #34A853)'
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${preloadProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-white/40 text-xs font-mono"
            >
              {preloadProgress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
