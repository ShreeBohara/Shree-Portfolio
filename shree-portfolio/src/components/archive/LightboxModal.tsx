'use client';

import { useEffect, useCallback, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setSelectedPhotoId(null);
    setState('canvas');
  }, [setSelectedPhotoId, setState]);

  useEffect(() => {
    if (!isOpen) return;
    // The canvas disables its photo controls when this opens, so the browser
    // may already have blurred the trigger before this effect runs.
    const photoId = useArchiveStore.getState().selectedPhotoId;
    const openingPhoto = Array.from(document.querySelectorAll<HTMLElement>('[data-id]'))
      .find(element => element.dataset.id === photoId);
    returnFocusRef.current = openingPhoto ?? (
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    );
    closeButtonRef.current?.focus();
  }, [isOpen]);

  const restoreFocus = useCallback(() => {
    // Wait until the exiting dialog is gone and canvas controls are enabled.
    if (useArchiveStore.getState().currentState === 'lightbox') return;
    if (returnFocusRef.current?.isConnected) {
      returnFocusRef.current.focus({ preventScroll: true });
    }
    returnFocusRef.current = null;
  }, []);

  // Navigate between photos
  const navigateTo = useCallback((direction: 'prev' | 'next') => {
    if (!photos.length || currentIndex < 0) return;

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
          e.preventDefault();
          handleClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateTo('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateTo('next');
          break;
        case 'Tab': {
          const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
          if (!buttons?.length) return;
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (!dialogRef.current?.contains(document.activeElement) || (!e.shiftKey && document.activeElement === last)) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigateTo, handleClose]);

  return (
    <AnimatePresence onExitComplete={restoreFocus}>
      {isOpen && currentPhoto && (
        <>
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50"
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={currentPhoto.title || 'Archive photo viewer'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="relative w-full max-w-5xl mx-auto pointer-events-auto">
              {/* Close button */}
              <Button
                ref={closeButtonRef}
                aria-label="Close photo viewer"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Navigation buttons */}
              <Button
                aria-label="Previous photo"
                variant="ghost"
                size="icon"
                onClick={() => navigateTo('prev')}
                className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                aria-label="Next photo"
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
                  alt={currentPhoto.title || 'Archive photograph'}
                  className="w-full h-auto max-h-[80vh] object-contain"
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
