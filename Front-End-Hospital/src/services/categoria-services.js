import { entorno } from "./config";

export const getAllCategorias = async () => {
  console.log('antes del fetch get all categorias')
  const res = await fetch(`${entorno}/categorias`);
  const data = await res.json();
  return data;
};

export const getCategoriaById = async (id) => {
  console.log("se trae al categoria con id: ", id);
  const res = await fetch(`${entorno}/categorias/${id}`);
  const data = await res.json();
  return data;
};




export const updateCategoria = async (categoria) => {
  const res = await fetch(`${entorno}/categorias/${categoria.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoria),
  });
  const data = await res.json();
  return data;
};

export const insertCategoria = async (
  categoria
) => {
  const res = await fetch(`${entorno}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoria),
  });
  const data = await res.json();
  return data;
};


export const inhabilitarCategoria = async (
  id
) => {
  const res = await fetch(`${entorno}/categoria/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};


