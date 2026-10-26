import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { EditCategoria } from "./EditCategoria";

export const VentEmergenteEditCategoria = ({ isOpen, onClose, categoriaSelected }) => {
  // El modal abre en modo lectura; el formulario nos avisa cuando pasa a edición.
  const [editando, setEditando] = useState(false);
  useEffect(() => {
    if (isOpen) setEditando(false);
  }, [isOpen]);
  const nombreItem = categoriaSelected?.nombre ? `: ${categoriaSelected.nombre}` : "";
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {editando ? <EditOutlined style={{ color: "var(--primary)" }} /> : <EyeOutlined style={{ color: "var(--primary)" }} />}
          <span>{editando ? "Editar categoría" : "Detalle de categoría"}{nombreItem}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      styles={{ header: { borderBottom: "1px solid var(--gray-200)", paddingBottom: 12 } }}
      destroyOnClose
    >
      <EditCategoria onCloseEdit={onClose} onModoChange={setEditando} categoria={categoriaSelected} />
    </Modal>
  );
};
