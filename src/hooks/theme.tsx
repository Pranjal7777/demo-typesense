'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  theme: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const storedTheme = sessionStorage.getItem('theme');
      if (storedTheme !== null) {
        return storedTheme === 'true';
      } else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return false; // Default theme if window is not defined
  };

  const [theme, setTheme] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    if (theme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    sessionStorage.setItem('theme', theme.toString());

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => setTheme((prevTheme) => !prevTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
