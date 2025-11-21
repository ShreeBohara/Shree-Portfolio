// GSAP physics and animation configuration for optimal performance

export const PHYSICS_CONFIG = {
  // Draggable settings
  draggable: {
    inertia: {
      velocity: 'auto',
      resistance: 15, // Lower = more smooth gliding
      endSpeed: 0.1, // Lower = continues moving longer
      minDuration: 0.5,
      maxDuration: 5,
      overshootTolerance: 0, // Prevent overshooting bounds
    },
    throwResistance: 800, // Lower = easier to throw
    edgeResistance: 0, // No edge resistance for infinite canvas
    dragClickables: true,
    allowNativeTouchScrolling: false,
    zIndexBoost: false, // Don't change z-index during drag
  },

  // Animation settings
  animation: {
    stackDelay: 0.08, // Delay between stacking cards
    burstDuration: 1.2, // Duration of burst animation
    burstEase: 'power3.out',
  },

  // Parallax settings
  parallax: {
    minDepth: 0.8,
    maxDepth: 1.2,
    strength: 0.5, // Multiplier for parallax effect
  },

  // Performance settings
  performance: {
    maxVisibleImages: 100, // Maximum images to render at once
    viewportPadding: 200, // Extra pixels around viewport for pre-rendering
    throttleDelay: 16, // ~60fps throttling for drag updates
  },

  // Canvas settings
  canvas: {
    sizeMultiplier: 3, // 300vw/300vh
    minDistance: 220, // Minimum distance between images
  },
};

// Helper to apply GPU acceleration styles
export const GPU_ACCELERATION_STYLES = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  perspective: 1000,
  willChange: 'transform',
} as const;

// Optimize GSAP ticker for better performance
export const optimizeGSAPTicker = () => {
  if (typeof window !== 'undefined' && window.gsap) {
    // Use RAF for smoother animations - deprecated in v3, enabled by default
    // window.gsap.ticker.useRAF(true);
    // Set to 60fps
    window.gsap.ticker.fps(60);
    // Reduce lag smoothing for more responsive feel
    window.gsap.ticker.lagSmoothing(500, 33);
  }
};
