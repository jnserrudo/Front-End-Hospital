import React from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AddEjercicio } from "./AddEjercicio";

export const VentEmergenteAddEjercicio = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PlusOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar Ejercicio</span>
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
        <AddEjercicio />
      </div>
    </Modal>
  );
};
