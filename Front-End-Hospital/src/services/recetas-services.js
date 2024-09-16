import { entorno } from "./config";

export const getAllRecetas = async () => {
  console.log('antes del fetch get all recetas')
  const res = await fetch(`${entorno}/recetas`);
  const data = await res.json();
  return data;
};


export const getAllRecetasFiltro = async (
  recetas
) => {

  console.log("recetas filtro ", recetas)
  const res = await fetch(`${entorno}/recetas/filtro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recetas),
  });
  const data = await res.json();
  return data;
};

export const getRecetaById = async (id) => {
  console.log("se trae al receta con id: ", id);
  const res = await fetch(`${entorno}/recetas/${id}`);
  const data = await res.json();
  return data;
};

export const getPatologiaToRecetaAdd = async () => {
  console.log("se trae al receta con id: ");
  const res = await fetch(`${entorno}/recetas/patologia/add`);
  const data = await res.json();
  return data;
};
export const getPatologiaToRecetaEdit = async (id) => {
  console.log("se trae al receta con id: ", id);
  const res = await fetch(`${entorno}/recetas/patologia/edit/${id}`);
  const data = await res.json();
  return data;
};


export const getCategoriaToRecetaAdd = async () => {
  console.log("se trae CATEGORIAS PARA AGREGAR A LAS RECETAS id: ");
  const res = await fetch(`${entorno}/recetas/categoria/add`);
  const data = await res.json();
  console.log("CATEGORIAS PARA AGREGAR A LAS RECETAS: ",data);

  return data;
};
export const getCategoriaToRecetaEdit = async (id) => {
  console.log("se trae al receta con id: ", id);
  const res = await fetch(`${entorno}/recetas/categoria/edit/${id}`);
  const data = await res.json();
  return data;
};



export const getRecetaByPatologia = async (idPatologia) => {
    console.log("se trae al receta con id: ", idPatologia);
    const res = await fetch(`${entorno}/recetas/patologia/${idPatologia}`);
    const data = await res.json();
    return data;
};

export const getRecetaByPaciente = async (ndocu) => {
    console.log("se trae al receta con ndocu: ", ndocu);
    const res = await fetch(`${entorno}/recetas/paciente/${ndocu}`);
    const data = await res.json();
    return data;
 };



export const updateReceta = async (receta) => {
  const res = await fetch(`${entorno}/recetas/${receta.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receta),
  });
  const data = await res.json();
  return data;
};

export const insertReceta = async (
  receta
) => {
  const res = await fetch(`${entorno}/recetas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receta),
  });
  const data = await res.json();
  return data;
};



export const inhabilitarRecetas = async (
  id
) => {
  const res = await fetch(`${entorno}/recetas/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
