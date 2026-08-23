import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditPaciente } from "./EditPaciente";

export const VentEmergenteEditPaciente = ({
  isOpen,
  onClose,
  pacienteSelected,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar Paciente</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditPaciente onCloseEdit={onClose} paciente={pacienteSelected} />
    </Modal>
  );
};
