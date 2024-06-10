import { entorno } from "./config";

export const getAllUsuarios = async () => {
  console.log('antes del fetch get all usuarios')
  const res = await fetch(`${entorno}/usuarios`);
  const data = await res.json();
  return data;
};

export const getUsuarioById = async (id) => {
  console.log("se trae al usuario con id: ", id);
  const res = await fetch(`${entorno}/usuarios/${id}`);
  const data = await res.json();
  return data;
};

export const updateUsuario = async (usuario) => {
  const res = await fetch(`${entorno}/usuarios/${usuario.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });
  const data = await res.json();
  return data;
};

export const insertUsuario = async (
  nombre,
  password,
  idRol=null
) => {
  const res = await fetch(`${entorno}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        nombre,
        password,
        idRol
    }),
  });
  const data = await res.json();
  return data;
};
