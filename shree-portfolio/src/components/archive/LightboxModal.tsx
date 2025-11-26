'use client';

import { useEffect, useCallback } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LightboxModal() {
  const {
    photos,
    selectedPhotoId,
    setSelectedPhotoId,
    setState,
    currentState
  } = useArchiveStore();

  const isOpen = currentState === 'lightbox' && selectedPhotoId !== null;
  const currentPhoto = photos.find(p => p.id === selectedPhotoId);
  const currentIndex = photos.findIndex(p => p.id === selectedPhotoId);

  // Navigate between photos
  const navigateTo = useCallback((direction: 'prev' | 'next') => {
    if (!photos.length) return;

    const newIndex = direction === 'next'
      ? (currentIndex + 1) % photos.length
      : (currentIndex - 1 + photos.length) % photos.length;

    setSelectedPhotoId(photos[newIndex].id);
  }, [currentIndex, photos, setSelectedPhotoId]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          navigateTo('prev');
          break;
        case 'ArrowRight':
          navigateTo('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigateTo]);

  const handleClose = () => {
    setSelectedPhotoId(null);
    setState('canvas');
  };

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50"
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="relative w-full max-w-5xl mx-auto pointer-events-auto">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateTo('prev')}
                className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateTo('next')}
                className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Image container */}
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative bg-black/50 rounded-lg overflow-hidden"
              >
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.title || ''}
                  className="w-full h-auto max-h-[80vh] object-contain"
                  onLoad={(e) => console.log(`🔍 [Lightbox] Loaded: ${e.currentTarget.src.includes('thumb') ? '⚠️ Thumbnail' : '✅ Full Size'} (${e.currentTarget.src.split('/').pop()})`)}
                />

                {/* Photo info overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
                >
                  {/* Date Header - Only show if year or month exists */}
                  {(currentPhoto.month || currentPhoto.year) && (
                    <h3 className="text-white text-xl font-medium mb-1">
                      {currentPhoto.month ? `${currentPhoto.month} ` : ''}{currentPhoto.year}
                    </h3>
                  )}

                  {/* Title - Only show if it exists */}
                  {currentPhoto.title && (
                    <p className="text-white/60 text-sm mb-2">
                      {currentPhoto.title}
                    </p>
                  )}

                  {/* Description */}
                  {currentPhoto.description && (
                    <p className="text-white/80 text-base mt-2 leading-relaxed">
                      {currentPhoto.description}
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* Photo counter */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
