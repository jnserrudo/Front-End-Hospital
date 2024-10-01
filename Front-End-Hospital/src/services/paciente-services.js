import { entorno } from "./config";


export const getAllPacientes = async () => {
  console.log('antes del fetch get all pacientes')
  const res = await fetch(`${entorno}/pacientes`);
  const data = await res.json();
  return data;
};

export const getPacienteByNdocu = async (dni) => {
  console.log("se trae al paciente con dni: ", dni);
  const res = await fetch(`${entorno}/pacientes/${dni}`);
  const data = await res.json();
  return data;
};
export const getPacienteById = async (id) => {
  console.log("se trae al paciente con id: ", id);
  const res = await fetch(`${entorno}/pacientes/${id}`);
  const data = await res.json();
  return data;
};

export const DeshabilitarPaciente = async (pacienteId, usuarioId, motivo) => {
  const res = await fetch(`${entorno}/pacientes/deshabilitar`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({pacienteId, usuarioId, motivo}),
  });

  const data = await res.json();
  if(data.err){
    throw new Error(data.err.message);
  }


  return data;
};

export const HabilitarPaciente = async (pacienteId, usuarioId, motivo) => {
  const res = await fetch(`${entorno}/pacientes/habilitar`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({pacienteId, usuarioId, motivo}),
  });
  const data = await res.json();
  if(data.err){
    throw new Error(data.err.message);
  }

  return data;
};

export const updatePaciente = async (paciente) => {
  const res = await fetch(`${entorno}/pacientes/${paciente.dni}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paciente),
  });
  const data = await res.json();
  return data;
};

export const insertPaciente = async (
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
  const res = await fetch(`${entorno}/pacientes`, {
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



export const inhabilitarPaciente = async (
  id
) => {
  const res = await fetch(`${entorno}/paciente/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};



export const getInformacionxPaciente = async (idUsuario) => {
  console.log("se trae las informaciones del paciente con idUsuario: ", idUsuario);
  const res = await fetch(`${entorno}/pacientes/informacion/patologias/${idUsuario}`);
  const data = await res.json();
  return data;
};

export const getEjercicioxPaciente = async (idUsuario) => {
  console.log("se trae los ejercicios del paciente con idUsuario: ", idUsuario);
  const res = await fetch(`${entorno}/pacientes/ejercicios/patologias/${idUsuario}`);
  const data = await res.json();
  return data;
};