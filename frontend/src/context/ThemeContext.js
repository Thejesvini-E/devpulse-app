import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, App as AntdApp, theme as antTheme } from 'antd';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('app_theme') !== 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const customTheme = {
    algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#6366f1',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      borderRadius: 10,
      colorBgBase: isDarkMode ? '#0a0e17' : '#f8fafc',
      colorBgContainer: isDarkMode ? '#111827' : '#ffffff',
      colorBgElevated: isDarkMode ? '#1e293b' : '#ffffff',
      colorText: isDarkMode ? '#f8fafc' : '#0f172a',
      colorTextSecondary: isDarkMode ? '#cbd5e1' : '#475569',
      colorBorder: isDarkMode ? 'rgba(255, 255, 255, 0.14)' : '#cbd5e1',
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={customTheme}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);