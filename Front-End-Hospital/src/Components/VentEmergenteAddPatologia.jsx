import React, { useEffect } from "react";
import { EditPatologia } from "./EditPatologia";
import { Button, ButtonGroup } from '@chakra-ui/react'

import { CloseOutlined } from "@ant-design/icons";
import { AddPatologia } from "./AddPatologia";

export const VentEmergenteAddPatologia = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <div className="header_vent_emergente">
          <h2 className={`popup-title`}>Patologia</h2>
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>

        <AddPatologia onClosePadre={onClose} />

        <Button className={`popup-close-btn`} onClick={onClose} colorScheme='blue' >
          Aceptar
        </Button>
      </div>
    </div>
  );
};
