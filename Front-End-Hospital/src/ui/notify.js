import toast from "react-hot-toast";
import { friendlyMessage, NETWORK_MESSAGE } from "../services/http";

/**
 * Único helper de notificaciones de la app (sobre react-hot-toast).
 * Los mensajes de error siempre son claros: dicen qué falló y qué hacer.
 */
export const notify = {
  success: (message, opts) => toast.success(message, { duration: 3500, ...opts }),
  info: (message, opts) => toast(message, { icon: "ℹ️", duration: 4000, ...opts }),
  warning: (message, opts) => toast(message, { icon: "⚠️", duration: 5000, ...opts }),
  error: (error, fallback, opts) => {
    const message = typeof error === "string" ? error : friendlyMessage(error, fallback);
    // Sin conexión fallan muchas llamadas a la vez: mostramos UN solo aviso (id fijo).
    // Los demás errores iguales también se agrupan (mismo texto = mismo aviso).
    const esRed = error?.code === "RED" || message === NETWORK_MESSAGE;
    const id = opts?.id ?? (esRed ? "error-red" : `error:${message}`);
    return toast.error(message, { duration: esRed ? 8000 : 6000, ...opts, id });
  },
  loading: (message, opts) => toast.loading(message, opts),
  dismiss: (id) => toast.dismiss(id),
  /**
   * notify.promise(promesa, { loading: "Guardando…", success: "Guardado", error: "No pudimos guardar" })
   * Devuelve el resultado de la promesa o relanza el error (ya notificado).
   */
  promise: async (promise, { loading, success, error }) => {
    const id = toast.loading(loading || "Procesando…");
    try {
      const result = await promise;
      toast.success(typeof success === "function" ? success(result) : success, { id, duration: 3500 });
      return result;
    } catch (err) {
      if (err?.code === "RED") {
        toast.dismiss(id);
        notify.error(err);
      } else {
        toast.error(friendlyMessage(err, error), { id, duration: 6000 });
      }
      err.notified = true;
      throw err;
    }
  },
};

// Red de seguridad: si alguna acción falla y nadie mostró el error, avisamos igual.
let installed = false;
export const installGlobalErrorNotifier = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("unhandledrejection", (event) => {
    const err = event.reason;
    if (!err || err.notified) return;
    if (err.name === "ApiError") {
      // 401 ya redirige al login con su propio mensaje.
      if (err.status === 401 || err.code === "CUENTA_DESHABILITADA") return;
      notify.error(err);
      event.preventDefault();
    }
  });
};

export default notify;
