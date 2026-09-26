"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'sm' | 'base' | 'lg';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [fontSize, setFontSizeState] = useState<FontSize>('base');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedSize = localStorage.getItem('fontSize') as FontSize;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark'); // default dark
    }
    
    if (savedSize) {
      setFontSizeState(savedSize);
      document.documentElement.classList.add(`font-${savedSize}`);
    } else {
      document.documentElement.classList.add('font-base');
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setFontSize = (newSize: FontSize) => {
    document.documentElement.classList.remove(`font-${fontSize}`);
    document.documentElement.classList.add(`font-${newSize}`);
    setFontSizeState(newSize);
    localStorage.setItem('fontSize', newSize);
  };

  // Always provide the context, even during SSR
  const providerValue = { theme, setTheme, fontSize, setFontSize };
  
  if (!mounted) {
    return (
      <SettingsContext.Provider value={providerValue}>
        <div className="transition-all duration-300 h-full flex flex-col flex-1">
          {children}
        </div>
      </SettingsContext.Provider>
    );
  }

  return (
    <SettingsContext.Provider value={providerValue}>
      <div className="transition-all duration-300 h-full flex flex-col flex-1">
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
