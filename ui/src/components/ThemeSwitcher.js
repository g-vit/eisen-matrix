import React, { useEffect } from 'react';

const ThemeSwitcher = ({ theme, setTheme }) => {
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
