import { entorno } from "./config";
import { handleResponse } from "./api-helper";

export const getAllFAQs = async () => {
  const response = await fetch(entorno + "/faq", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const faqs = await response.json();
  return faqs;
};

export const getFAQsByCategoria = async (categoria) => {
  const response = await fetch(entorno + `/faq/categoria/${categoria}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const faqs = await response.json();
  return faqs;
};

export const getFAQById = async (id) => {
  const response = await fetch(entorno + `/faq/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const faq = await response.json();
  return faq;
};

export const insertFAQ = async (faq) => {
  const response = await fetch(entorno + "/faq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faq),
  });
  return await handleResponse(response);
};

export const updateFAQ = async (id, faq) => {
  const response = await fetch(entorno + `/faq/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faq),
  });
  return await handleResponse(response);
};

export const disableFAQ = async (id) => {
  const response = await fetch(entorno + `/faq/inhabilitar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await handleResponse(response);
};
