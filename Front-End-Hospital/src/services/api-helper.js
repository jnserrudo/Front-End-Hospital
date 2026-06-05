/**
 * Helper para manejar respuestas de fetch de forma consistente
 * Lanza un error si la respuesta no es exitosa o si el backend indica error
 */
export const handleResponse = async (response) => {
  // Validar status HTTP
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage;
    } catch (e) {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    
    throw new Error(errorMessage);
  }
  
  // Parsear respuesta
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Respuesta inválida del servidor");
  }
  
  // Validar si el backend indica error en la respuesta (algunos backends devuelven 200 con error)
  if (data && (data.error || data.success === false)) {
    const errorMessage = data.error || data.message || data.msg || "Error desconocido del servidor";
    throw new Error(errorMessage);
  }
  
  return data;
};
