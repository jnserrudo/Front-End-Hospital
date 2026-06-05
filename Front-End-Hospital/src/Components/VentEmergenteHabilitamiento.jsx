import React, { useState } from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

export const VentEmergenteHabilitamiento = ({
  isOpen,
  onClose,
  mje,
  onClosePadre,
  handleSi,
  pacienteSelected,
}) => {
  const [motivo, setMotivo] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleConfirmar = async () => {
    setConfirmLoading(true);
    try {
      await handleSi(motivo);
    } finally {
      setConfirmLoading(false);
    }
    onClose();
    if (onClosePadre) {
      onClosePadre();
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ExclamationCircleOutlined style={{ color: "var(--warning)" }} />
          <span>Habilitar Paciente</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
    >
      <div style={{ padding: "16px 0" }}>
        <p style={{ fontSize: "1rem", color: "var(--gray-700)", marginBottom: 16 }}>
          {mje}
        </p>

        <FormControl
          className="cont_input_edit"
          variant="floating"
          id="detalle"
          isRequired
        >
          <Textarea
            className="input_edit"
            placeholder=""
            name="motivo"
            size="sm"
            variant="outlined"
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <FormLabel>Motivo</FormLabel>
        </FormControl>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <Button onClick={onClose} size="large">
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={handleConfirmar}
            loading={confirmLoading}
            disabled={motivo.length === 0}
            size="large"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
