import React, { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";

export const VentEmergConfirmacion = ({
  onClosePadre = null,
  mje,
  isOpen,
  onClose,
  handleSi,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await handleSi();
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
          <ExclamationCircleOutlined style={{ color: "var(--warning)", fontSize: 20 }} />
          <span style={{ fontWeight: 600 }}>Confirmar acción</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      destroyOnClose
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
    >
      <div style={{ padding: "24px 0", textAlign: "center" }}>
        <p style={{ fontSize: "1rem", color: "var(--gray-700)", margin: 0 }}>
          {mje}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <Button onClick={onClose} size="large" style={{ minWidth: 100 }}>
          No
        </Button>
        <Button
          type="primary"
          danger
          onClick={handleOk}
          loading={confirmLoading}
          size="large"
          style={{ minWidth: 100 }}
        >
          Sí
        </Button>
      </div>
    </Modal>
  );
};
