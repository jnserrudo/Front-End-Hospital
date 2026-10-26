import { apiFetch } from "./http";

// Todas las funciones lanzan ApiError con un mensaje claro si algo falla.
export const getAllUsuarios = () => apiFetch("/usuarios");
export const getUsuarioById = (id) => apiFetch(`/usuarios/${id}`);
export const getMe = () => apiFetch("/usuarios/me");
export const getAllRoles = () => apiFetch("/usuarios/rol");
export const getProfesionales = () => apiFetch("/usuarios/profesionales/lista");

export const insertUsuario = (usuario) => apiFetch("/usuarios", { method: "POST", body: usuario });
export const updateUsuario = (usuario) => apiFetch(`/usuarios/${usuario.id}`, { method: "PUT", body: usuario });

// Restablecer la contraseña de otra cuenta (solo administradores)
export const blanquearUsuario = (usuario) => apiFetch(`/usuarios/blanquear/${usuario.id}`, { method: "PUT" });

// Cambiar la contraseña propia
export const updatePassword = (id, newPassword, passwordActual) =>
  apiFetch(`/usuarios/password/${id}`, { method: "PUT", body: { newPassword, passwordActual } });

export const inhabilitarUsuario = (id) => apiFetch(`/usuarios/inhabilitar/${id}`, { method: "PUT" });
export const habilitarUsuario = (id) => apiFetch(`/usuarios/habilitar/${id}`, { method: "PUT" });

export const getPatologiaToUsuarioEdit = (id) => apiFetch(`/usuarios/patologia/edit/${id}`);
