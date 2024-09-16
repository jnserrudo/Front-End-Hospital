import { entorno } from "./config";

export const getAllEjercicios = async () => {
  console.log('antes del fetch get all ejercicios')
  const res = await fetch(`${entorno}/ejercicios`);
  const data = await res.json();
  return data;
};


export const getAllEjerciciosFiltro = async (
  ejercicio
) => {

  console.log("ejercicios filtro ",ejercicio)
  const res = await fetch(`${entorno}/ejercicios/filtro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ejercicio),
  });
  const data = await res.json();
  return data;
};

export const getEjercicioById = async (id) => {
  console.log("se trae al ejercicio con id: ", id);
  const res = await fetch(`${entorno}/ejercicios/${id}`);
  const data = await res.json();
  return data;
};


export const getCategoriaToEjercicioAdd = async () => {
  console.log("se trae al receta con id: ");
  const res = await fetch(`${entorno}/ejercicios/categoria/add`);
  const data = await res.json();
  return data;
};
export const getCategoriaToEjercicioEdit = async (id) => {
  console.log("se trae al receta con id: ", id);
  const res = await fetch(`${entorno}/ejercicios/categoria/edit/${id}`);
  const data = await res.json();
  return data;
};

export const updateEjercicio = async (ejercicio) => {
  const res = await fetch(`${entorno}/ejercicios/${ejercicio.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ejercicio),
  });
  const data = await res.json();
  return data;
};

export const insertEjercicio = async (
  ejercicio
) => {
  const res = await fetch(`${entorno}/ejercicios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ejercicio),
  });
  const data = await res.json();
  return data;
};


export const getPatologiaToEjercicioAdd = async () => {
  console.log("se trae al ejercicio add: ");
  const res = await fetch(`${entorno}/ejercicios/patologia/add`);
  const data = await res.json();
  return data;
};
export const getPatologiaToEjercicioEdit = async (id) => {
  console.log("se trae al ejercicio con id: ", id);
  const res = await fetch(`${entorno}/ejercicios/patologia/edit/${id}`);
  const data = await res.json();
  return data;
};
export const inhabilitarEjercicio = async (
  id
) => {
  console.log(id)
  const res = await fetch(`${entorno}/ejercicios/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};