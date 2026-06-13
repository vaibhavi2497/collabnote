import React, { useState } from "react";

export default function NoteFilter({
  search,
  setSearch,
  darkMode,
}) {

  const [focused, setFocused] = useState(false);

  return (

    <div
      className="position-relative mx-4"
      style={{
        width: focused ? "360px" : "280px",
        transition: "all 0.3s ease",
      }}
    >

      {/* Search Icon */}
      <span
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1rem",
          color: darkMode ? "#ccc" : "#666",
          zIndex: 10,
          transition: "0.3s",
        }}
      >
        🔍
      </span>

      {/* Input */}
      <input
  type="text"
  className={`form-control dark-input ps-5 py-2 rounded-pill shadow-sm ${
    darkMode
      ? "bg-dark text-light border-secondary"
      : ""
  }`}
  placeholder="Search notes..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
  style={{
    
    transition: "all 0.3s ease",
    border: focused
      ? "2px solid #0d6efd"
      : "2px solid transparent",
    transform: focused
      ? "scale(1.03)"
      : "scale(1)",
    color: darkMode ? "#fff" : "#000",
    backgroundColor: darkMode ? "#1e293b" : "#fff",
  }}
/>

    </div>

  );
}