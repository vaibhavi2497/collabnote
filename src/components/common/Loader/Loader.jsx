import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import "./Loader.css";

export default function Loader({
  text = "Loading..."
}) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`loader-container ${
        darkMode ? "dark" : "light"
      }`}
    >
      <div className="dots-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p className="loader-text">
        {text}
      </p>
    </div>
  );
}