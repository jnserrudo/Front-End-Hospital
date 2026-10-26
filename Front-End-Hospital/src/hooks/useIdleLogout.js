import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getSession, updateToken } from "../services/session";
import { entorno } from "../services/config";

export const IDLE_MS = 30 * 60 * 1000; // cierre tras 30 minutos sin actividad
export const WARNING_MS = 2 * 60 * 1000; // aviso 2 minutos antes
const RENEW_EVERY_MS = 10 * 60 * 1000; // renovamos el token cada 10 min si hubo actividad
const WRITE_THROTTLE_MS = 5 * 1000;
const ACTIVITY_KEY = "ultimaActividad";

const readLastActivity = () => +localStorage.getItem(ACTIVITY_KEY) || Date.now();

/**
 * Sesión deslizante:
 * - Solo cierra sesión por INACTIVIDAD real (mouse, teclado, toque, scroll o
 *   llamadas a la API reinician el contador). La actividad se comparte entre pestañas.
 * - 2 minutos antes muestra un aviso con cuenta regresiva.
 * - Mientras hay actividad renueva el token, así un usuario activo nunca queda afuera.
 */
export function useIdleLogout({ enabled = true } = {}) {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(WARNING_MS);
  const lastWriteRef = useRef(0);
  const lastRenewRef = useRef(Date.now());
  const warningRef = useRef(false);

  const logout = useCallback(
    (motivo = "logout") => {
      clearSession();
      localStorage.setItem("sessionEvent", JSON.stringify({ type: "logout", motivo, at: Date.now() }));
      setWarning(false);
      navigate(`/login?motivo=${motivo}`, { replace: true });
    },
    [navigate]
  );

  const markActivity = useCallback((force = false) => {
    const now = Date.now();
    if (!force && now - lastWriteRef.current < WRITE_THROTTLE_MS) return;
    lastWriteRef.current = now;
    localStorage.setItem(ACTIVITY_KEY, String(now));
  }, []);

  const renewToken = useCallback(async () => {
    lastRenewRef.current = Date.now();
    try {
      const res = await fetch(`${entorno}/usuarios/token/renovar`, {
        method: "POST",
        headers: { "X-No-Activity": "1" },
      });
      const data = await res.json();
      if (data?.token) updateToken(data.token);
    } catch (error) {
      // Si falla por red no cerramos la sesión: se reintenta en el próximo ciclo.
      console.warn("[sesión] No se pudo renovar el token:", error?.message);
    }
  }, []);

  const keepAlive = useCallback(() => {
    markActivity(true);
    setWarning(false);
    warningRef.current = false;
    renewToken();
  }, [markActivity, renewToken]);

  useEffect(() => {
    if (!enabled) return undefined;
    markActivity(true);

    // Durante el aviso, solo un clic/tecla o el botón "Seguir conectado" cuentan;
    // mover el mouse no lo cierra solo, para que el aviso se pueda leer.
    const onPassive = () => {
      if (!warningRef.current) markActivity();
    };
    const onActive = () => {
      if (!warningRef.current) markActivity();
    };
    const passive = ["mousemove", "scroll", "wheel", "touchmove"];
    const active = ["mousedown", "keydown", "touchstart"];
    passive.forEach((ev) => window.addEventListener(ev, onPassive, { passive: true }));
    active.forEach((ev) => window.addEventListener(ev, onActive, { passive: true }));
    window.addEventListener("api-activity", onActive);

    const onStorage = (e) => {
      if (e.key === "token" && !e.newValue) {
        // Se cerró la sesión en otra pestaña.
        navigate("/login?motivo=otra-pestana", { replace: true });
      }
    };
    window.addEventListener("storage", onStorage);

    const tick = setInterval(() => {
      const session = getSession();
      if (!session) {
        navigate("/login?motivo=sin-sesion", { replace: true });
        return;
      }
      const now = Date.now();
      if (session.exp && session.exp <= now) {
        logout("sesion-vencida");
        return;
      }
      const idle = now - readLastActivity();
      if (idle >= IDLE_MS) {
        logout("inactividad");
        return;
      }
      const showWarning = idle >= IDLE_MS - WARNING_MS;
      warningRef.current = showWarning;
      setWarning(showWarning);
      setRemainingMs(Math.max(0, IDLE_MS - idle));
      const huboActividad = readLastActivity() > lastRenewRef.current;
      if (!showWarning && huboActividad && now - lastRenewRef.current >= RENEW_EVERY_MS) {
        renewToken();
      }
    }, 1000);

    return () => {
      clearInterval(tick);
      passive.forEach((ev) => window.removeEventListener(ev, onPassive));
      active.forEach((ev) => window.removeEventListener(ev, onActive));
      window.removeEventListener("api-activity", onActive);
      window.removeEventListener("storage", onStorage);
    };
  }, [enabled, logout, markActivity, navigate, renewToken]);

  return { warning, remainingMs, keepAlive, logout };
}
