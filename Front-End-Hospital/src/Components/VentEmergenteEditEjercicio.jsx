import React from "react";
import { Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { EditEjercicio } from "./EditEjercicio";

export const VentEmergenteEditEjercicio = ({
  isOpen,
  onClose,
  ejercicioSelected,
}) => {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EditOutlined style={{ color: "var(--primary)" }} />
          <span>Editar Ejercicio</span>
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
        <EditEjercicio onCloseEdit={onClose} ejercicio={ejercicioSelected} />
      </div>
    </Modal>
  );
};
