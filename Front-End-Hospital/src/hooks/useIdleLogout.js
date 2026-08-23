import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DEFAULT_IDLE_MS = 30 * 60 * 1000; // 30 minutos
const THROTTLE_MS = 20 * 1000; // no resetear el timer más de una vez cada 20s

/**
 * Cierra sesión solo tras inactividad real (no por TTL fijo del JWT mientras hay uso).
 * También desloguea de inmediato si el JWT ya expiró al montar.
 */
export function useIdleLogout({
  token,
  idleMs = DEFAULT_IDLE_MS,
  enabled = true,
} = {}) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const lastResetRef = useRef(0);

  const logout = useCallback(
    (reason) => {
      localStorage.clear();
      if (reason === "idle") {
        toast("Sesión cerrada por inactividad", { icon: "⏱", duration: 4000 });
      }
      navigate("/");
    },
    [navigate]
  );

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastResetRef.current < THROTTLE_MS && timerRef.current) {
      return;
    }
    lastResetRef.current = now;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => logout("idle"), idleMs);
  }, [enabled, idleMs, logout]);

  useEffect(() => {
    if (!enabled) return;

    if (token && token.exp * 1000 <= Date.now()) {
      logout("expired");
      return;
    }

    resetTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const onActivity = () => resetTimer();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        resetTimer();
      }
    };

    events.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token, enabled, resetTimer, logout]);
}
