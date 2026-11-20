
import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#F5F5F5',
    white: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    border: '#E0E0E0',
    inactive: '#8E8E93',
    input: '#FFFFFF',
    card: '#FFFFFF',
    danger: '#DC2626',
    secondary: '#8E8E93',
  },

  dark: {
    background: '#121212',
    white: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#0A84FF',
    border: '#2C2C2E',
    inactive: '#AAAAAA',
    input: '#2A2A2A',
    card: '#1E1E1E',
    danger: '#FF453A',
    secondary: '#AAAAAA'
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const currentTheme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        colors: currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
