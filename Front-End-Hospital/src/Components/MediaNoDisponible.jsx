import React, { useEffect, useState } from "react";
import { FileExclamationOutlined } from "@ant-design/icons";

/** Cartel amable para cuando una imagen, video o archivo no se puede mostrar. */
export const MediaNoDisponible = ({
  texto = "Este archivo no está disponible",
  detalle = "Puede que se haya borrado o que no se haya terminado de subir.",
  alto = "100%",
  compacto = false,
  style,
}) => (
  <div className={`media-no-disponible${compacto ? " media-no-disponible--compacto" : ""}`} style={{ height: alto, ...style }} role="img" aria-label={texto}>
    <FileExclamationOutlined className="media-no-disponible__icono" />
    <span className="media-no-disponible__texto">{texto}</span>
    {!compacto && detalle && <span className="media-no-disponible__detalle">{detalle}</span>}
  </div>
);

/** Imagen que, si no carga (o no tiene dirección), muestra el cartel en lugar de un ícono roto. */
export const ImagenSegura = ({ src, alt = "", style, className, alto, compacto, sinImagen, ...rest }) => {
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [src]);
  if (!src) return sinImagen ?? <MediaNoDisponible alto={alto} compacto={compacto} />;
  if (error) return <MediaNoDisponible alto={alto} compacto={compacto} />;
  return <img src={src} alt={alt} style={style} className={className} onError={() => setError(true)} {...rest} />;
};

export default MediaNoDisponible;
