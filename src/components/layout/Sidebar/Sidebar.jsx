import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

export default function Sidebar({
  user,
  handleLogout,
  isOpen,
  setIsOpen,
  isMobile,
}) {
  const { darkMode } = useTheme();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: isMobile
            ? isOpen
              ? "180px"
              : "0"
            : isOpen
            ? "220px"
            : "70px",

          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",

          background: "#0f172a",
          color: "#fff",

          zIndex: 2000,
          overflow: "hidden",

          transform: isMobile
            ? isOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",

          transition: "all 0.3s ease",
          boxShadow: isOpen
            ? "0 0 15px rgba(0,0,0,0.3)"
            : "none",
        }}
      >
        {/* Hamburger */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "15px",
            cursor: "pointer",
            fontSize: "22px",
            color: "#fff",
          }}
        >
          ☰
        </div>

        {/* Header */}
        {isOpen && (
          <div className="px-3">
            <Link
              to="/home"
              className="text-decoration-none fw-bold d-block mb-2"
              style={{
                color: "#f8fafc",
                fontSize: "1.2rem",
              }}
            >
              📝 CollabNotes
            </Link>

            <p
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "10px",
              }}
            >
              Welcome, {user?.displayName} ❤
            </p>

            <hr
              style={{
                borderColor: "#334155",
              }}
            />
          </div>
        )}

        {/* Menu */}
        <ul className="list-unstyled px-3 mt-3">
          <li className="mb-3">
            <Link
              to="/dashboard"
              className="text-decoration-none text-white"
              onClick={() => isMobile && setIsOpen(false)}
            >
              🏠 {isOpen && "Dashboard"}
            </Link>
          </li>

          <li className="mb-3">
            <Link
              to="/profile"
              className="text-decoration-none text-white"
              onClick={() => isMobile && setIsOpen(false)}
            >
              👤 {isOpen && "Profile"}
            </Link>
          </li>

          <li className="mb-3">
            <Link
              to="/delete-account"
              className="text-decoration-none text-white"
              onClick={() => isMobile && setIsOpen(false)}
            >
              🗑️ {isOpen && "Delete Account"}
            </Link>
          </li>
        </ul>

        {/* Logout */}
        <div className="px-3 mt-4">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            {isOpen ? "Logout" : "⎋"}
          </button>
        </div>
      </div>
    </>
  );
}