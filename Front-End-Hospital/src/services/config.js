export let entorno = import.meta.env.VITE_API_URL || 'http://localhost:1234/api'

// Para producción, crear archivo .env con:
// VITE_API_URL=http://195.200.0.39/api

export const getMediaUrl = (url) => {
  if (!url) return "";
  
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
  
  // En desarrollo (Vite corriendo localmente)
  if (import.meta.env.DEV) {
    // Apuntamos a la IP de producción para no necesitar descargar los archivos localmente
    return `http://195.200.0.39${cleanPath}`;
  }
  
  // En producción, usamos la ruta relativa
  return cleanPath;
};