import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const getDefaultTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : getDefaultTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button id="btnSwitch" onClick={toggleTheme} className="btn">
      {theme === 'dark' ? '🌞' : '🌛'}
    </button>
  );
};

export default ThemeSwitcher;
