'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { getCurrentAccentColor } from '@/hooks/useThemeColor';

export function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isExpandHover, setIsExpandHover] = useState(false);
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');

  // Smooth cursor position with spring physics - extreme speed and responsiveness
  const cursorX = useSpring(0, { damping: 5, stiffness: 2000 });
  const cursorY = useSpring(0, { damping: 5, stiffness: 2000 });
  
  // Ring follows with minimal lag - extreme speed and flexibility
  const ringX = useSpring(0, { damping: 7, stiffness: 1800 });
  const ringY = useSpring(0, { damping: 7, stiffness: 1800 });

  // Check if device is desktop
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

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for special expand hover (like hero heading)
      const hasExpandAttr = target.hasAttribute('data-cursor-expand') || !!target.closest('[data-cursor-expand]');
      
      // Check if hovering over interactive elements
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]');
      
      setIsExpandHover(hasExpandAttr);
      setIsHovering(!!isInteractive && !hasExpandAttr);
    };

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('button, a, [role="button"], input, textarea').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, ringX, ringY, isDesktop]);

  // Don't render on mobile
  if (!isDesktop) return null;

  const getRingSize = () => {
    if (isExpandHover) return 45; // Medium-large for name
    if (isHovering) return 40;    // Large for buttons
    return 28;                     // Normal size
  };

  const getDotSize = () => {
    if (isExpandHover) return 8;
    if (isHovering) return 8;
    return 6;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Ring */}
      <motion.div
        className="absolute rounded-full border-2 transition-all duration-300"
        style={{
          left: ringX,
          top: ringY,
          width: getRingSize(),
          height: getRingSize(),
          x: '-50%',
          y: '-50%',
          opacity: isExpandHover ? 1 : isHovering ? 0.8 : 0.5,
          borderColor: accentColor,
          boxShadow: isExpandHover
            ? `0 0 30px ${accentColor.replace(')', ' / 0.5)')}, 0 0 60px ${accentColor.replace(')', ' / 0.3)')}`
            : isHovering
              ? `0 0 20px ${accentColor.replace(')', ' / 0.4)')}, 0 0 40px ${accentColor.replace(')', ' / 0.2)')}`
              : `0 0 10px ${accentColor.replace(')', ' / 0.2)')}`,
        }}
      />

      {/* Inner Dot */}
      <motion.div
        className="absolute rounded-full transition-all duration-300"
        style={{
          left: cursorX,
          top: cursorY,
          width: getDotSize(),
          height: getDotSize(),
          x: '-50%',
          y: '-50%',
          opacity: 0.9,
          backgroundColor: accentColor,
          boxShadow: isExpandHover
            ? `0 0 12px ${accentColor.replace(')', ' / 0.8)')}`
            : `0 0 8px ${accentColor.replace(')', ' / 0.6)')}`,
        }}
      />
    </div>
  );
}

