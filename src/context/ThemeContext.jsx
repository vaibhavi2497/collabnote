import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);