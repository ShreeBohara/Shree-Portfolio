'use client';

import { useEffect, useRef } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { Preloader } from './Preloader';
import { DraggableCanvas } from './DraggableCanvas';
import { LightboxModal } from './LightboxModal';
import { calculateBurstPositions } from '@/lib/archive/scatter-algorithm';
import { gsap } from 'gsap';
import { useScrambleText } from '@/hooks/useScrambleText';

export function ArchiveCanvas() {
  const { currentState, photos, setPhotos, setState, canvasSize, setCanvasSize, setIsBursting, setSelectedPhotoId } = useArchiveStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const { displayText } = useScrambleText({
    text: 'ARCHIVE',
    duration: 2000,
    tick: 50,
    playOnMount: true,
    delay: 500
  });

  // Reset state on mount to ensure full animation sequence
  useEffect(() => {
    setSelectedPhotoId(null);
    setIsBursting(false);
    setState('preloader');
    return () => setIsBursting(false);
  }, [setState, setSelectedPhotoId, setIsBursting]);

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



    let burstTimer: ReturnType<typeof setTimeout> | undefined;
    const tweens: gsap.core.Tween[] = [];
    // Wait for DOM to be ready. Both timers belong to this effect.
    const readyTimer = setTimeout(() => {
      const elements = new Map(Array.from(
        canvasRef.current?.querySelectorAll<HTMLElement>('[data-id]') ?? [],
        element => [element.dataset.id, element]
      ));
      photos.forEach((photo, index) => {
        const element = elements.get(photo.id);
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
            rotation: 0,
            filter: 'grayscale(100%)' // Start B/W
          });

          // Animate to center (stack)
          tweens.push(gsap.to(element, {
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
          }));
        }
      });

      // Trigger burst after stack completes
      const stackDelay = 0.08;
      const totalStackTime = photos.length * stackDelay + 0.8;

      burstTimer = setTimeout(() => {
        setState('burst');
      }, (totalStackTime + 1) * 1000);
    }, 100);
    return () => {
      clearTimeout(readyTimer);
      clearTimeout(burstTimer);
      tweens.forEach(tween => tween.kill());
    };
  }, [currentState, photos, setState]);

  // Handle burst animation
  useEffect(() => {
    if (currentState !== 'burst' || photos.length === 0) return;


    setIsBursting(true);

    // Calculate scatter positions
    const scatteredPhotos = calculateBurstPositions(
      photos,
      canvasSize.width,
      canvasSize.height
    );


    // DON'T update photos in store yet - let animation complete first

    let active = true;
    let timeline: gsap.core.Timeline | null = null;
    // Wait a moment for DOM to be ready, then create and run animations
    const readyTimer = setTimeout(() => {

      // Create burst timeline
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (!active) return;
          // Update photos with final positions after animation
          setPhotos(scatteredPhotos);
          setState('canvas');
          setIsBursting(false);
        },
      });
      timeline = tl;
      const elements = new Map(Array.from(
        canvasRef.current?.querySelectorAll<HTMLElement>('[data-id]') ?? [],
        element => [element.dataset.id, element]
      ));

      // Animate each photo to its burst position
      scatteredPhotos.forEach((photo) => {
        const element = elements.get(photo.id);
        if (element) {

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

          // Animate to Color (Wave Effect)
          // Calculate delay based on horizontal position for left-to-right wave
          // Map x from [-width/2, width/2] to [0, 1]
          const normalizedX = (photo.position.x + canvasSize.width / 2) / canvasSize.width;
          const waveDelay = normalizedX * 1.0; // 1 second wave duration across screen

          tl.to(
            element,
            {
              filter: 'grayscale(0%)',
              duration: 1.5,
              ease: 'power2.out',
            },
            (photo.burstDelay || 0) + waveDelay
          );
        } else {
          console.error(`❌ Could not find element for photo ${photo.id}`);
        }
      });

      // Animate Text to Color
      const textElement = canvasRef.current?.querySelector('#archive-title-text');
      if (textElement) {
        tl.to(
          textElement,
          {
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5)) grayscale(0%)',
            duration: 2,
            ease: 'power2.out',
          },
          0.5 // Start slightly after burst begins
        );
      }

      // Play the timeline
      tl.play();
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      active = false;
      clearTimeout(readyTimer);
      timeline?.kill();
      setIsBursting(false);
    };
  }, [currentState, photos, canvasSize, setPhotos, setState, setIsBursting]);

  return (
    <div ref={canvasRef} className="fixed inset-0 bg-black overflow-hidden">
      {/* Archive Text Overlay - Always visible */}
      <div
        id="archive-text-overlay"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div className="relative flex flex-col items-center">
          {/* Cyberpunk Chrome Text */}
          <h1
            id="archive-title-text"
            className="text-4xl md:text-6xl font-bold tracking-widest select-none text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#A142F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              textShadow: '0 0 30px rgba(66, 133, 244, 0.3)', // Subtle blue glow
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5)) grayscale(100%)' // Start B/W
            }}
          >
            {displayText}
          </h1>

          <p
            className="text-gray-400 text-xs md:text-sm tracking-[0.8em] mt-4 font-medium uppercase text-center"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            US Collection
          </p>
        </div>
      </div>

      {/* Render components based on current state */}
      {currentState === 'preloader' && <Preloader />}

      {/* Persistent DraggableCanvas handles rendering of photos */}
      {/* It is enabled only in 'canvas' or 'lightbox' state, but always visible */}
      {(currentState === 'stack' || currentState === 'burst' || currentState === 'canvas' || currentState === 'lightbox') && (
        <DraggableCanvas
          enabled={currentState === 'canvas'}
          startInvisible={currentState === 'stack'}
        />
      )}

      {/* Lightbox overlay */}
      <LightboxModal />
    </div>
  );
}
