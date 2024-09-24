import React, { useEffect } from "react";
import { EditUsuario } from "./EditUsuario";

import { CloseOutlined } from "@ant-design/icons";

export const VentEmergenteEditUsuario = ({
  isOpen,
  onClose,
  usuarioSelected,
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
      {" "}
      <div className="popup-content medium">
        <div className="header_vent_emergente">
          {/*         <h2 className={`popup-title`} >Usuario</h2>
           */}{" "}
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>
        <EditUsuario onCloseEdit={onClose} usuario={usuarioSelected} />
        {/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
         */}{" "}
      </div>
    </div>
  );
};
