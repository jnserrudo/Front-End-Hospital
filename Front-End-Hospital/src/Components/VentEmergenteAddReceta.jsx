import React from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AddReceta } from "./AddReceta";

export const VentEmergenteAddReceta = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PlusOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar Receta</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      styles={{
        header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 },
        body: { paddingTop: 8 },
      }}
      destroyOnClose
    >
      <AddReceta onClosePadre={onClose} />
    </Modal>
  );
};
