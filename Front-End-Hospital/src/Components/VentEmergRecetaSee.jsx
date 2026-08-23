import React from "react";
import { Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { RecetaSee } from "./RecetaSee";

export const VentEmergenteRecetaSee = ({ isOpen, onClose, recetaSelected }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EyeOutlined style={{ color: "var(--primary)" }} />
          <span>Ver Receta</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      styles={{
        header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 },
        body: { paddingTop: 8 },
      }}
      destroyOnClose
    >
      <RecetaSee receta={recetaSelected} />
    </Modal>
  );
};
