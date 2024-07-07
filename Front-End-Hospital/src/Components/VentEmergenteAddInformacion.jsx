import React, { useEffect } from "react";
import { EditInformacion } from "./EditInformacion";
import { Button, ButtonGroup } from '@chakra-ui/react'

import { CloseOutlined } from "@ant-design/icons";
import { AddInformacion } from "./AddInformacion";

export const VentEmergenteAddInformacion = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content small">
        <div className="header_vent_emergente">
          <h2 className={`popup-title`}>Informacion</h2>
          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>

        <AddInformacion onClosePadre={onClose} />

       {/*  <Button className={`popup-close-btn`} onClick={onClose} colorScheme='blue' >
          Aceptar
        </Button> */}
      </div>
    </div>
  );
};
