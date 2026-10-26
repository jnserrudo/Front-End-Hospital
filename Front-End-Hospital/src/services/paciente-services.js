import { apiFetch } from "./http";

// Un paciente es una cuenta de usuario con rol Paciente: el alta y la edición
// van por /pacientes, que usa por dentro el mismo modelo de usuarios (rol fijo).
export const getAllPacientes = () => apiFetch("/pacientes");
export const getPacienteById = (id) => apiFetch(`/pacientes/${id}`);

export const insertPaciente = (paciente) => apiFetch("/pacientes", { method: "POST", body: paciente });
export const updatePaciente = (paciente) => apiFetch(`/pacientes/${paciente.id}`, { method: "PUT", body: paciente });

// El usuario que realiza la acción sale de la sesión en el servidor.
export const DeshabilitarPaciente = (pacienteId, motivo) =>
  apiFetch("/pacientes/deshabilitar", { method: "PUT", body: { pacienteId, motivo } });
export const HabilitarPaciente = (pacienteId, motivo) =>
  apiFetch("/pacientes/habilitar", { method: "PUT", body: { pacienteId, motivo } });

export const getInformacionxPaciente = (idUsuario) => apiFetch(`/pacientes/informacion/patologias/${idUsuario}`);
export const getEjercicioxPaciente = (idUsuario) => apiFetch(`/pacientes/ejercicios/patologias/${idUsuario}`);
