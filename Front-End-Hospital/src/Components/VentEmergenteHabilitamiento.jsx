import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Alert } from "antd";
import { StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { friendlyMessage } from "../services/http";

const { TextArea } = Input;
const MIN_MOTIVO = 5;

/**
 * Confirmación para habilitar o deshabilitar a un paciente, con motivo obligatorio
 * (queda en su historial). Si la acción falla, el modal queda abierto con el error.
 */
export const VentEmergenteHabilitamiento = ({ isOpen, onClose, accion = "deshabilitar", nombre = "el paciente", handleSi }) => {
  const [motivo, setMotivo] = useState("");
  const [tocado, setTocado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const deshabilitar = accion === "deshabilitar";

  useEffect(() => {
    if (isOpen) {
      setMotivo("");
      setTocado(false);
      setError("");
    }
  }, [isOpen]);

  const motivoValido = motivo.trim().length >= MIN_MOTIVO;

  const confirmar = async () => {
    setTocado(true);
    if (!motivoValido) return;
    setLoading(true);
    setError("");
    try {
      await handleSi(motivo.trim());
      onClose();
    } catch (err) {
      console.error("[habilitación] Falló:", err);
      if (err) err.notified = true;
      setError(friendlyMessage(err, `No pudimos ${accion} a ${nombre}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {deshabilitar ? (
            <StopOutlined style={{ color: "var(--danger, #ef4444)" }} />
          ) : (
            <CheckCircleOutlined style={{ color: "var(--success, #10b981)" }} />
          )}
          <span>{deshabilitar ? `¿Deshabilitar a ${nombre}?` : `¿Habilitar a ${nombre}?`}</span>
        </div>
      }
      open={isOpen}
      onCancel={loading ? undefined : onClose}
      closable={!loading}
      maskClosable={!loading}
      footer={null}
      width={500}
      centered
      destroyOnClose
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
    >
      <div style={{ padding: "16px 0" }}>
        <p style={{ fontSize: "0.95rem", color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.5 }}>
          {deshabilitar
            ? `${nombre} no va a poder ingresar a la app hasta que lo vuelvas a habilitar. Sus datos e historial se conservan.`
            : `${nombre} va a poder volver a ingresar a la app con su usuario y contraseña.`}
        </p>
        <label htmlFor="motivo-habilitacion" style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
          Motivo <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <TextArea
          id="motivo-habilitacion"
          rows={3}
          maxLength={500}
          showCount
          value={motivo}
          status={tocado && !motivoValido ? "error" : ""}
          placeholder={deshabilitar ? "Ej.: Finalizó el programa / pidió la baja" : "Ej.: Retoma el tratamiento"}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <div style={{ fontSize: 12, marginTop: 4, color: tocado && !motivoValido ? "#ef4444" : "var(--gray-500)" }}>
          {tocado && !motivoValido
            ? `Escribí el motivo (al menos ${MIN_MOTIVO} caracteres).`
            : "Queda guardado en el historial del paciente, con tu nombre y la fecha."}
        </div>
        {error && <Alert type="error" showIcon message={error} style={{ marginTop: 12 }} />}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <Button onClick={onClose} size="large" disabled={loading}>
            Cancelar
          </Button>
          <Button type="primary" danger={deshabilitar} onClick={confirmar} loading={loading} size="large">
            {error ? "Reintentar" : deshabilitar ? "Deshabilitar" : "Habilitar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
