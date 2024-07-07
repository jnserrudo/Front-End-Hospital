import { entorno } from "./config";

export const getAllInformacions = async () => {
  console.log('antes del fetch get all informacions')
  const res = await fetch(`${entorno}/informacion`);
  const data = await res.json();
  return data;
};

export const getInformacionById = async (id) => {
  console.log("se trae al informacion con id: ", id);
  const res = await fetch(`${entorno}/informacion/${id}`);
  const data = await res.json();
  return data;
};



export const updateInformacion = async (informacion) => {
  const res = await fetch(`${entorno}/informacion/${informacion.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(informacion),
  });
  const data = await res.json();
  return data;
};

export const insertInformacion = async (
  informacion
) => {
  const res = await fetch(`${entorno}/informacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(informacion),
  });
  const data = await res.json();
  return data;
};
