// Reglas de contraseña (las mismas que valida el servidor).
export const reglasPassword = (pwd, confirmar) => [
  { ok: pwd.length >= 8, text: "Al menos 8 caracteres" },
  { ok: /[A-Za-zÑñ]/.test(pwd), text: "Al menos una letra" },
  { ok: /[0-9]/.test(pwd), text: "Al menos un número" },
  { ok: pwd.length > 0 && pwd === confirmar, text: "Las dos contraseñas coinciden" },
];
