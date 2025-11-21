'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ImageCardProps {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  position?: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    zIndex: number;
  };
  onClick?: () => void;
  animationDelay?: number;
  initialPosition?: { x: number; y: number };
  zDepth?: number;
}

export function ImageCard({
  id,
  src,
  alt = '',
  width,
  height,
  className = '',
  position,
  onClick,
  animationDelay = 0,
  initialPosition,
  zDepth = 1,
}: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!cardRef.current || !isFirstRender.current) return;
    isFirstRender.current = false;

    const card = cardRef.current;

    // Set initial state if provided
    if (initialPosition) {
      gsap.set(card, {
        x: initialPosition.x,
        y: initialPosition.y,
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.8,
      });

      // Animate to stack position
      gsap.to(card, {
        x: position?.x || 0,
        y: position?.y || 0,
        xPercent: -50,
        yPercent: -50,
        rotation: position?.rotation || 0,
        scale: position?.scale || 1,
        opacity: 1,
        duration: 0.8,
        delay: animationDelay,
        ease: 'power3.out',
      });
    }
  }, [position, initialPosition, animationDelay]);

  // Update position when it changes (for burst animation only)
  useEffect(() => {
    if (!cardRef.current) return;

    // Skip if this is the initial render with initial position
    if (isFirstRender.current && initialPosition) return;

    // Only update position if it actually changed
    const currentX = gsap.getProperty(cardRef.current, 'x') as number;
    const currentY = gsap.getProperty(cardRef.current, 'y') as number;
    const newX = position?.x || 0;
    const newY = position?.y || 0;

    // Check if position actually changed (with small threshold for floating point)
    if (Math.abs(currentX - newX) > 0.1 || Math.abs(currentY - newY) > 0.1) {
      gsap.set(cardRef.current, {
        x: newX,
        y: newY,
        xPercent: -50,
        yPercent: -50,
        rotation: position?.rotation || 0,
        scale: position?.scale || 1,
      });
    }
  }, [position, id, initialPosition]);

  return (
    <div
      ref={cardRef}
      data-id={id}
      data-zdepth={zDepth}
      className={`absolute cursor-pointer transition-shadow hover:shadow-2xl ${className}`}
      style={{
        zIndex: position?.zIndex || 1,
        transform: `translate3d(${position?.x || 0}px, ${position?.y || 0}px, 0) translate(-50%, -50%) scale(${position?.scale || 1})`,
        transformOrigin: 'center center',
        willChange: 'transform',
        backfaceVisibility: 'hidden', // Prevent flickering
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-sm shadow-lg">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block w-full h-full object-cover"
          draggable={false}
          loading="lazy" // Native lazy loading
          decoding="async" // Non-blocking image decode
        />
        {/* Subtle border for depth */}
        <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none" />
      </div>
    </div>
  );
}
