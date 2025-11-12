'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';

const colorDefinitions = {
  teal: {
    light: 'oklch(0.72 0.12 185)',
    dark: 'oklch(0.75 0.13 185)',
  },
  purple: {
    light: 'oklch(0.68 0.18 295)',
    dark: 'oklch(0.73 0.20 295)',
  },
  blue: {
    light: 'oklch(0.65 0.16 240)',
    dark: 'oklch(0.70 0.18 240)',
  },
  pink: {
    light: 'oklch(0.70 0.17 340)',
    dark: 'oklch(0.75 0.19 340)',
  },
  orange: {
    light: 'oklch(0.70 0.15 45)',
    dark: 'oklch(0.75 0.17 45)',
  },
  yellow: {
    light: 'oklch(0.75 0.15 95)',
    dark: 'oklch(0.80 0.17 95)',
  },
  green: {
    light: 'oklch(0.68 0.16 150)',
    dark: 'oklch(0.73 0.18 150)',
  },
  red: {
    light: 'oklch(0.65 0.20 25)',
    dark: 'oklch(0.70 0.22 25)',
  },
  cyan: {
    light: 'oklch(0.70 0.14 195)',
    dark: 'oklch(0.75 0.16 195)',
  },
  violet: {
    light: 'oklch(0.65 0.20 285)',
    dark: 'oklch(0.70 0.22 285)',
  },
} as const;

export function useThemeColor() {
  const accentColor = useUIStore((state) => state.accentColor);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');

    const selectedColor = colorDefinitions[accentColor];
    const colorValue = isDark ? selectedColor.dark : selectedColor.light;

    // Update the main accent color variable
    root.style.setProperty('--accent-color', colorValue);

    // Also update accent-teal for backwards compatibility (can be removed later)
    root.style.setProperty('--accent-teal', colorValue);
  }, [accentColor]);

  useEffect(() => {
    // Watch for theme changes (light/dark mode)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const root = document.documentElement;
          const isDark = root.classList.contains('dark');
          const selectedColor = colorDefinitions[accentColor];
          const colorValue = isDark ? selectedColor.dark : selectedColor.light;
          root.style.setProperty('--accent-color', colorValue);
          root.style.setProperty('--accent-teal', colorValue);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [accentColor]);

  return accentColor;
}

// Helper function to get current accent color value
export function getAccentColorValue(colorName: keyof typeof colorDefinitions, isDark: boolean = false) {
  const color = colorDefinitions[colorName];
  return isDark ? color.dark : color.light;
}

// Helper to get current accent color from CSS variable
export function getCurrentAccentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
}
