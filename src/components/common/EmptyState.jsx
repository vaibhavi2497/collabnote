import React from "react";

export default function EmptyState({
  title = "No Notes Found",
  subtitle = "Create your first note to get started.",
  buttonText,
  onButtonClick,
  icon = "📝",
  darkMode = false,
}) {

  return (

    <div
      className={`text-center p-5 rounded-4 shadow-sm ${
        darkMode ? "bg-dark text-light" : "bg-light"
      }`}
    >

      <div
        style={{
          fontSize: "4rem",
        }}
      >
        {icon}
      </div>

      <h3 className="mt-3 fw-bold">
        {title}
      </h3>

      <p
        className={`mb-4 ${
          darkMode ? "text-light" : "text-muted"
        }`}
      >
        {subtitle}
      </p>

      {buttonText && (

        <button
          className="btn btn-primary px-4"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>

      )}

    </div>

  );
}