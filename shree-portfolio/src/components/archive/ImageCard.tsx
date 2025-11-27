import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface ImageCardProps {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
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
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    vignette?: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const ImageCard = memo(function ImageCard({
  id,
  src,
  alt = '',
  width,
  height,
  className = '',
  style,
  position,
  onClick,
  animationDelay = 0,
  initialPosition,
  zDepth = 1,
  filters = {
    brightness: 100,
    contrast: 110,
    saturation: 95,
    vignette: 40,
  },
  crop,
}: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Log crop prop
  useEffect(() => {
    // console.log(`🖼️ [ImageCard ${id}] Crop prop:`, crop);
    if (crop) {
      const top = crop.y;
      const right = 100 - crop.x - crop.width;
      const bottom = 100 - crop.y - crop.height;
      const left = crop.x;
      // const clipPathValue = `inset(${top}% ${right}% ${bottom}% ${left}%)`;

      // Warning if values look wrong
      if (right < 0 || bottom < 0 || left < 0 || top < 0) {
        console.warn(`⚠️ [ImageCard ${id}] NEGATIVE INSET VALUES! This will cause grey borders.`, { top, right, bottom, left });
      }
    }
  }, [crop, id]);

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
        ...style,
        zIndex: position?.zIndex || 1,
        transform: `translate3d(${position?.x || 0}px, ${position?.y || 0}px, 0) translate(-50%, -50%) scale(${position?.scale || 1})`,
        transformOrigin: 'center center',
        willChange: 'transform',
        backfaceVisibility: 'hidden', // Prevent flickering
        pointerEvents: 'auto', // Ensure clickable by default
      }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-sm shadow-lg w-full h-full">
        <Image
          src={src}
          alt={alt || ''}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover"
          draggable={false}
          style={{
            filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`,
            clipPath: crop
              ? `inset(${crop.y}% ${100 - crop.x - crop.width}% ${100 - crop.y - crop.height}% ${crop.x}%)`
              : undefined,
          }}
          onLoad={() => { }}
        />

        {/* Vignette Overlay */}
        {filters.vignette && filters.vignette > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, transparent 0%, transparent 50%, rgba(0,0,0,${filters.vignette / 100}) 100%)`,
              zIndex: 10 // Ensure vignette is above image
            }}
          />
        )}

        {/* Subtle border for depth */}
        <div className="absolute inset-0 border border-white/10 rounded-sm pointer-events-none z-20" />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if critical props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.src === nextProps.src &&
    prevProps.position?.x === nextProps.position?.x &&
    prevProps.position?.y === nextProps.position?.y &&
    prevProps.position?.scale === nextProps.position?.scale &&
    prevProps.position?.rotation === nextProps.position?.rotation &&
    prevProps.crop === nextProps.crop &&
    prevProps.className === nextProps.className
  );
});
