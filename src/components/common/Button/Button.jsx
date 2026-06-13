// src/components/common/Button/Button.jsx

import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  iconOnly = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {

  // VARIANTS
  const variants = {
    primary: "btn-primary",
    danger: "btn-danger",
    success: "btn-success",
    warning: "btn-warning",
    secondary: "btn-secondary",
    info: "btn-info",
    light: "btn-light",
    dark: "btn-dark",
  };

  // SIZES
  const sizes = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        btn
        ${variants[variant]}
        ${sizes[size]}
        ${iconOnly ? "rounded-circle p-2 d-flex align-items-center justify-content-center" : ""}
        ${className}
      `}
      style={{
        width: iconOnly ? "40px" : "auto",
        height: iconOnly ? "40px" : "auto",
      }}
    >
      {children}
    </button>
  );
}