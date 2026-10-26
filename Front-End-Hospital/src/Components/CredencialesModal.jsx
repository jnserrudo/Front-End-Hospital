import React, { useState } from "react";
import { Modal, Alert, Input, Button, Typography } from "antd";
import { CopyOutlined, CheckOutlined, KeyOutlined } from "@ant-design/icons";
import { notify } from "../ui/notify";

/**
 * Muestra UNA sola vez la contraseña temporal cuando no se pudo enviar por email,
 * para que el administrador se la entregue a la persona.
 * datos: { nombre, usuario, password, motivo, titulo }
 */
export const CredencialesModal = ({ datos, onClose }) => {
  const [copiado, setCopiado] = useState(false);
  if (!datos) return null;

  const copiar = async () => {
    const texto = `Usuario: ${datos.usuario}\nContraseña temporal: ${datos.password}`;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      notify.success("Copiamos el usuario y la contraseña temporal.");
    } catch {
      notify.warning("No pudimos copiar automáticamente. Seleccioná el texto y copialo a mano.");
    }
  };

  return (
    <Modal
      open
      centered
      width={520}
      maskClosable={false}
      onCancel={onClose}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <KeyOutlined style={{ color: "var(--primary)" }} /> {datos.titulo || "Contraseña temporal"}
        </span>
      }
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          Ya la anoté, cerrar
        </Button>,
      ]}
    >
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message={datos.motivo === "EMAIL_INVALIDO" ? "El email cargado no parece válido, así que no lo enviamos" : "No pudimos enviar el email en este momento"}
        description={`Entregale estos datos a ${datos.nombre} por otro medio (en persona, por teléfono o WhatsApp). Esta es la única vez que se muestran.`}
      />
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          <Typography.Text type="secondary">Usuario</Typography.Text>
          <Input value={datos.usuario} readOnly />
        </label>
        <label>
          <Typography.Text type="secondary">Contraseña temporal</Typography.Text>
          <Input value={datos.password} readOnly style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 1 }} />
        </label>
        <Button icon={copiado ? <CheckOutlined /> : <CopyOutlined />} onClick={copiar}>
          {copiado ? "Copiado" : "Copiar usuario y contraseña"}
        </Button>
      </div>
      <p style={{ marginTop: 16, marginBottom: 0, color: "var(--gray-600)" }}>
        En su primer ingreso la app le va a pedir que cree una contraseña nueva. Si más adelante la olvida, puede usar «¿Olvidaste tu contraseña?» en la pantalla de ingreso (le llega un enlace a su email) o vos podés usar «Restablecer contraseña».
      </p>
    </Modal>
  );
};

export default CredencialesModal;
