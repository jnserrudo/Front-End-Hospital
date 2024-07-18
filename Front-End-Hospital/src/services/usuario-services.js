import { entorno } from "./config";

export const getAllUsuarios = async () => {
  console.log("antes del fetch get all usuarios");
  const res = await fetch(`${entorno}/usuarios`);
  const data = await res.json();
  return data;
};
/* 
export const getPatologiaToUsuarioEdit = async () => {
  console.log("antes del fetch get all usuarios");
  const res = await fetch(`${entorno}/usuarios`);
  const data = await res.json();
  return data;
};
 */
export const getUsuarioById = async (id) => {
  console.log("se trae al usuario con id: ", id);
  const res = await fetch(`${entorno}/usuarios/${id}`);
  const data = await res.json();
  return data;
};

export const getAllRoles = async () => {
  console.log("se trae roles del usuario: ");
  const res = await fetch(`${entorno}/usuarios/rol`);
  const data = await res.json();
  return data;
};

export const getAllRolesToEdit = async (idRol) => {
  //traera los otros roles que no son el que tiene actualmente
  console.log("se trae roles del usuario: ");
  const res = await fetch(`${entorno}/usuarios/rol/edit/${idRol}`);
  const data = await res.json();
  return data;
};

export const getRolByUser = async (user) => {
  console.log("se trae roles del usuario: ", user);
  const res = await fetch(`${entorno}/usuarios/rol/${user}`);
  const data = await res.json();
  return data;
};

export const updateUsuario = async (usuario) => {
  console.log("se esta por actualizar el usuario: ",usuario)
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

export const insertUsuario = async (usuario) => {
  const res = await fetch(`${entorno}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });
  const data = await res.json();
  return data;
};

export const blanquearUsuario = async (usuario) => {
  const res = await fetch(`${entorno}/usuarios/blanquear/${usuario.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const updatePassword = async (id, newPassword) => {
  const res = await fetch(`${entorno}/usuarios/password/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });
  const data = await res.json();
  return data;
};

export const getJwtToken = async (usuario, password) => {
  const res = await fetch(`${entorno}/usuarios/jwtToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario,
      password,
    }),
  });
  const data = await res.json();
  return data;
};



export const inhabilitarUsuario = async (
  id
) => {
  const res = await fetch(`${entorno}/usuarios/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};


export const getPatologiaToUsuarioEdit = async (id) => {
  console.log("se trae al usuario con id: ", id);
  const res = await fetch(`${entorno}/usuarios/patologia/edit/${id}`);
  const data = await res.json();
  return data;
};