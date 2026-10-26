import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditEvento } from "./EditEvento";

export const VentEmergenteEditEvento = ({ isOpen, eventoSelected, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar evento{eventoSelected?.titulo ? `: ${eventoSelected.titulo}` : ""}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditEvento evento={eventoSelected} onCloseEdit={onClose} />
    </Modal>
  );
};

export default VentEmergenteEditEvento;
