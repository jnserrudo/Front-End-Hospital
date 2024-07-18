import { entorno } from "./config";

export const getAllPatologias = async () => {
  console.log('antes del fetch get all patologias')
  const res = await fetch(`${entorno}/patologias`);
  const data = await res.json();
  return data;
};

export const getPatologiaById = async (id) => {
  console.log("se trae al patologia con id: ", id);
  const res = await fetch(`${entorno}/patologias/${id}`);
  const data = await res.json();
  return data;
};



export const updatePatologia = async (patologia) => {
  const res = await fetch(`${entorno}/patologias/${patologia.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patologia),
  });
  const data = await res.json();
  return data;
};

export const insertPatologia = async (
  patologia
) => {
  const res = await fetch(`${entorno}/patologias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patologia),
  });
  const data = await res.json();
  return data;
};


export const inhabilitarPatologia = async (
  id
) => {
  const res = await fetch(`${entorno}/patologia/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};
