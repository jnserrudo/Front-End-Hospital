// Categorías de preguntas frecuentes: valor guardado → texto visible (siempre con mayúscula inicial).
export const FAQ_CATEGORIAS = [
  { value: "general", label: "General" },
  { value: "nutricion", label: "Nutrición" },
  { value: "ejercicio", label: "Ejercicio" },
  { value: "patologias", label: "Patologías" },
];

export const faqCategoriaLabel = (valor) => {
  if (!valor) return "";
  const v = String(valor).toLowerCase();
  const encontrada = FAQ_CATEGORIAS.find((c) => c.value === v);
  return encontrada ? encontrada.label : v.charAt(0).toUpperCase() + v.slice(1);
};
