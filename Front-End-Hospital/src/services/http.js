import { entorno } from "./config";
import { clearSession, getToken } from "./session";

/**
 * Cliente HTTP central de la app.
 * - Agrega el token de sesión a TODAS las llamadas a la API (también a las que
 *   todavía usan fetch directo, gracias a installFetchInterceptor).
 * - Convierte cualquier respuesta con error en un ApiError con un mensaje claro
 *   en castellano (nunca códigos ni detalles técnicos).
 * - Si la sesión venció (401) o la cuenta fue deshabilitada, cierra la sesión y
 *   vuelve al login explicando qué pasó.
 */

export class ApiError extends Error {
  constructor(message, { status = 0, code = null, friendly = true } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.friendly = friendly;
  }
}

export const NETWORK_MESSAGE =
  "No pudimos conectarnos con el servidor. Revisá tu conexión a internet e intentá de nuevo.";

const STATUS_MESSAGES = {
  400: "Hay datos incompletos o con formato incorrecto. Revisá el formulario.",
  401: "Tu sesión venció. Ingresá de nuevo para continuar.",
  403: "No tenés permiso para hacer esto.",
  404: "No encontramos lo que buscabas. Actualizá la página.",
  409: "Ya existe un registro con esos datos.",
  413: "El archivo es demasiado grande. Elegí uno más liviano.",
  500: "Ocurrió un problema en el servidor. Intentá de nuevo en unos minutos.",
  502: "Un servicio externo no respondió. Intentá de nuevo en unos minutos.",
  503: "El servidor no está disponible en este momento. Intentá de nuevo en unos minutos.",
};

// Un mensaje "apto para el usuario" no debe parecer técnico.
const looksTechnical = (msg) =>
  !msg ||
  typeof msg !== "string" ||
  /prisma|invalid|undefined|null|exception|stack|error:|econn|sql|cannot|failed|unexpected token|\bat\s+\w+\s*\(/i.test(msg);

const isApiUrl = (url) => {
  if (!url) return false;
  const u = String(url);
  return u.startsWith(entorno) || u.startsWith("/api/") || u.includes("/api/");
};

// Endpoints donde un 401 es una respuesta esperada (no significa "sesión vencida").
const isAuthEndpoint = (url) => /\/usuarios\/(jwtToken|password\/|recuperar|restablecer)/.test(String(url));

let redirecting = false;
const endSession = (motivo) => {
  if (redirecting) return;
  redirecting = true;
  clearSession();
  try {
    localStorage.setItem("sessionEvent", JSON.stringify({ type: "logout", motivo, at: Date.now() }));
  } catch {
    /* sin almacenamiento */
  }
  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign(`/login?motivo=${encodeURIComponent(motivo)}`);
  } else {
    redirecting = false;
  }
};

const notifyActivity = () => window.dispatchEvent(new Event("api-activity"));

const buildApiError = async (response) => {
  let body = null;
  try {
    body = await response.clone().json();
  } catch {
    /* respuesta sin JSON */
  }
  const serverMsg = body?.message || body?.err?.message;
  const message = !looksTechnical(serverMsg) ? serverMsg : STATUS_MESSAGES[response.status] || STATUS_MESSAGES[500];
  return new ApiError(message, { status: response.status, code: body?.code || null });
};

let installed = false;
export const installFetchInterceptor = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    if (!isApiUrl(url)) return originalFetch(input, init);

    const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    const token = getToken();
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

    let response;
    try {
      response = await originalFetch(input, { ...init, headers });
    } catch (error) {
      console.error("[http] Error de red:", error);
      throw new ApiError(NETWORK_MESSAGE, { status: 0, code: "RED" });
    }
    if (!headers.has("X-No-Activity")) notifyActivity();

    if (response.ok) return response;

    const apiError = await buildApiError(response);
    if (!isAuthEndpoint(url)) {
      if (response.status === 401) endSession("sesion-vencida");
      if (response.status === 403 && apiError.code === "CUENTA_DESHABILITADA") endSession("cuenta-deshabilitada");
    }
    throw apiError;
  };
};

/**
 * apiFetch("/usuarios", { method: "POST", body: {...} }) → datos JSON o ApiError.
 */
export const apiFetch = async (path, { method = "GET", body, headers = {}, ...rest } = {}) => {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${entorno}${path}`, {
    method,
    headers: isForm || body === undefined ? headers : { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    ...rest,
  });
  if (response.status === 204) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/** Mensaje claro para mostrar al usuario a partir de cualquier error. */
export const friendlyMessage = (error, fallback = "No pudimos completar la acción") => {
  if (error instanceof ApiError || error?.name === "ApiError") return error.message;
  if (error?.message && !looksTechnical(error.message) && error.message.length < 220) return error.message;
  const base = String(fallback).replace(/[.\s]+$/, "");
  return `${base}. Intentá de nuevo; si el problema sigue, avisá al administrador.`;
};
