import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditReceta } from "./EditReceta";

export const VentEmergenteEditReceta = ({
  isOpen,
  onClose,
  recetaSelected,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar Receta</span>
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
      <EditReceta onCloseEdit={onClose} receta={recetaSelected} />
    </Modal>
  );
};
