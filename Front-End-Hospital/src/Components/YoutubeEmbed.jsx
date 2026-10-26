import React from "react";

/**
 * Extrae el ID de un video de YouTube desde un iframe pegado o una URL
 * (youtube.com/watch?v=, youtu.be/, /embed/, /shorts/). Devuelve null si no es YouTube.
 */
export const extraerIdYoutube = (valor) => {
  if (!valor || typeof valor !== "string") return null;
  const m = valor.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?(?:[^"'\s]*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
};

export const esIframe = (valor) => typeof valor === "string" && valor.trim().toLowerCase().startsWith("<iframe");

/**
 * Muestra un video de YouTube SIN insertar HTML ajeno: armamos nosotros el iframe
 * a partir del ID, así un código pegado no puede ejecutar scripts (XSS).
 */
export const YoutubeEmbed = ({ valor, title = "Video de YouTube", style }) => {
  const id = extraerIdYoutube(valor);
  if (!id) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: "var(--gray-600)", ...style }}>
        No pudimos mostrar este video: solo se aceptan videos de YouTube.
      </div>
    );
  }
  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}`}
      title={title}
      style={{ width: "100%", height: "100%", border: "none", ...style }}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
};

export default YoutubeEmbed;
