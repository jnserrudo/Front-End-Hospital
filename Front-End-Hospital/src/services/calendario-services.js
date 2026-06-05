import { entorno } from "./config";
import { handleResponse } from "./api-helper";

export const getAllEventos = async () => {
  const response = await fetch(entorno + "/calendario", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const eventos = await response.json();
  return eventos;
};

export const getEventosByFecha = async (fechaInicio, fechaFin) => {
  const response = await fetch(
    entorno + `/calendario/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const eventos = await response.json();
  return eventos;
};

export const getEventoById = async (id) => {
  const response = await fetch(entorno + `/calendario/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const evento = await response.json();
  return evento;
};

export const insertEvento = async (evento) => {
  const response = await fetch(entorno + "/calendario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(evento),
  });
  return await handleResponse(response);
};

export const updateEvento = async (id, evento) => {
  const response = await fetch(entorno + `/calendario/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(evento),
  });
  return await handleResponse(response);
};

export const disableEvento = async (id) => {
  const response = await fetch(entorno + `/calendario/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await handleResponse(response);
};
