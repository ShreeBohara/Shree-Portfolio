'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getCurrentAccentColor } from '@/hooks/useThemeColor';

interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export function CursorTrail() {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');

  // Check if device is desktop (has cursor)
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.matchMedia('(pointer: fine)').matches);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Update accent color when it changes
  useEffect(() => {
    const updateAccentColor = () => {
      const color = getCurrentAccentColor();
      if (color) setAccentColor(color);
    };

    updateAccentColor();

    // Watch for changes to the CSS variable
    const observer = new MutationObserver(updateAccentColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPoint: Point = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
    };

    setPoints((prev) => {
      // Keep last 20 points for smooth line
      const updated = [...prev, newPoint];
      return updated.slice(-20);
    });
  }, []);

  // Clean up old points every 100ms
  useEffect(() => {
    if (!isDesktop) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setPoints((prev) => prev.filter((point) => now - point.timestamp < 400));
    }, 100);

    return () => clearInterval(interval);
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    // Throttle mousemove to every 16ms (~60fps)
    let rafId: number;
    let lastEvent: MouseEvent | null = null;

    const onMouseMove = (e: MouseEvent) => {
      lastEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (lastEvent) {
            handleMouseMove(lastEvent);
          }
          rafId = 0;
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleMouseMove, isDesktop]);

  // Don't render on mobile/touch devices
  if (!isDesktop || points.length < 2) return null;

  // Create SVG path from points
  const pathData = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full">
        {/* Outer glow (largest blur) */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={accentColor}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          style={{
            filter: 'blur(12px)',
          }}
        />

        {/* Middle glow */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={accentColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          style={{
            filter: 'blur(6px)',
          }}
        />

        {/* Core line (brightest) */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={accentColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          style={{
            filter: 'blur(0.8px)',
          }}
        />
      </svg>
    </div>
  );
}

