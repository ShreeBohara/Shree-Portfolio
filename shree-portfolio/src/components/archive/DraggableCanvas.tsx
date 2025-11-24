'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useArchiveStore } from '@/store/archive-store';
import { ImageCard } from './ImageCard';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { getAllPhotos } from '@/data/archive-photos';
import { calculateBurstPositions } from '@/lib/archive/scatter-algorithm';
import { PHYSICS_CONFIG, optimizeGSAPTicker } from '@/lib/archive/physics-config';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin);
  optimizeGSAPTicker();
}

interface DraggableCanvasProps {
  enabled?: boolean;
}

export function DraggableCanvas({ enabled = true }: DraggableCanvasProps) {
  const {
    photos,
    setPhotos,
    fetchPhotos,
    canvasSize,
    setSelectedPhotoId,
    setState
  } = useArchiveStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const draggableInstance = useRef<globalThis.Draggable | null>(null);

  // Track virtual position (infinite scroll offset)
  const virtualPos = useRef({ x: 0, y: 0 });
  // Track scale for zoom effect
  const scaleRef = useRef(1);

  // Track velocity for tilt effect
  const currentVelocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  // Debug logger
  const log = (message: string, data?: any) => {
    // console.log(`[DraggableCanvas] ${ message } `, data || '');
  };

  // Load photos on mount
  useEffect(() => {
    const initPhotos = async () => {
      // 1. Try to fetch from API
      await fetchPhotos();

      // 2. Check store state after fetch
      // We need to get the latest state, but since we can't access it directly inside this closure without adding it to deps (which causes loops),
      // we will rely on the fact that fetchPhotos updates the store.
      // However, we need to know if we should fallback.

      // Let's check the API response directly in fetchPhotos? No, keep concerns separated.
      // Instead, let's use a separate effect to react to photos changes, OR just check if the fetch resulted in data.

      // Actually, the cleanest way is:
      // - Fetch photos.
      // - If the fetch was successful and we have data, great.
      // - If not, load static.

      // But `fetchPhotos` is void. Let's modify it to return boolean or just check store in a separate effect?
      // A separate effect is safer for React state updates.
    };

    initPhotos();
  }, []);

  // React to photos update or lack thereof
  useEffect(() => {
    if (photos.length > 0 && !photos[0].position) {
      const scatteredPhotos = calculateBurstPositions(
        photos,
        canvasSize.width,
        canvasSize.height
      );
      setPhotos(scatteredPhotos);
    }
  }, [photos.length, canvasSize.width, canvasSize.height]);

  // Setup Draggable and Animation Loop
  useEffect(() => {
    if (!containerRef.current || !dragProxyRef.current || !contentRef.current) return;
    if (!enabled) {
      // If disabled, ensure we clean up
      if (draggableInstance.current) {
        draggableInstance.current.kill();
        draggableInstance.current = null;
      }
      gsap.ticker.remove(updatePositions);
      return;
    }

    // Cache photo elements
    const updatePhotoRefs = () => {
      photoRefs.current.clear();
      const elements = contentRef.current?.querySelectorAll('[data-id]');
      elements?.forEach((el) => {
        const id = el.getAttribute('data-id');
        if (id) photoRefs.current.set(id, el as HTMLElement);
      });
    };

    // Initial cache
    updatePhotoRefs();
    // Also retry after a moment to ensure all elements are mounted
    setTimeout(updatePhotoRefs, 100);

    // Create Draggable on the proxy element
    const draggable = Draggable.create(dragProxyRef.current, {
      type: 'x,y',
      trigger: containerRef.current, // Drag anywhere on container
      edgeResistance: 0,
      cursor: 'grab',
      activeCursor: 'grabbing',
      allowNativeTouchScrolling: false,

      onPress: function () {
        setIsDragging(true);
        // Kill any existing momentum
        currentVelocity.current = { x: 0, y: 0 };

        // Zoom out effect on press
        gsap.to(scaleRef, {
          current: 0.95,
          duration: 0.4,
          ease: 'power2.out'
        });
      },

      onRelease: function () {
        setIsDragging(false);
        // Zoom in effect on release
        gsap.to(scaleRef, {
          current: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      },

      onDrag: function () {
        virtualPos.current.x = this.x;
        virtualPos.current.y = this.y;
      },

      onClick: function (e: MouseEvent) {
        // Check if this was a click (not a drag)
        const dragDistance = Math.abs(this.startX - this.endX) + Math.abs(this.startY - this.endY);
        if (dragDistance < 10) {
          // Use elementFromPoint to get the actual topmost element at click position
          // This is more reliable than e.target especially with overlapping elements
          const clickedElement = document.elementFromPoint(e.clientX, e.clientY);

          if (clickedElement) {
            const imageCard = clickedElement.closest('[data-id]');
            if (imageCard) {
              const photoId = imageCard.getAttribute('data-id');
              if (photoId) {
                log('Photo clicked via elementFromPoint', { photoId });
                setSelectedPhotoId(photoId);
                setState('lightbox');
              }
            } else {
              log('Click missed all photos - zoom out behavior');
            }
          }
        }
      },
    })[0];

    draggableInstance.current = draggable;

    // Momentum tracking
    const momentum = { x: 0, y: 0 };
    let lastTime = Date.now();
    let lastDragPos = { x: 0, y: 0 };

    // Cache viewport dimensions to avoid layout thrashing
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const handleResize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop (Ticker)
    function updatePositions() {
      const width = canvasSize.width;
      const height = canvasSize.height;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const buffer = 800; // Larger render buffer for better initial click detection

      // Apply scale to the content container
      if (contentRef.current) {
        contentRef.current.style.transform = `scale(${scaleRef.current})`;
      }

      // CUSTOM PHYSICS LOOP
      if (draggable.isDragging) {
        // Calculate velocity while dragging
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
          // Simple smoothing
          const vx = (draggable.x - lastDragPos.x) / dt * 16; // normalize to ~60fps
          const vy = (draggable.y - lastDragPos.y) / dt * 16;
          momentum.x += (vx - momentum.x) * 0.5;
          momentum.y += (vy - momentum.y) * 0.5;
        }
        lastDragPos.x = draggable.x;
        lastDragPos.y = draggable.y;
        lastTime = now;
      } else {
        // Apply momentum when not dragging
        if (Math.abs(momentum.x) > 0.1 || Math.abs(momentum.y) > 0.1) {
          // Apply friction
          momentum.x *= 0.95;
          momentum.y *= 0.95;

          // Update virtual position
          virtualPos.current.x += momentum.x;
          virtualPos.current.y += momentum.y;

          // Sync Draggable instance so it doesn't snap back on next drag
          // We need to update the draggable's internal x/y without triggering events
          if (draggableInstance.current) {
            gsap.set(dragProxyRef.current, { x: virtualPos.current.x, y: virtualPos.current.y });
            draggableInstance.current.update();
          }
        }
      }

      // Optimization: Pre-calculate common values
      const vX = virtualPos.current.x;
      const vY = virtualPos.current.y;
      const vpW2 = viewportWidth / 2;
      const vpH2 = viewportHeight / 2;

      photoRefs.current.forEach((element, id) => {
        const photo = photos.find(p => p.id === id);
        if (!photo || !photo.position) return;

        // Calculate parallaxed position
        const zDepth = photo.zDepth || 1;
        const parallaxX = vX * zDepth;
        const parallaxY = vY * zDepth;

        // Base position + Parallax
        let x = photo.position.x + parallaxX;
        let y = photo.position.y + parallaxY;

        // Infinite Wrapping (Modulo)
        x = gsap.utils.wrap(-halfWidth, halfWidth, x);
        y = gsap.utils.wrap(-halfHeight, halfHeight, y);

        // Visibility Culling
        // Check if the wrapped position is within the viewport + buffer
        const screenX = x + vpW2;
        const screenY = y + vpH2;

        // Use a slightly larger buffer for smoother appearance
        const isVisible =
          screenX > -buffer &&
          screenX < viewportWidth + buffer &&
          screenY > -buffer &&
          screenY < viewportHeight + buffer;

        if (isVisible) {
          // Ensure element is visible and interactive
          if (element.style.visibility === 'hidden') {
            element.style.visibility = 'visible';
            element.style.pointerEvents = 'auto';
          }
          // Apply transform with static rotation only
          // Using translate3d for GPU acceleration
          element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${photo.position.scale || 1}) rotate(${photo.position.rotation || 0}deg)`;
        } else {
          // Hide but keep in DOM for better click detection
          // Use visibility instead of display:none to preserve layout
          if (element.style.visibility !== 'hidden') {
            element.style.visibility = 'hidden';
            element.style.pointerEvents = 'none';
          }
        }
      });
    };

    // Add listener
    gsap.ticker.add(updatePositions);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (draggableInstance.current) {
        draggableInstance.current.kill();
        draggableInstance.current = null;
      }
      gsap.ticker.remove(updatePositions);
    };
  }, [photos, canvasSize, setSelectedPhotoId, setState, enabled]);

  useEffect(() => {
    // console.log('[DraggableCanvas] Mounted');
    // return () => console.log('[DraggableCanvas] Unmounting');
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Proxy element for Draggable to control */}
      <div ref={dragProxyRef} className="absolute w-px h-px opacity-0 pointer-events-none" />

      {/* Content container that gets scaled */}
      <div
        ref={contentRef}
        className="absolute top-1/2 left-1/2 w-0 h-0"
        style={{
          perspective: '1000px',
        }}
      >
        {/* Center origin container */}
        <div className="relative w-0 h-0">
          {photos.map((photo) => {
            // Log crop data
            if (photo.crop) {
              console.log(`🎨 [DraggableCanvas] Photo ${photo.id} has crop:`, photo.crop);
            }

            // Calculate dynamic dimensions based on aspect ratio
            // Target area or max dimension to keep visual weight consistent
            const MAX_DIMENSION = 300;
            let displayWidth = 300;
            let displayHeight = 225;

            if (photo.width && photo.height) {
              const aspectRatio = photo.width / photo.height;

              if (aspectRatio > 1) {
                // Landscape
                displayWidth = MAX_DIMENSION;
                displayHeight = MAX_DIMENSION / aspectRatio;
              } else {
                // Portrait or Square
                displayHeight = MAX_DIMENSION;
                displayWidth = MAX_DIMENSION * aspectRatio;
              }
            }

            // Apply wrapping to initial position to match ticker logic and prevent jump
            // This ensures React render matches the first GSAP frame
            const halfWidth = canvasSize.width / 2;
            const halfHeight = canvasSize.height / 2;
            const wrappedX = gsap.utils.wrap(-halfWidth, halfWidth, photo.position?.x || 0);
            const wrappedY = gsap.utils.wrap(-halfHeight, halfHeight, photo.position?.y || 0);

            return (
              <ImageCard
                key={photo.id}
                id={photo.id}
                src={photo.src}
                alt={photo.title}
                width={displayWidth}
                height={displayHeight}
                // Pass wrapped position
                position={{ ...photo.position!, x: wrappedX, y: wrappedY }}
                zDepth={photo.zDepth}
                filters={photo.filters || {
                  brightness: 100,
                  contrast: 110,
                  saturation: 95,
                  vignette: 40,
                }}
                crop={photo.crop}
                className={`transition-shadow hover:shadow-2xl`}
                style={{
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-wider pointer-events-none select-none text-center">
        Click & drag to explore • Click image for details
      </div>
    </div>
  );
}
