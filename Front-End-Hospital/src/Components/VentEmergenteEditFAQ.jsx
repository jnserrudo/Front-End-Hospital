import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditFAQ } from "./EditFAQ";

export const VentEmergenteEditFAQ = ({ isOpen, faqSelected, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar pregunta frecuente{faqSelected?.pregunta ? `: ${faqSelected.pregunta}` : ""}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditFAQ faq={faqSelected} onCloseEdit={onClose} />
    </Modal>
  );
};

export default VentEmergenteEditFAQ;
