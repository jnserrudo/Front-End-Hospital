import React from "react";
import { HOSPITAL_ICONS } from "../constants/hospitalIcons";

/**
 * Icono PNG del set hospitalario.
 * @param {string} name - clave de HOSPITAL_ICONS (ej. "recetas")
 * @param {number} size - ancho/alto en px
 */
export const HospitalIcon = ({
  name,
  size = 28,
  alt = "",
  className = "",
  style = {},
}) => {
  const src = HOSPITAL_ICONS[name];
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || name}
      width={size}
      height={size}
      className={`hospital-icon ${className}`.trim()}
      style={{
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
        ...style,
      }}
      draggable={false}
    />
  );
};
