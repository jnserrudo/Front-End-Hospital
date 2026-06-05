import { entorno } from "./config";

export const getAllInfografias = async () => {
  const response = await fetch(entorno + "/infografias", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const infografias = await response.json();
  return infografias;
};

export const getInfografiasByCategoria = async (categoria) => {
  const response = await fetch(entorno + `/infografias/categoria/${categoria}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const infografias = await response.json();
  return infografias;
};

export const getInfografiaById = async (id) => {
  const response = await fetch(entorno + `/infografias/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const infografia = await response.json();
  return infografia;
};

export const insertInfografia = async (infografia) => {
  const response = await fetch(entorno + "/infografias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(infografia),
  });
  const data = await response.json();
  return data;
};

export const updateInfografia = async (id, infografia) => {
  const response = await fetch(entorno + `/infografias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(infografia),
  });
  const data = await response.json();
  return data;
};

export const disableInfografia = async (id) => {
  const response = await fetch(entorno + `/infografias/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
