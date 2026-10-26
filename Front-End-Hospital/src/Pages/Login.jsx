import React, { useEffect, useState } from "react";
import { Button, Input, Alert, Modal } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, CheckCircleFilled, CloseCircleFilled, QuestionCircleOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { entorno } from "../services/config.js";
import { friendlyMessage } from "../services/http.js";
import { isSessionValid, setSession } from "../services/session.js";
import { notify } from "../ui/notify.js";
import { reglasPassword } from "../utils/password.js";
import { RecuperarPasswordModal } from "../Components/RecuperarPasswordModal.jsx";

const MOTIVOS = {
  inactividad: { type: "warning", text: "Cerramos tu sesión porque pasaron 30 minutos sin actividad. Ingresá de nuevo para continuar." },
  "sesion-vencida": { type: "warning", text: "Tu sesión venció. Ingresá de nuevo para continuar." },
  "cuenta-deshabilitada": { type: "error", text: "Tu cuenta está deshabilitada. Comunicate con el hospital para volver a habilitarla." },
  "otra-pestana": { type: "info", text: "Cerraste sesión en otra pestaña. Ingresá de nuevo para continuar." },
  "sin-sesion": { type: "info", text: "Ingresá con tu usuario y contraseña para usar la aplicación." },
  logout: { type: "success", text: "Cerraste sesión correctamente." },
};


// Las llamadas del login no usan la sesión guardada: el token del cambio
// obligatorio vive solo en memoria hasta que la contraseña se cambia.
const postJson = async (url, body, token, method = "POST") => {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const motivo = MOTIVOS[searchParams.get("motivo")] || null;

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  // { tokenCambio, id, usuario, nombre, ... } mientras falta cambiar la contraseña
  const [cambioPendiente, setCambioPendiente] = useState(null);
  const [ayudaClave, setAyudaClave] = useState(false);
  const [recuperar, setRecuperar] = useState(false);

  useEffect(() => {
    if (isSessionValid()) navigate("/hospital", { replace: true });
  }, [navigate]);

  const limpiarMotivo = () => {
    if (searchParams.get("motivo")) setSearchParams({}, { replace: true });
  };

  const handleLogin = async () => {
    setIntentoEnviar(true);
    setError("");
    if (!usuario.trim() || !password) {
      setError(!usuario.trim() ? "Ingresá tu usuario." : "Ingresá tu contraseña.");
      return;
    }
    setLoading(true);
    limpiarMotivo();
    try {
      const data = await postJson(`${entorno}/usuarios/jwtToken`, { usuario: usuario.trim(), password });
      if (data.debeCambiarPassword) {
        setCambioPendiente(data);
        setIntentoEnviar(false);
        notify.info("Por seguridad, antes de entrar tenés que crear una contraseña nueva.");
        return;
      }
      setSession(data);
      notify.success(`¡Hola, ${data.nombre || data.usuario}!`);
      navigate("/hospital", { replace: true });
    } catch (err) {
      setError(friendlyMessage(err, "No pudimos iniciar sesión"));
    } finally {
      setLoading(false);
    }
  };

  const reglas = reglasPassword(nuevoPassword, confirmarPassword);
  const passwordValida = reglas.every((r) => r.ok);

  const handleChangePassword = async () => {
    setIntentoEnviar(true);
    setError("");
    if (!passwordValida) {
      setError("La contraseña nueva todavía no cumple todos los requisitos de la lista.");
      return;
    }
    setLoading(true);
    try {
      const data = await postJson(
        `${entorno}/usuarios/password/${cambioPendiente.id}`,
        { newPassword: nuevoPassword },
        cambioPendiente.tokenCambio,
        "PUT"
      );
      setSession({ ...cambioPendiente, token: data.token });
      setCambioPendiente(null);
      notify.success("Listo, ya podés usar tu nueva contraseña.");
      navigate("/hospital", { replace: true });
    } catch (err) {
      // El token del cambio dura 15 minutos: si venció, hay que volver a ingresar.
      if (err?.status === 401) {
        setCambioPendiente(null);
        setPassword("");
        setError("Pasó mucho tiempo desde que ingresaste. Volvé a ingresar con tu contraseña temporal.");
      } else {
        setError(friendlyMessage(err, "No pudimos cambiar la contraseña"));
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelarCambio = () => {
    setCambioPendiente(null);
    setPassword("");
    setNuevoPassword("");
    setConfirmarPassword("");
    setError("");
    notify.info("No se cambió la contraseña. Para entrar vas a tener que cambiarla.");
  };

  return (
    <div className="cont_login">
      <div className="login-header">
        <img
          src="/logo-onativia.png"
          alt="Logo"
          style={{ width: 72, height: 72, objectFit: "contain", marginBottom: 8 }}
          onError={(e) => (e.target.style.display = "none")}
        />
        <h2 className="login-title">{cambioPendiente ? `Hola, ${cambioPendiente.nombre || cambioPendiente.usuario}` : "Bienvenido"}</h2>
        <p className="login-subtitle">
          {cambioPendiente
            ? "Es tu primer ingreso o te restablecieron la contraseña: creá una contraseña nueva para continuar."
            : "Ingresá a tu cuenta"}
        </p>
      </div>

      {!error && motivo && !cambioPendiente && (
        <Alert message={motivo.text} type={motivo.type} showIcon style={{ borderRadius: "var(--radius)", marginBottom: 8 }} />
      )}
      {error && <Alert message={error} type="error" showIcon style={{ borderRadius: "var(--radius)", marginBottom: 8 }} />}

      {cambioPendiente ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Contraseña nueva"
              aria-label="Contraseña nueva"
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              onPressEnter={handleChangePassword}
              size="large"
              autoComplete="new-password"
              style={{ borderRadius: "var(--radius)" }}
            />
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Repetí la contraseña nueva"
              aria-label="Repetí la contraseña nueva"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              onPressEnter={handleChangePassword}
              size="large"
              autoComplete="new-password"
              style={{ borderRadius: "var(--radius)" }}
            />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }} aria-live="polite">
              {reglas.map((r) => (
                <li key={r.text} style={{ color: r.ok ? "var(--success, #10b981)" : intentoEnviar ? "#ef4444" : "var(--gray-500)", display: "flex", gap: 6, alignItems: "center" }}>
                  {r.ok ? <CheckCircleFilled /> : <CloseCircleFilled />} {r.text}
                </li>
              ))}
            </ul>
          </div>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleChangePassword}
            style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 46, marginTop: 8 }}
          >
            Guardar contraseña y entrar
          </Button>
          <Button type="link" block onClick={cancelarCambio} disabled={loading}>
            Volver al inicio de sesión
          </Button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              prefix={<UserOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Usuario"
              aria-label="Usuario"
              value={usuario}
              status={intentoEnviar && !usuario.trim() ? "error" : ""}
              onChange={(e) => setUsuario(e.target.value)}
              onPressEnter={handleLogin}
              size="large"
              autoComplete="username"
              style={{ borderRadius: "var(--radius)" }}
            />
            <Input.Password
              prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
              placeholder="Contraseña"
              aria-label="Contraseña"
              value={password}
              status={intentoEnviar && !password ? "error" : ""}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleLogin}
              size="large"
              autoComplete="current-password"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
          <Button
            type="primary"
            size="large"
            block
            icon={<LoginOutlined />}
            loading={loading}
            onClick={handleLogin}
            style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 46, marginTop: 8 }}
          >
            Ingresar
          </Button>
          <div className="login-ayudas">
            <Button type="link" icon={<QuestionCircleOutlined />} onClick={() => setRecuperar(true)}>
              ¿Olvidaste tu contraseña?
            </Button>
            <Button type="link" onClick={() => setAyudaClave(true)}>
              ¿Olvidaste tu usuario?
            </Button>
          </div>
          <RecuperarPasswordModal open={recuperar} onClose={() => setRecuperar(false)} valorInicial={usuario} />
          <Modal
            open={ayudaClave}
            onCancel={() => setAyudaClave(false)}
            title="¿Olvidaste tu usuario?"
            footer={<Button type="primary" onClick={() => setAyudaClave(false)}>Entendido</Button>}
          >
            <p style={{ marginBottom: 12 }}>
              Tu usuario es el que te dieron cuando te crearon la cuenta. Si no lo recordás, tenés dos caminos:
            </p>
            <ul style={{ paddingLeft: 18, marginBottom: 12 }}>
              <li>
                Si tu cuenta tiene email cargado, usá <strong>«¿Olvidaste tu contraseña?»</strong> con tu email o tu DNI: en el email
                te recordamos tu usuario.
              </li>
              <li>Si no, consultalo en el hospital o pedíselo a un administrador.</li>
              <li>Si pusiste mal la contraseña varias veces, esperá 15 minutos antes de volver a probar.</li>
            </ul>
            <p style={{ margin: 0 }}>
              <PhoneOutlined style={{ transform: "rotate(90deg)" }} /> Hospital Dr. Arturo Oñativia: <a href="tel:+543874221605">0387 422-1605</a>
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};
