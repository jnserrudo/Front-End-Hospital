import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditPatologia } from "./EditPatologia";

export const VentEmergenteEditPatologia = ({
  isOpen,
  onClose,
  patologiaSelected,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar Patología</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditPatologia onCloseEdit={onClose} patologia={patologiaSelected} />
    </Modal>
  );
};
