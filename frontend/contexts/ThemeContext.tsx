'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeContextType {
  // This context is mainly for potential future extensions
  // The actual theme logic is handled by next-themes
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // Note: To actually use theme, import from 'next-themes' directly
  // This wrapper is for potential future extensions
  return context;
}
