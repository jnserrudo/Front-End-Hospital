import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Alert, Result } from "antd";
import { MailOutlined, IdcardOutlined } from "@ant-design/icons";
import { entorno } from "../services/config.js";
import { friendlyMessage } from "../services/http.js";

/**
 * «¿Olvidaste tu contraseña?»: pide usuario, email o DNI y siempre responde lo mismo
 * (no revela si la cuenta existe). El email trae un enlace de un solo uso.
 */
export const RecuperarPasswordModal = ({ open, onClose, valorInicial = "" }) => {
  const [identificador, setIdentificador] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    if (open) {
      setIdentificador(valorInicial || "");
      setError("");
      setRespuesta("");
    }
  }, [open, valorInicial]);

  const enviar = async () => {
    setError("");
    if (!identificador.trim()) {
      setError("Escribí tu usuario, tu email o tu DNI.");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch(`${entorno}/usuarios/recuperar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador: identificador.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data?.message || "No pudimos enviar el pedido"), { name: "ApiError" });
      setRespuesta(data.message);
    } catch (err) {
      setError(friendlyMessage(err, "No pudimos enviar el pedido. Revisá tu conexión e intentá de nuevo"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="¿Olvidaste tu contraseña?"
      destroyOnClose
      footer={
        respuesta ? (
          <Button type="primary" onClick={onClose}>Volver a ingresar</Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={enviando}>Cancelar</Button>
            <Button type="primary" icon={<MailOutlined />} loading={enviando} onClick={enviar}>
              Enviarme el enlace
            </Button>
          </>
        )
      }
    >
      {respuesta ? (
        <Result
          status="success"
          icon={<MailOutlined style={{ color: "var(--primary, #0369a1)" }} />}
          title="Revisá tu email"
          subTitle={respuesta}
          style={{ padding: "16px 0" }}
          extra={
            <p style={{ fontSize: 13, color: "var(--gray-500)", margin: 0 }}>
              ¿No te llega? Puede que tu cuenta no tenga email cargado. En ese caso pedí que te restablezcan la contraseña en el hospital.
            </p>
          }
        />
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>
            Escribí tu <strong>usuario</strong>, el <strong>email</strong> de tu cuenta o tu <strong>DNI</strong>. Te vamos a mandar un
            enlace para crear una contraseña nueva (en el email también te recordamos tu usuario).
          </p>
          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />}
          <Input
            size="large"
            prefix={<IdcardOutlined style={{ color: "var(--gray-400)" }} />}
            placeholder="Usuario, email o DNI"
            aria-label="Usuario, email o DNI"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            onPressEnter={enviar}
            maxLength={120}
            autoFocus
            autoComplete="username"
          />
        </>
      )}
    </Modal>
  );
};

export default RecuperarPasswordModal;
