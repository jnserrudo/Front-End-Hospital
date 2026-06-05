import React from "react";
import { Modal } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { AddPaciente } from "./AddPaciente";

export const VentEmergenteAddPaciente = ({ isOpen, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <UserAddOutlined style={{ color: "var(--primary)" }} />
          <span>Agregar Paciente</span>
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
        <AddPaciente onClosePadre={onClose} />
      </div>
    </Modal>
  );
};

export default VentEmergenteAddPaciente;
