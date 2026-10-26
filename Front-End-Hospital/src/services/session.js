// Sesión del usuario en el navegador. El rol y el id salen del JWT firmado por el
// servidor; el backend vuelve a validar todo en cada solicitud.

const KEYS = ["token", "idUsuario", "usuario", "rol", "dni", "nombre", "apellido"];

export const ROLES = { ADMIN: 1, PROFESIONAL: 2, PACIENTE: 3 };
export const ROL_LABEL = { 1: "Administrador", 2: "Profesional de salud", 3: "Paciente" };

export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem("token");

export const getSession = () => {
  const token = getToken();
  const payload = parseJwt(token);
  if (!token || !payload) return null;
  return {
    token,
    payload,
    id: payload.sub ?? +localStorage.getItem("idUsuario"),
    rol: payload.rol ?? +localStorage.getItem("rol"),
    usuario: payload.usuario ?? localStorage.getItem("usuario"),
    nombre: localStorage.getItem("nombre") || "",
    apellido: localStorage.getItem("apellido") || "",
    dni: localStorage.getItem("dni") || "",
    exp: payload.exp ? payload.exp * 1000 : 0,
  };
};

export const isSessionValid = () => {
  const s = getSession();
  return Boolean(s && s.payload?.scope !== "password-change" && s.exp > Date.now());
};

export const getRol = () => getSession()?.rol ?? null;
// Administrador o profesional de salud (pueden administrar contenidos).
export const isStaff = () => [ROLES.ADMIN, ROLES.PROFESIONAL].includes(+getRol());

export const setSession = (data) => {
  const payload = parseJwt(data.token);
  localStorage.setItem("token", data.token);
  localStorage.setItem("idUsuario", String(data.id ?? payload?.sub ?? ""));
  localStorage.setItem("usuario", data.usuario ?? payload?.usuario ?? "");
  localStorage.setItem("rol", String(data.rol ?? payload?.rol ?? ""));
  if (data.dni !== undefined) localStorage.setItem("dni", String(data.dni));
  if (data.nombre !== undefined) localStorage.setItem("nombre", data.nombre || "");
  if (data.apellido !== undefined) localStorage.setItem("apellido", data.apellido || "");
};

export const updateToken = (token) => {
  if (token) localStorage.setItem("token", token);
};

export const clearSession = () => {
  KEYS.forEach((k) => localStorage.removeItem(k));
};
