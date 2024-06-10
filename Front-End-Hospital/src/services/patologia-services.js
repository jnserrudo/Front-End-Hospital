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
  ndocu,
  obraSocial,
  plan,
  domicilio,
  nroAfiliado,
  telefono,
  vacunas,
  afp,
  app,
  alergias
) => {
  const res = await fetch(`${entorno}/patologias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ndocu,
      obraSocial,
      plan,
      domicilio,
      nroAfiliado,
      telefono,
      vacunas,
      afp,
      app,
      alergias,
    }),
  });
  const data = await res.json();
  return data;
};
