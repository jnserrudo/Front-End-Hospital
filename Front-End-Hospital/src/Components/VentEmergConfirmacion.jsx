import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Alert } from "antd";
import { friendlyMessage } from "../services/http";

/**
 * Componente ÚNICO de confirmación de la app.
 *
 * Props:
 *  - title:        pregunta con la acción y el objeto. Ej.: "¿Deshabilitar la receta «Tarta»?"
 *  - mje:          consecuencia / qué va a pasar. Ej.: "Dejará de verse para los pacientes…"
 *  - confirmText:  verbo del botón. Ej.: "Deshabilitar", "Guardar", "Crear usuario"
 *  - cancelText:   por defecto "Cancelar"
 *  - danger:       true para acciones destructivas (botón rojo)
 *  - handleSi:     acción async. Si falla, el diálogo queda abierto mostrando el error.
 *  - errorFallback: texto de contexto si el error no trae un mensaje claro
 *  - onClose / onClosePadre / isOpen
 */
export const VentEmergConfirmacion = ({
  onClosePadre = null,
  title = "¿Confirmás esta acción?",
  mje,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  errorFallback = "No pudimos completar la acción",
  isOpen,
  onClose,
  handleSi,
  children,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen]);

  const handleOk = async () => {
    setConfirmLoading(true);
    setError("");
    try {
      await handleSi?.();
    } catch (err) {
      console.error("[confirmación] La acción falló:", err);
      if (err) err.notified = true;
      setError(friendlyMessage(err, errorFallback));
      setConfirmLoading(false);
      return; // queda abierto para que se vea el error
    }
    setConfirmLoading(false);
    onClose?.();
    if (onClosePadre) onClosePadre();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {danger ? (
            <ExclamationCircleOutlined style={{ color: "var(--danger, #ef4444)", fontSize: 20 }} />
          ) : (
            <QuestionCircleOutlined style={{ color: "var(--primary)", fontSize: 20 }} />
          )}
          <span style={{ fontWeight: 600 }}>{title}</span>
        </div>
      }
      open={isOpen}
      onCancel={confirmLoading ? undefined : onClose}
      closable={!confirmLoading}
      maskClosable={!confirmLoading}
      keyboard={!confirmLoading}
      footer={null}
      width={460}
      centered
      destroyOnClose
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
    >
      <div style={{ padding: "16px 0 20px" }}>
        {mje && <p style={{ fontSize: "0.95rem", color: "var(--gray-700)", margin: 0, lineHeight: 1.5 }}>{mje}</p>}
        {children}
        {error && (
          <Alert
            type="error"
            showIcon
            style={{ marginTop: 16, borderRadius: "var(--radius)" }}
            message={error}
          />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <Button onClick={onClose} size="large" disabled={confirmLoading} style={{ minWidth: 100 }}>
          {cancelText}
        </Button>
        <Button
          type="primary"
          danger={danger}
          onClick={handleOk}
          loading={confirmLoading}
          size="large"
          style={{ minWidth: 120 }}
        >
          {error ? "Reintentar" : confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export const ConfirmDialog = VentEmergConfirmacion;
