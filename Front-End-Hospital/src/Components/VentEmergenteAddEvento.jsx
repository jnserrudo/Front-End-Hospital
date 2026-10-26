import React from "react";
import { Modal } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { AddEvento } from "./AddEvento";

export const VentEmergenteAddEvento = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar evento</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <AddEvento onClosePadre={onClose} />
    </Modal>
  );
};

export default VentEmergenteAddEvento;
