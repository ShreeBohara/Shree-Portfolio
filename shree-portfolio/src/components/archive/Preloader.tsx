'use client';

import { useEffect, useState } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { getStackPhotos } from '@/data/archive-photos';
import { motion, AnimatePresence } from 'framer-motion';

type ArchivePhoto = ReturnType<typeof useArchiveStore.getState>['photos'][number];
const LOAD_TIMEOUT = 10_000;

export function Preloader() {
  const {
    preloadProgress,
    setPreloadProgress,
    incrementLoadedImages,
    resetLoadedImages,
    setState,
    setPhotos,
  } = useArchiveStore();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const fetchTimer = setTimeout(() => controller.abort(), LOAD_TIMEOUT);
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const pendingImages = new Set<() => void>();
    resetLoadedImages();
    setPreloadProgress(0);

    const loadPhotos = async () => {
      let photos: ArchivePhoto[] = getStackPhotos(50);
      try {
        const res = await fetch('/api/archive', { signal: controller.signal });
        if (res.ok) {
          const apiPhotos: unknown = await res.json();
          if (Array.isArray(apiPhotos) && apiPhotos.length > 0) {
            photos = apiPhotos;
          }
        }
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error('Failed to fetch photos:', error);
        }
      } finally {
        clearTimeout(fetchTimer);
      }
      if (!active) return;

      let completed = 0;
      await Promise.all(photos.map(photo => new Promise<void>(resolve => {
        const image = new Image();
        let settled = false;
        const clearImage = () => {
          clearTimeout(imageTimer);
          image.onload = null;
          image.onerror = null;
          pendingImages.delete(cancel);
        };
        const finish = () => {
          if (settled) return;
          settled = true;
          clearImage();
          if (active) {
            completed += 1;
            incrementLoadedImages();
            setPreloadProgress(Math.round(completed / photos.length * 100));
          }
          resolve();
        };
        const cancel = () => {
          if (settled) return;
          settled = true;
          clearImage();
          image.removeAttribute('src');
          resolve();
        };
        // Errors and stalled downloads both settle, so the gallery can open.
        const imageTimer = setTimeout(finish, LOAD_TIMEOUT);
        pendingImages.add(cancel);
        image.onload = finish;
        image.onerror = finish;
        image.src = photo.thumbnail || photo.src;
      })));
      if (!active) return;

      setPhotos(photos.map((photo, index) => ({
        ...photo,
        position: {
          x: 0,
          y: 0,
          rotation: (Math.random() - 0.5) * 6,
          scale: 1,
          zIndex: index,
        },
        zDepth: 0.5 + Math.random() * 1.3,
      })));
      setIsComplete(true);
      transitionTimer = setTimeout(() => {
        if (active) setState('stack');
      }, 500);
    };
    void loadPhotos();

    return () => {
      active = false;
      controller.abort();
      clearTimeout(fetchTimer);
      clearTimeout(transitionTimer);
      pendingImages.forEach(cancel => cancel());
    };
  }, [resetLoadedImages, setPreloadProgress, incrementLoadedImages, setPhotos, setState]);

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
