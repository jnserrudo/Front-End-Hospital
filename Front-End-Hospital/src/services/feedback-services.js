import { entorno } from "./config";

export const getAllFeedbacks = async () => {
  const response = await fetch(entorno + "/feedback", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const feedbacks = await response.json();
  return feedbacks;
};

export const getFeedbackById = async (id) => {
  const response = await fetch(entorno + `/feedback/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const feedback = await response.json();
  return feedback;
};

export const insertFeedback = async (feedback) => {
  // Si falla, el interceptor lanza un ApiError con un mensaje amigable.
  const response = await fetch(entorno + "/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });
  return response.json();
};

export const markFeedbackAsRead = async (id) => {
  const response = await fetch(entorno + `/feedback/marcar-leido/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
