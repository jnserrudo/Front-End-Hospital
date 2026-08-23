import React from "react";

/**
 * Cabecera estándar de página: icono + título + acciones (ej. Administrar).
 * Usar en todas las pantallas con page-wrapper para layout consistente.
 */
export const PageHeader = ({
  icon,
  title,
  subtitle,
  actions = null,
  showBar = true,
}) => (
  <div className="page-header">
    <div className="page-header-top">
      <div className="page-header-main">
        {icon ? <div className="page-header-icon">{icon}</div> : null}
        <div className="page-header-text">
          {typeof title === "string" ? (
            <h2 className="page-title">{title}</h2>
          ) : (
            title
          )}
          {subtitle != null &&
            (typeof subtitle === "string" ? (
              <p className="page-subtitle">{subtitle}</p>
            ) : (
              subtitle
            ))}
        </div>
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
    {showBar ? <div className="page-title-bar" /> : null}
  </div>
);
