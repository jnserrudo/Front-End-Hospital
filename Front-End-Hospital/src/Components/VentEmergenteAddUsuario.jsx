import React, { useEffect } from "react";
import { EditUsuario } from "./EditUsuario";

import { CloseOutlined } from "@ant-design/icons";
import { AddUsuario } from "./AddUsuario";

export const VentEmergenteAddUsuario = ({ isOpen, onClose }) => {
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
        <AddUsuario />
        {/*         <button className={`popup-close-btn`} onClick={onClose}>Aceptar</button>
         */}{" "}
      </div>
    </div>
  );
};
