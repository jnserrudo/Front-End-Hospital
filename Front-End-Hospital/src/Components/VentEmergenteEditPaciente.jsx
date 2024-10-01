import React, { useEffect } from "react";
import { EditPaciente } from "./EditPaciente";

import { CloseOutlined } from "@ant-design/icons";

export const VentEmergenteEditPaciente = ({
  isOpen,
  onClose,
  pacienteSelected,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="popup-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="popup-content medium">
        <div className="header_vent_emergente">
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>
        <EditPaciente onCloseEdit={onClose} paciente={pacienteSelected} />
        
      </div>
    </div>
  );
};
