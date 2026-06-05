import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditInformacion } from "./EditInformacion";

export const VentEmergenteEditInformacion = ({ isOpen, onClose, informacionSelected }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar Información</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <div style={{ paddingTop: 16 }}>
        <EditInformacion onCloseEdit={onClose} informacion={informacionSelected} />
      </div>
    </Modal>
  );
};
