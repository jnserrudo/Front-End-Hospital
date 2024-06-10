import { entorno } from "./confing";

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
