export let entorno = import.meta.env.VITE_API_URL || 'http://localhost:1234/api'

// Para producción, crear archivo .env con:
// VITE_API_URL=http://195.200.0.39/api

const MEDIA_BASE = String(
  import.meta.env.VITE_MEDIA_URL || String(entorno).replace(/\/api\/?$/, "")
).replace(/\/$/, "");

export const getMediaUrl = (url) => {
  if (!url) return "";
  // «blob:» es una vista previa temporal de otro navegador: nunca se puede abrir acá.
  if (/^\s*blob:/i.test(url)) return "";
  
  // Si ya es una URL completa (http/https) o base64, retornarla tal cual
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  
  // Limpiar el path por si viene con prefijos repetidos o sin barra inicial
  let cleanPath = url;
  if (cleanPath.startsWith("uploads/")) {
    cleanPath = "/" + cleanPath;
  } else if (!cleanPath.startsWith("/uploads/")) {
    if (cleanPath.startsWith("/")) {
      cleanPath = "/uploads" + cleanPath;
    } else {
      cleanPath = "/uploads/" + cleanPath;
    }
  }
  
  // En desarrollo los archivos los sirve el back local (el mismo de VITE_API_URL, sin "/api"),
  // que es donde también se guardan las subidas. Se puede forzar otro origen con VITE_MEDIA_URL.
  // (Antes apuntaba fijo a http://195.200.0.39, que redirige a https y las imágenes no cargaban.)
  if (import.meta.env.DEV) {
    return `${MEDIA_BASE}${cleanPath}`;
  }

  // En producción, usamos la ruta relativa
  return cleanPath;
};