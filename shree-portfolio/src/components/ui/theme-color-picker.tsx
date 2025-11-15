'use client';

import { useUIStore } from '@/store/ui-store';
import { Paintbrush } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const colorOptions = [
  { id: 'teal', name: 'Teal', color: 'oklch(0.72 0.12 185)', darkColor: 'oklch(0.75 0.13 185)' },
  { id: 'blue', name: 'Blue', color: 'oklch(0.65 0.16 240)', darkColor: 'oklch(0.70 0.18 240)' },
  { id: 'pink', name: 'Pink', color: 'oklch(0.70 0.17 340)', darkColor: 'oklch(0.75 0.19 340)' },
  { id: 'orange', name: 'Orange', color: 'oklch(0.70 0.15 45)', darkColor: 'oklch(0.75 0.17 45)' },
  { id: 'yellow', name: 'Yellow', color: 'oklch(0.75 0.15 95)', darkColor: 'oklch(0.80 0.17 95)' },
  { id: 'green', name: 'Green', color: 'oklch(0.68 0.16 150)', darkColor: 'oklch(0.73 0.18 150)' },
  { id: 'red', name: 'Red', color: 'oklch(0.65 0.20 25)', darkColor: 'oklch(0.70 0.22 25)' },
  { id: 'violet', name: 'Violet', color: 'oklch(0.65 0.20 285)', darkColor: 'oklch(0.70 0.22 285)' },
] as const;

export function ThemeColorPicker() {
  const { accentColor, setAccentColor } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (colorId: typeof accentColor) => {
    setAccentColor(colorId);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add small delay to prevent immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 hover:text-accent-color hover:bg-accent-color/10"
        aria-label="Choose theme color"
      >
        <Paintbrush className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100]"
            />

            {/* Color picker panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-[110] p-3 rounded-xl bg-card border border-border shadow-xl backdrop-blur-lg"
            >
              <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
                Accent Color
              </div>
              <div className="flex flex-col gap-2 min-w-[180px]">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleColorChange(option.id)}
                    className={`
                      flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all
                      ${accentColor === option.id
                        ? 'bg-accent-color/10 border-2 border-accent-color/50'
                        : 'bg-muted/30 hover:bg-muted border-2 border-transparent'
                      }
                    `}
                    style={{
                      ...(accentColor === option.id ? {
                        backgroundColor: `${option.color}15`,
                        borderColor: `${option.color}80`,
                      } : {})
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: option.color,
                        boxShadow: accentColor === option.id
                          ? `0 0 0 2px ${option.color}40, 0 0 12px ${option.color}60`
                          : `0 2px 4px ${option.color}40`
                      }}
                    />
                    <span className="text-xs font-medium flex-1 text-left">
                      {option.name}
                    </span>
                    {accentColor === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
