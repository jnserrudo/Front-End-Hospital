import React from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AddCategoria } from "./AddCategoria";

export const VentEmergenteAddCategoria = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PlusOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar Categoría</span>
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
        <AddCategoria onClosePadre={onClose} />
      </div>
    </Modal>
  );
};
