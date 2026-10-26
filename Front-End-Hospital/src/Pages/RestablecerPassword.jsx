import React, { useEffect, useState } from "react";
import { Alert, Button, Input, Result, Spin } from "antd";
import { LockOutlined, CheckCircleFilled, CloseCircleFilled, LoginOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../Components/Header";
import { RecuperarPasswordModal } from "../Components/RecuperarPasswordModal";
import { entorno } from "../services/config.js";
import { friendlyMessage } from "../services/http.js";
import { reglasPassword } from "../utils/password.js";
import { notify } from "../ui/notify.js";
import "../style.css";
import "../ventanaEmergente.css";

const TITULOS = {
  TOKEN_VENCIDO: "El enlace venció",
  TOKEN_USADO: "Este enlace ya se usó",
  TOKEN_INVALIDO: "El enlace no es válido",
};

const llamar = async (url, opciones) => {
  const res = await fetch(url, opciones);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data?.message || "No pudimos completar la acción"), { name: "ApiError", code: data?.code, status: res.status });
  return data;
};

// Pantalla a la que lleva el enlace del email: /restablecer-contrasena?token=...
export const RestablecerPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error | hecho
  const [cuenta, setCuenta] = useState(null);
  const [problema, setProblema] = useState({ code: "", message: "" });
  const [pwd, setPwd] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [intento, setIntento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [pedirOtro, setPedirOtro] = useState(false);

  useEffect(() => {
    let vivo = true;
    if (!token) {
      setProblema({ code: "TOKEN_INVALIDO", message: "Abriste la página sin el enlace completo. Usá el botón del email o pedí uno nuevo." });
      setEstado("error");
      return undefined;
    }
    llamar(`${entorno}/usuarios/restablecer/verificar?token=${encodeURIComponent(token)}`)
      .then((d) => {
        if (!vivo) return;
        setCuenta(d);
        setEstado("listo");
      })
      .catch((e) => {
        if (!vivo) return;
        setProblema({ code: e.code || "TOKEN_INVALIDO", message: friendlyMessage(e, "No pudimos revisar el enlace") });
        setEstado("error");
      });
    return () => {
      vivo = false;
    };
  }, [token]);

  const reglas = reglasPassword(pwd, confirmar);
  const valida = reglas.every((r) => r.ok);

  const guardar = async () => {
    setIntento(true);
    setError("");
    if (!valida) {
      setError("La contraseña nueva todavía no cumple todos los requisitos de la lista.");
      return;
    }
    setGuardando(true);
    try {
      await llamar(`${entorno}/usuarios/restablecer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: pwd }),
      });
      setEstado("hecho");
      notify.success("Listo: tu contraseña nueva ya está guardada.");
    } catch (e) {
      if (["TOKEN_VENCIDO", "TOKEN_USADO", "TOKEN_INVALIDO"].includes(e.code)) {
        setProblema({ code: e.code, message: friendlyMessage(e) });
        setEstado("error");
      } else {
        setError(friendlyMessage(e, "No pudimos guardar la contraseña nueva"));
      }
    } finally {
      setGuardando(false);
    }
  };

  let contenido;
  if (estado === "cargando") {
    contenido = (
      <div style={{ textAlign: "center", padding: 32 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "var(--gray-500)" }}>Revisando el enlace…</p>
      </div>
    );
  } else if (estado === "error") {
    contenido = (
      <Result
        status="warning"
        title={TITULOS[problema.code] || TITULOS.TOKEN_INVALIDO}
        subTitle={problema.message}
        style={{ padding: "8px 0" }}
        extra={[
          <Button key="otro" type="primary" icon={<MailOutlined />} onClick={() => setPedirOtro(true)}>
            Pedir un enlace nuevo
          </Button>,
          <Button key="login" onClick={() => navigate("/login", { replace: true })}>
            Ir a ingresar
          </Button>,
        ]}
      />
    );
  } else if (estado === "hecho") {
    contenido = (
      <Result
        status="success"
        title="¡Contraseña actualizada!"
        subTitle={`Ya podés ingresar con tu usuario «${cuenta?.usuario}» y tu contraseña nueva. Por seguridad cerramos las sesiones que estaban abiertas.`}
        style={{ padding: "8px 0" }}
        extra={
          <Button type="primary" size="large" icon={<LoginOutlined />} onClick={() => navigate("/login", { replace: true })}>
            Ingresar
          </Button>
        }
      />
    );
  } else {
    contenido = (
      <>
        <div className="login-header">
          <h2 className="login-title">Creá tu contraseña nueva</h2>
          <p className="login-subtitle">
            {cuenta?.nombre ? `Hola, ${cuenta.nombre}. ` : ""}Tu usuario es <strong>{cuenta?.usuario}</strong>.
          </p>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ borderRadius: "var(--radius)", marginBottom: 8 }} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input.Password
            prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
            placeholder="Contraseña nueva"
            aria-label="Contraseña nueva"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onPressEnter={guardar}
            size="large"
            autoComplete="new-password"
            autoFocus
          />
          <Input.Password
            prefix={<LockOutlined style={{ color: "var(--gray-400)" }} />}
            placeholder="Repetí la contraseña nueva"
            aria-label="Repetí la contraseña nueva"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            onPressEnter={guardar}
            size="large"
            autoComplete="new-password"
          />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }} aria-live="polite">
            {reglas.map((r) => (
              <li
                key={r.text}
                style={{ color: r.ok ? "var(--success, #10b981)" : intento ? "#ef4444" : "var(--gray-500)", display: "flex", gap: 6, alignItems: "center" }}
              >
                {r.ok ? <CheckCircleFilled /> : <CloseCircleFilled />} {r.text}
              </li>
            ))}
          </ul>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={guardando}
          onClick={guardar}
          style={{ borderRadius: "var(--radius)", fontWeight: 600, height: 46, marginTop: 8 }}
        >
          Guardar contraseña nueva
        </Button>
        <Button type="link" block onClick={() => navigate("/login", { replace: true })} disabled={guardando}>
          Volver a ingresar
        </Button>
      </>
    );
  }

  return (
    <div className="login-page">
      <Header hideMenu />
      <main className="main_home main_home--fullscreen">
        <img src="/fondo.jpg" className="img_fondo" alt="" onError={(e) => (e.target.style.display = "none")} />
        <div className="cont_login">{contenido}</div>
      </main>
      <RecuperarPasswordModal open={pedirOtro} onClose={() => setPedirOtro(false)} />
    </div>
  );
};

export default RestablecerPassword;
