import React from "react";
import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { AddFAQ } from "./AddFAQ";

export const VentEmergenteAddFAQ = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <QuestionCircleOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar Pregunta Frecuente</span>
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
        <AddFAQ onClosePadre={onClose} />
      </div>
    </Modal>
  );
};

export default VentEmergenteAddFAQ;
