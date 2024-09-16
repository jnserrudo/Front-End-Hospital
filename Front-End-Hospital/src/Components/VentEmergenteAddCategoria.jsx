import React, { useEffect } from "react";
import { EditCategoria } from "./EditCategoria";
import { Button, ButtonGroup } from '@chakra-ui/react'

import { CloseOutlined } from "@ant-design/icons";
import { AddCategoria } from "./AddCategoria";

export const VentEmergenteAddCategoria = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content small mini">
        <div className="header_vent_emergente">
{/*           <h2 className={`popup-title`}>Categoria</h2>
 */}          <CloseOutlined className="icon_accion icons" onClick={onClose} />
        </div>

        <AddCategoria onClosePadre={onClose} />

       {/*  <Button className={`popup-close-btn`} onClick={onClose} colorScheme='blue' >
          Aceptar
        </Button> */}
      </div>
    </div>
  );
};
