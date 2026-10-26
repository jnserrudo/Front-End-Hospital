import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { EditEjercicio } from "./EditEjercicio";

export const VentEmergenteEditEjercicio = ({
  isOpen,
  onClose,
  ejercicioSelected,
}) => {
  // El modal abre en modo lectura; el formulario nos avisa cuando pasa a edición.
  const [editando, setEditando] = useState(false);
  useEffect(() => {
    if (isOpen) setEditando(false);
  }, [isOpen]);
  const nombreItem = ejercicioSelected?.nombre ? `: ${ejercicioSelected.nombre}` : "";
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {editando ? <EditOutlined style={{ color: "var(--primary)" }} /> : <EyeOutlined style={{ color: "var(--primary)" }} />}
          <span>{editando ? "Editar ejercicio" : "Detalle de ejercicio"}{nombreItem}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditEjercicio onCloseEdit={onClose} onModoChange={setEditando} ejercicio={ejercicioSelected} />
    </Modal>
  );
};
