// Búsqueda de texto tolerante a valores nulos, mayúsculas y tildes.
const normalizar = (v) =>
  String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const valoresTexto = (obj, depth = 0) => {
  if (obj === null || obj === undefined) return [];
  if (typeof obj !== "object") return [obj];
  if (depth > 2) return [];
  return Object.values(obj).flatMap((v) => valoresTexto(v, depth + 1));
};

export const matchesSearch = (record, term) => {
  const t = normalizar(term).trim();
  if (!t) return true;
  return valoresTexto(record).some((v) => normalizar(v).includes(t));
};

export const filterBySearch = (list, term) => (Array.isArray(list) ? list.filter((r) => matchesSearch(r, term)) : []);
