import React from "react";
import { Link } from "react-router-dom";
import Button from "../../common/Button/Button";
import NoteFilter from "../../notes/NoteFilters/NoteFilter";
import { useTheme } from "../../../context/ThemeContext";

export default function Navbar({
  search,
  setSearch,
  handleLogout,
  user,
  isOpen,
  setIsOpen
}) {
  const { darkMode, toggleTheme } = useTheme();

  const profilePhoto = localStorage.getItem(
    `profilePhoto_${user?.uid}`
  );

  return (
    <nav
      className="navbar d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: darkMode ? "#0f172a" : "#fff",
      }}
    >
      {/* HAMBERGURE MENU */}
      <button
  className="btn btn-outline-secondary d-md-none"
  onClick={() => setIsOpen(true)}
>
  ☰
</button>


      {/* BRAND */}
      <Link
        to="/home"
        className={`text-decoration-none fw-bold fs-4 ${darkMode ? "text-light" : "text-dark"
          }`}
      >
        📝 CollabNotes
      </Link>

      {/* SEARCH */}
      <NoteFilter
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
      />

      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end"

      >

        {/* PROFILE */}
        <Link
          to="/profile"
          className="text-decoration-none"
        >
          <div
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-4 shadow-sm ${darkMode ? "bg-secondary text-light" : "bg-light text-dark"
              }`}
          >
            <img
              src={
                profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              width="40"
              height="40"
              className="rounded-circle border object-fit-cover"
            />

            <div>
              <div className="fw-bold">
                {user?.displayName || user?.email?.split("@")[0]}
              </div>
              <small className={darkMode ? "text-light" : "text-muted"}>
                {user?.email}
              </small>
            </div>
          </div>
        </Link>

        {/* DARK MODE */}
        <Button
          variant={darkMode ? "warning" : "dark"}
          size="sm"
          onClick={toggleTheme}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </Button>

      </div>
    </nav>
  );
}