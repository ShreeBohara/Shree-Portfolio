'use client';

import { useEffect, useRef } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { Preloader } from './Preloader';
import { DraggableCanvas } from './DraggableCanvas';
import { LightboxModal } from './LightboxModal';
import { ImageCard } from './ImageCard';
import { calculateBurstPositions } from '@/lib/archive/scatter-algorithm';
import { gsap } from 'gsap';

export function ArchiveCanvas() {
  const { currentState, photos, setPhotos, setState, canvasSize, setCanvasSize, setIsBursting } = useArchiveStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const burstTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Debug logger
  const log = (message: string, data?: any) => {
    console.log(`[ArchiveCanvas] ${message}`, data || '');
  };

  // Log state transitions
  useEffect(() => {
    log('State changed to:', currentState);
  }, [currentState]);

  // Update canvas size based on viewport
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth * 2.2, // 220vw
        height: window.innerHeight * 2.2, // 220vh
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [setCanvasSize]);

  // Calculate initial positions for each photo based on cardinal directions (from StackedPile)
  const getInitialStackPosition = (index: number) => {
    const directions = ['top', 'right', 'bottom', 'left'];
    const direction = directions[index % 4];
    const offset = 200; // Distance from center

    switch (direction) {
      case 'top':
        return { x: (Math.random() - 0.5) * 100, y: -offset };
      case 'right':
        return { x: offset, y: (Math.random() - 0.5) * 100 };
      case 'bottom':
        return { x: (Math.random() - 0.5) * 100, y: offset };
      case 'left':
        return { x: -offset, y: (Math.random() - 0.5) * 100 };
      default:
        return { x: 0, y: 0 };
    }
  };

  // Handle stack animation
  useEffect(() => {
    if (currentState !== 'stack' || photos.length === 0) return;

    log('Starting stack animation');

    // Wait for DOM to be ready
    setTimeout(() => {
      photos.forEach((photo, index) => {
        const element = document.querySelector(`[data-id="${photo.id}"]`) as HTMLElement;
        if (element) {
          const initialPos = getInitialStackPosition(index);

          // Set initial position (offset)
          gsap.set(element, {
            x: initialPos.x,
            y: initialPos.y,
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: 0.8,
            rotation: 0
          });

          // Animate to center (stack)
          gsap.to(element, {
            x: photo.position?.x || 0,
            y: photo.position?.y || 0,
            xPercent: -50,
            yPercent: -50,
            rotation: photo.position?.rotation || 0,
            scale: photo.position?.scale || 1,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'power3.out',
          });
        }
      });

      // Trigger burst after stack completes
      const stackDelay = 0.08;
      const totalStackTime = photos.length * stackDelay + 0.8;

      const burstTimer = setTimeout(() => {
        setState('burst');
      }, (totalStackTime + 2) * 1000);

      return () => clearTimeout(burstTimer);
    }, 100);
  }, [currentState, photos, setState]);

  // Handle burst animation
  useEffect(() => {
    if (currentState !== 'burst' || photos.length === 0) return;

    log('Starting burst animation', { photoCount: photos.length, canvasSize });
    setIsBursting(true);

    // Calculate scatter positions
    const scatteredPhotos = calculateBurstPositions(
      photos,
      canvasSize.width,
      canvasSize.height
    );

    log('Scatter positions calculated', {
      samplePositions: scatteredPhotos.slice(0, 3).map(p => ({
        id: p.id,
        position: p.position,
        burstDelay: p.burstDelay
      }))
    });

    // DON'T update photos in store yet - let animation complete first

    // Wait a moment for DOM to be ready, then create and run animations
    setTimeout(() => {

      // Create burst timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Update photos with final positions after animation
          setPhotos(scatteredPhotos);
          setState('canvas');
          setIsBursting(false);
        },
      });

      // Animate each photo to its burst position
      scatteredPhotos.forEach((photo, index) => {
        const element = document.querySelector(`[data-id="${photo.id}"]`) as HTMLElement;
        if (element) {
          if (index === 0) {
            const currentPos = {
              x: gsap.getProperty(element, 'x') as number,
              y: gsap.getProperty(element, 'y') as number,
            };
            log('First photo position before burst', { id: photo.id, currentPos });
          }

          // Force initial position to be at stack center (should already be there from stack animation)
          // But just in case, we don't reset it because it might cause a jump if stack animation isn't perfectly finished
          // Actually, we should trust the current position from stack animation

          // Then animate to burst position
          tl.to(
            element,
            {
              x: photo.position.x,
              y: photo.position.y,
              xPercent: -50,
              yPercent: -50,
              rotation: photo.position.rotation || 0, // Animate to final random rotation
              duration: 1.5,
              ease: 'power3.out',
              onComplete: undefined,
            },
            photo.burstDelay || 0
          );
        } else {
          console.error(`❌ Could not find element for photo ${photo.id}`);
        }
      });

      // Fade out the text - REMOVED as per user request
      // const textElement = document.querySelector('#archive-text-overlay');
      // if (textElement) {
      //   tl.to(textElement, {
      //     opacity: 0,
      //     duration: 0.5,
      //     ease: 'power2.in',
      //   }, 0);
      // }

      burstTimelineRef.current = tl;

      // Play the timeline
      tl.play();
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      if (burstTimelineRef.current) {
        burstTimelineRef.current.kill();
      }
    };
  }, [currentState, photos.length, canvasSize, setPhotos, setState, setIsBursting]);

  return (
    <div ref={canvasRef} className="fixed inset-0 bg-black overflow-hidden">
      {/* Archive Text Overlay - Always visible */}
      <div
        id="archive-text-overlay"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div className="text-center">
          <h1 className="text-white/90 text-5xl md:text-6xl font-light tracking-[0.2em]">
            ARCHIVE
          </h1>
          <p className="text-white/60 text-sm md:text-base tracking-[0.3em] mt-2">
            2012 — 2024
          </p>
        </div>
      </div>

      {/* Render components based on current state */}
      {currentState === 'preloader' && <Preloader />}

      {/* Persistent DraggableCanvas handles rendering of photos */}
      {/* It is enabled only in 'canvas' or 'lightbox' state, but always visible */}
      {(currentState === 'stack' || currentState === 'burst' || currentState === 'canvas' || currentState === 'lightbox') && (
        <DraggableCanvas enabled={currentState === 'canvas' || currentState === 'lightbox'} />
      )}

      {/* Lightbox overlay */}
      <LightboxModal />
    </div>
  );
}
