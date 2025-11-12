'use client';

import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  useThemeColor();
  return <>{children}</>;
}
