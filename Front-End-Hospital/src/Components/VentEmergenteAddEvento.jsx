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
          <span>Agregar Evento</span>
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
        <AddEvento onClosePadre={onClose} />
      </div>
    </Modal>
  );
};

export default VentEmergenteAddEvento;
