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

  // Load all photos if not already loaded
  useEffect(() => {
    const initPhotos = async () => {
      if (photos.length === 0) {
        // Try to fetch from API first
        await fetchPhotos();

        // If still empty (or just to ensure we have data to scatter), get current photos from store
        // Note: fetchPhotos updates the store, so we need to read from store again or just let the store update trigger a re-render?
        // Actually, better to just get all photos (which might now be from API) and scatter them.
        // However, `getAllPhotos` is static. We need to rely on the store's photos if they exist.

        // Wait for next tick to allow store update? 
        // Or better: The store update will trigger a re-render. 
        // But we need to apply scattering.

        // Let's change logic: 
        // 1. Fetch photos.
        // 2. Then apply scatter.

        // But `fetchPhotos` is async.
        // If we just call it, the store updates, component re-renders.
        // Then we need to detect "we have photos but they aren't scattered yet".
        // But `photos` in store are just data. Scattering adds `position`.

        // Simplified approach for now:
        // Just use static photos if API fails or is empty, but if API works, we need to scatter THEM.

        // For this iteration, let's stick to the existing flow but inject API call.
        // If API returns photos, we should use them.

        // Actually, `fetchPhotos` sets `photos` in store.
        // We need to intercept that or react to it.

        // Let's just call fetchPhotos and let the user manually refresh for now? 
        // No, that's bad UX.

        // Correct flow:
        // 1. Component mounts.
        // 2. Call fetchPhotos().
        // 3. Store updates with raw photo data.
        // 4. We need a way to say "Scatter these new photos".

        // Let's modify this effect to depend on `photos.length`.
        // If photos are loaded but have no position, scatter them.
      }
    };

    initPhotos();
  }, []);

  // Effect to scatter photos when they are loaded but not positioned
  useEffect(() => {
    if (photos.length > 0 && !photos[0].position) {
      const scatteredPhotos = calculateBurstPositions(
        photos,
        canvasSize.width,
        canvasSize.height
      );
      setPhotos(scatteredPhotos);
    } else if (photos.length === 0) {
      // Fallback to static if nothing loaded? 
      // Or maybe `fetchPhotos` already handled it.
      // If we want to use static as fallback:
      const staticPhotos = getAllPhotos();
      if (staticPhotos.length > 0 && photos.length === 0) {
        // Only if we really have nothing.
        // But we don't want to override API fetch if it's just taking time.
      }
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
        // Calculate delta since last frame for manual velocity tracking
        const dx = this.x - this.startX; // This isn't quite right for delta, let's use deltaX/Y if available or calc manually
        // Actually Draggable updates this.x/y. We need to track delta manually in the ticker or here.
        // Better approach: Update virtualPos here, and let ticker handle velocity calc for tilt.
        // For inertia, we need the velocity AT RELEASE.

        virtualPos.current.x = this.x;
        virtualPos.current.y = this.y;
      },

      onClick: function (e: MouseEvent) {
        // Check if this was a click (not a drag)
        const dragDistance = Math.abs(this.startX - this.endX) + Math.abs(this.startY - this.endY);
        if (dragDistance < 10) {
          const target = e.target as HTMLElement;
          const imageCard = target.closest('[data-id]');
          if (imageCard) {
            const photoId = imageCard.getAttribute('data-id');
            if (photoId) {
              setSelectedPhotoId(photoId);
              setState('lightbox');
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

    // Animation Loop (Ticker)
    function updatePositions() {
      const width = canvasSize.width;
      const height = canvasSize.height;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const buffer = 400; // Render buffer

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

      photoRefs.current.forEach((element, id) => {
        const photo = photos.find(p => p.id === id);
        if (!photo || !photo.position) return;

        // Calculate parallaxed position
        // We add the virtual position (drag offset) multiplied by zDepth
        // zDepth > 1 moves faster (closer), < 1 moves slower (farther)
        const zDepth = photo.zDepth || 1;
        const parallaxX = virtualPos.current.x * zDepth;
        const parallaxY = virtualPos.current.y * zDepth;

        // Base position + Parallax
        let x = photo.position.x + parallaxX;
        let y = photo.position.y + parallaxY;

        // Infinite Wrapping (Modulo)
        // We wrap the position around the canvas dimensions
        // The wrap range is centered around 0 (-halfWidth to halfWidth)
        x = gsap.utils.wrap(-halfWidth, halfWidth, x);
        y = gsap.utils.wrap(-halfHeight, halfHeight, y);

        // Visibility Culling
        // Check if the wrapped position is within the viewport + buffer
        // Note: x,y are relative to center, so we adjust for viewport center
        const screenX = x + viewportWidth / 2;
        const screenY = y + viewportHeight / 2;

        const isVisible =
          screenX > -buffer &&
          screenX < viewportWidth + buffer &&
          screenY > -buffer &&
          screenY < viewportHeight + buffer;

        if (isVisible) {
          element.style.display = 'block';
          // Apply transform with static rotation only
          element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${photo.position.scale || 1}) rotate(${photo.position.rotation || 0}deg)`;
        } else {
          element.style.display = 'none';
        }
      });
    };

    // Add listener
    gsap.ticker.add(updatePositions);

    return () => {
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
          marginTop: '-130px', // Corrected center offset
          marginLeft: '0px'
        }}
      >
        {/* Center origin container */}
        <div className="relative w-0 h-0">
          {photos.map((photo) => {
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
                width={300}
                height={225}
                // Pass wrapped position
                position={{ ...photo.position!, x: wrappedX, y: wrappedY }}
                zDepth={photo.zDepth}
                className="w-[300px] h-[225px] transition-shadow hover:shadow-2xl"
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
