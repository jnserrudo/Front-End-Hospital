import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { EditPatologia } from "./EditPatologia";

export const VentEmergenteEditPatologia = ({
  isOpen,
  onClose,
  patologiaSelected,
}) => {
  // El modal abre en modo lectura; el formulario nos avisa cuando pasa a edición.
  const [editando, setEditando] = useState(false);
  useEffect(() => {
    if (isOpen) setEditando(false);
  }, [isOpen]);
  const nombreItem = patologiaSelected?.nombre ? `: ${patologiaSelected.nombre}` : "";
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {editando ? <EditOutlined style={{ color: "var(--primary)" }} /> : <EyeOutlined style={{ color: "var(--primary)" }} />}
          <span>{editando ? "Editar patología" : "Detalle de patología"}{nombreItem}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditPatologia onCloseEdit={onClose} onModoChange={setEditando} patologia={patologiaSelected} />
    </Modal>
  );
};
